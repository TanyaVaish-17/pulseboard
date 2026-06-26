const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { upload } = require('../config/cloudinary');
const { createPost, getPosts, likePost, commentPost, deletePost } = require('../controllers/postController');

router.get('/', protect, getPosts);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentPost);
router.delete('/:id', protect, deletePost);

module.exports = router;