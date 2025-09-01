// controllers/authController.js
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// REGISTER USER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // 1. check if all fields are provided
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. check if password matches confirmPassword
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 3. check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        // 4. hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. create new user (⚠️ don't save confirmPassword in DB)
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword, // 👈 because your schema requires it
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// LOGIN USER
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if both fields are provided
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // payload
            process.env.JWT_SECRET,              // secret key from .env
            { expiresIn: "7d" }                  // token expiry
        );

        // 5. Remove password before sending response
        const { password: pwd, confirmPassword, ...userData } = user._doc;

        // 6. Success response
        res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password -confirmPassword");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User profile retrieved successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE USER PROFILE
export const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // Update fields
        if (name) user.name = name;
        if (email) user.email = email;

        await user.save();

        // Remove password from response
        const { password, confirmPassword, ...userData } = user._doc;

        res.status(200).json({
            message: "User profile updated successfully",
            user: userData,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// CHANGE PASSWORD
export const changePassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            return res.status(400).json({ message: "All password fields are required" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New passwords do not match" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedNewPassword;
        user.confirmPassword = hashedNewPassword;
        await user.save();

        res.status(200).json({
            message: "Password changed successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET ALL USERS (ADMIN ONLY)
export const getAllUsers = async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const users = await User.find({}).select("-password -confirmPassword");

        res.status(200).json({
            message: "Users retrieved successfully",
            users,
            totalUsers: users.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE USER BY ADMIN
export const updateUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, isAdmin } = req.body;

        // Check if current user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if email is being changed and if it already exists
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // Update fields
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (isAdmin !== undefined) user.isAdmin = isAdmin;

        await user.save();

        // Remove password from response
        const { password, confirmPassword, ...userData } = user._doc;

        res.status(200).json({
            message: "User updated successfully",
            user: userData,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// DELETE USER BY ADMIN
export const deleteUserByAdmin = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if current user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." });
        }

        // Prevent admin from deleting themselves
        if (userId === req.user.id) {
            return res.status(400).json({ message: "Cannot delete your own account" });
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
