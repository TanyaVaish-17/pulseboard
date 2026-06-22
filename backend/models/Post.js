const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },
  handle: { type: String },
  text: { type: String, required: true },
}, { timestamps: true });

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  handle: { type: String, required: true },
  avatar: { type: String, default: '' },
  text: { type: String, default: '' },
  image: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likedUsernames: [{ type: String }],
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);