// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require("../midleware/authMiddleware");
const {
  getAllPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment
} = require('../controllers/postControllers');
const { Joi, validate } = require("../midleware/validation");

const postSchema = Joi.object({
  title: Joi.string().required().max(100),
  content: Joi.string().required(),
  featuredImage: Joi.string(),
  excerpt: Joi.string().max(200),
  category: Joi.string().required(), // Assuming category ID
  tags: Joi.array().items(Joi.string()),
  isPublished: Joi.boolean(),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  content: Joi.string().optional(),
  featuredImage: Joi.string().optional(),
  excerpt: Joi.string().max(200).optional(),
  category: Joi.string().optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  isPublished: Joi.boolean().optional(),
});

const commentSchema = Joi.object({
    content: Joi.string().required(),
});

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPost);

// Protected routes
router.use(protect); // All routes below this will be protected
router.post('/', validate(postSchema), createPost);
router.put('/:id', validate(postUpdateSchema), updatePost); // Use postUpdateSchema
router.delete('/:id', deletePost);
router.post('/:id/comments', validate(commentSchema), addComment);

module.exports = router;