const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxLength: [10, "Username cannot be longer than 10 chars"],
        minLength: [3, "Include more than three chars"]
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensure emails are unique
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must be at least 8 characters long"],
        maxLength: [128, "Password cannot exceed 128 characters"],
        validate: {
            validator: function(password) {
                // At least one uppercase, one lowercase, one number, one special character
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password);
            },
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;