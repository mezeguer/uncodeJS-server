const express = require('express');
const router = express.Router();

var mongoose = require('mongoose');

const User = require('../models/user');
const Snippet = require('../models/snippet');

router.get('/', (req, res) => res.status(200).json({message: 'awesome'}));

router.post('/login', async (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'A body element is necessary in the request object' });
  if (!req.body.name) return res.status(400).json({ message: 'The user\'s name cannot be empty' });
  if (!req.body.email) return res.status(400).json({ message: 'The user\'s email cannot be empty' });
  if (!req.body.picture) return res.status(400).json({ message: 'The user\'s picture object cannot be empty' });
  if (!req.body.picture.data) return res.status(400).json({ message: 'The user\'s picture data object cannot be empty' });

  const name = req.body.name;
  const facebookId = req.body.id;
  const email = req.body.email;
  const pictureUrl = req.body.picture.data.url;

  const newUser = User({ name, facebookId, email, pictureUrl });

  const dbUser = await User.findOne({ facebookId: facebookId }).catch(err => console.error(err));
  if (dbUser) return res.status(200).json({message: 'login ok'});
  const savedUser = await newUser.save().catch(err => console.error(err));
  if (savedUser) return res.status(200).json({message: 'signup ok'});
  return res.status(500).json({ message: 'server side error', error: err})
});

router.post('/snippet/save', async (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'A body element is necessary in the request object' });
  if (!req.body.userId) return res.status(400).json({ message: 'The user\'s Id cannot be empty' });
  if (!req.body.title || !req.body.title.length) return res.status(400).json({ message: 'The snippet\'s title cannot be empty' });
  if (!req.body.code || !req.body.code.length) return res.status(400).json({ message: 'The snippet\'s code cannot be empty' });

  const userId = req.body.userId;
  const title = req.body.title;
  const code = req.body.code;
  const storedAt = new Date();

  const newSnippet = Snippet({ userId, title, code, storedAt })

  const existingSnippet = await Snippet.findOne({$and: [{title: title}, {userId: userId}]}).catch(err => console.error('wat', err));
  if (existingSnippet) return res.status(203).json({ message: 'you already have a snippet with that title'})
  const savedSnippet = await newSnippet.save().catch(err => console.error('is', err));
  if (savedSnippet) {
    const updatedUser = await User.findOneAndUpdate({facebookId: userId}, {$push: {snippets: savedSnippet}})
    if (updatedUser) return res.status(200).json({ message: 'snippet saved and user updated!' })
    Snippet.findOneAndRemove({userId: userId})
  }
  return res.status(500).json({ message: 'internal server failure' })
});

router.get('/snippet/:id', async (req, res) => {
  const userId = req.params.id;
  const snippetList = await Snippet.find({userId: userId}).catch(err => console.error('wat', err));
  if (snippetList) return res.status(200).json({message: 'ok', snippetList: snippetList})
  return res.status(500).json({ message: 'internal server failure' })
});

module.exports = router;