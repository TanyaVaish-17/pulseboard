const Post = require('../models/Post');
const User = require('../models/User');

// @POST /api/posts — create post
const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    const image = req.file?.path || '';

    if (!text && !image)
      return res.status(400).json({ message: 'Post must have text or image' });

    const user = await User.findById(req.user.id);

    const post = await Post.create({
      user: user._id,
      username: user.name,
      handle: user.handle,
      avatar: user.avatar,
      text,
      image,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @GET /api/posts — get all posts
const getPosts = async (req, res) => {
  try {
    const { filter, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let sortOption = { createdAt: -1 };
    if (filter === 'mostLiked') sortOption = { likesCount: -1 };
    if (filter === 'mostCommented') sortOption = { commentsCount: -1 };

    const posts = await Post.aggregate([
      {
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
        }
      },
      { $sort: sortOption },
      { $skip: skip },
      { $limit: Number(limit) },
    ]);

    const total = await Post.countDocuments();

    res.json({
      posts,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @PUT /api/posts/:id/like — toggle like
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.user.id);
    const alreadyLiked = post.likes.includes(req.user.id);

    if (alreadyLiked) {
      post.likes = post.likes.filter((uid) => uid.toString() !== req.user.id);
      post.likedUsernames = post.likedUsernames.filter((u) => u !== user.name);
    } else {
      post.likes.push(req.user.id);
      post.likedUsernames.push(user.name);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @POST /api/posts/:id/comment — add comment
const commentPost = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const user = await User.findById(req.user.id);

    post.comments.push({
      user: user._id,
      username: user.name,
      handle: user.handle,
      text,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @DELETE /api/posts/:id — delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.user.toString() !== req.user.id)
      return res.status(401).json({ message: 'Not authorized' });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createPost, getPosts, likePost, commentPost, deletePost };