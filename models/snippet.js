const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const snippetSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true
  },
  storedAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Snippet', snippetSchema, 'snippets');
