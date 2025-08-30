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

        // 5. create new user (⚠️ don’t save confirmPassword in DB)
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
