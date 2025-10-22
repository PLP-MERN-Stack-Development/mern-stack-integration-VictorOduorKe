// controllers/postController.js
const Post = require('../models/Post');
const Category = require('../models/Category');
const mongoose = require('mongoose');

// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, published, search } = req.query;
    
    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if (published !== undefined) filter.isPublished = published === 'true';
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const posts = await Post.find(filter)
      .populate('author', 'username email role') // Populate author with role
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    console.log("postControllers.js: Posts fetched:", posts); // Debugging: Check if slug is present

    const total = await Post.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      pages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
      error: error.message
    });
  }
};

// Get single post by ID or slug
const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    
    let post;
    if (mongoose.Types.ObjectId.isValid(id)) {
      // If it's a valid ObjectId, search by ID
      post = await Post.findById(id)
        .populate('author', 'username email role') // Populate author with role
        .populate('category', 'name slug')
        .populate('comments.user', 'username'); // Populate comment author
    } else {
      // Otherwise search by slug
      post = await Post.findOne({ slug: id })
        .populate('author', 'username email role') // Populate author with role
        .populate('category', 'name slug')
        .populate('comments.user', 'username'); // Populate comment author
    }

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Increment view count
    await post.incrementViewCount();

    res.status(200).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
      error: error.message
    });
  }
};

// Create new post
const createPost = async (req, res) => {
  try {
    const { title, content, featuredImage, excerpt, category, tags, isPublished } = req.body;
    const {user_id}=req.params
    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Post title is required'
      });
    }

    console.log("postControllers.js: createPost - req.body:", req.body); // Debugging: log incoming request body
    console.log("postControllers.js: createPost - req.user:", req.user); // Debugging: log authenticated user

    // Generate slug from title
    const slug = Post.generateSlug(title);

    const post = await Post.create({
      ...req.body,
      author: req.user._id, // Assuming author is set from authenticated user
      slug,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Post with this title already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating post',
      error: error.message
    });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    let postToUpdate = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      postToUpdate = await Post.findById(id);
    } else {
      postToUpdate = await Post.findOne({ slug: id });
    }

    if (!postToUpdate) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if the authenticated user is the author or an admin
    if (postToUpdate.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this post'
      });
    }

    // If category is being updated, verify it exists
    if (updateData.category) {
      const categoryExists = await Category.findById(updateData.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category not found'
        });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postToUpdate._id, // Use the found post's _id for update
      updateData,
      { new: true, runValidators: true }
    )
      .populate('author', 'username email role')
      .populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: updatedPost
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating post',
      error: error.message
    });
  }
};

// Delete post
const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID'
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Check if the authenticated user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this post'
      });
    }

    await Post.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
      error: error.message
    });
  }
};

// Add comment to post
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    await post.addComment(req.user?.id, content);

    res.status(201).json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message
    });
  }
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment
};