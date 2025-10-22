const express = require("express");
const route = express.Router();
const { Joi, validate } = require("../midleware/validation");
const { protect, authorize } = require("../midleware/authMiddleware");
const {
    getUser,
    getAllUsers,
    registerUser,
    loginUser,
    deleteUser,
    updateUser,
    getProfile
}=require("../controllers/userController")

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

// Public routes
route.post('/register', validate(registerSchema), registerUser);
route.post('/login', validate(loginSchema), loginUser);

// Protected routes
route.use(protect); // All routes below this will be protected
route.get('/profile', getProfile); // Get authenticated user profile
route.get("/:id", getUser);
route.get('/', getAllUsers); // This route might need protection later
route.delete('/:id', authorize('admin'), deleteUser);
route.put('/:id', updateUser);

module.exports=route