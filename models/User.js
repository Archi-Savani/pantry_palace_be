// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // name must be given
        },
        email: {
            type: String,
            required: true, // email must be given
            unique: true,   // no duplicate emails
        },
        password: {
            type: String,
            required: true, // password must be given
        },
        confirmPassword: {
            type: String,
            required: true, // confirm password must be given
        },
        isAdmin: {
            type: Boolean,
            default: false, // default to regular user
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
