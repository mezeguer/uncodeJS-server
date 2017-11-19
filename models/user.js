const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  facebookId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  pictureUrl: {
    type: String
  },
  snippets: {
    type: [Schema.Types.ObjectId],
    ref: 'Snippet',
    default: []
  }
});

module.exports = mongoose.model('User', userSchema, 'users');
