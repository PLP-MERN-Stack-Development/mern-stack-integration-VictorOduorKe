// routes/categoryRoutes.js
const express = require('express');
const router = express.Router();
const { protect, authorize } = require("../midleware/authMiddleware");
const {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { Joi, validate } = require("../midleware/validation");

const categorySchema = Joi.object({
    name: Joi.string().required().max(50),
    description: Joi.string().max(200),
    isActive: Joi.boolean(),
});

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategory);

// Protected routes
router.use(protect); // All routes below this will be protected
router.post('/', authorize('admin'), validate(categorySchema), createCategory);
router.put('/:id', authorize('admin'), validate(categorySchema), updateCategory);
router.delete('/:id', authorize('admin'), deleteCategory);

module.exports = router;