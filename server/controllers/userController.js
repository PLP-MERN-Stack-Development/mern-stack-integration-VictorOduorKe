const User = require("../models/User");
const mongoose=require("mongoose")
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Get user by ID
const getUser = async (req, res) => {
    try {
        console.log("Attempting to get user by ID:", req.params.id);
        const { id } = req.params;
        
        if (!id) {
            console.log("User ID is required");
            return res.status(400).json({ message: "User ID is required" });
        }

        const user = await User.findById(id).select('-password'); // Exclude password
        
        if (!user) {
            console.log("User not found for ID:", id);
            return res.status(404).json({ message: "User not found" });
        }
        
        console.log("User found:", user);
        return res.status(200).json({ message: "User found", data: user });
    } catch (error) {
        console.error("Error in getUser:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid user ID format" });
        }
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Get user profile
const getProfile = async (req, res) => {
    try {
        console.log("Attempting to get user profile for user ID:", req.user._id);
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            console.log("User profile found:", user.email);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role, // Include role
            });
        } else {
            console.log("User not found for profile request:", req.user._id);
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: 'Error getting profile', error: error.message });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        console.log("Attempting to get all users");
        const users = await User.find().select('-password'); // Exclude passwords
        console.log("Retrieved users count:", users.length);
        return res.status(200).json({ 
            message: "Users retrieved successfully", 
            data: users,
            count: users.length 
        });
    } catch (error) {
        console.error("Error in getAllUsers:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

// Register user
const registerUser = async (req, res) => {
    try {
        console.log("Register user request body:", req.body);
        const { username, email, password } = req.body;

        const user = await User.create({
            username,
            email,
            password,
        });

        if (user) {
            console.log("User registered successfully:", user.email);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role, // Include role
                token: generateToken(user._id),
            });
        } else {
            console.log("Invalid user data during registration");
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Error in registerUser:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'User with that email or username already exists' });
        }
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        console.log("Login user request body:", req.body);
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            console.log("User logged in successfully:", user.email);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role, // Include role
                token: generateToken(user._id),
            });
        } else {
            console.log("Invalid email or password for user:", email);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log("Attempting to delete user by ID:", req.params.id);
        const { id } = req.params;
        
        // Validate ID exists
        if (!id) {
            console.log("User ID is required for deletion");
            return res.status(400).json({ 
                success: false,
                message: "User ID is required" 
            });
        }

        // Validate ID format (MongoDB ObjectId)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid user ID format for deletion:", id);
            return res.status(400).json({ 
                success: false,
                message: "Invalid user ID format" 
            });
        }

        // Check if user exists before deleting
        const existingUser = await User.findById(id);
        if (!existingUser) {
            console.log("User not found for deletion:", id);
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Delete user
        const deletedUser = await User.findByIdAndDelete(id);
        
        console.log("User deleted successfully:", deletedUser.email);
        return res.status(200).json({ 
            success: true,
            message: "User deleted successfully",
            data: {
                id: deletedUser._id,
                username: deletedUser.username,
                email: deletedUser.email
            }
        });
        
    } catch (error) {
        console.error("Delete user error:", error);
        return res.status(500).json({ 
            success: false,
            message: "Error deleting user",
            error: error.message 
        });
    }
}

const updateUser = async (req, res) => {
    try {
        console.log("Attempting to update user by ID:", req.params.id, "with data:", req.body);
        const { id } = req.params;
        const { username, email } = req.body; // Get data from request body
        
        // Validate ID
        if (!id) {
            console.log("User ID is required for update");
            return res.status(400).json({ 
                success: false,
                message: "User ID is required" 
            });
        }

        // Check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            console.log("User not found for update:", id);
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Check if at least one field is provided for update
        if (!username && !email) {
            console.log("No update fields provided for user:", id);
            return res.status(400).json({ 
                success: false,
                message: "At least one field (username or email) is required for update" 
            });
        }

        // Prepare update data
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            updateData, 
            { 
                new: true, // Return updated document
                runValidators: true // Run model validators
            }
        ).select('-password'); // Exclude password from response

        console.log("User updated successfully:", updatedUser.email);
        return res.status(200).json({ 
            success: true,
            message: "User updated successfully",
            data: updatedUser
        });
        
    } catch (error) {
        console.error("Update user error:", error);
        
        // Handle duplicate key error (unique fields)
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({ 
                success: false,
                message: `User with this ${field} already exists` 
            });
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                success: false,
                message: "Validation error",
                errors: errors 
            });
        }
        
        return res.status(500).json({ 
            success: false,
            message: "Error updating user",
            error: error.message 
        });
    }
}

module.exports = { getUser, getAllUsers, registerUser, loginUser, deleteUser, updateUser, getProfile };