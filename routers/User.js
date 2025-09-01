import express from "express";
import { 
    registerUser, 
    loginUser, 
    getUserProfile, 
    updateUserProfile, 
    changePassword,
    getAllUsers,
    updateUserByAdmin,
    deleteUserByAdmin
} from "../controllers/User.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (require authentication)
router.get("/profile", authenticateToken, getUserProfile);
router.put("/profile", authenticateToken, updateUserProfile);
router.put("/change-password", authenticateToken, changePassword);

// Admin routes (require authentication + admin privileges)
router.get("/all", authenticateToken, getAllUsers);
router.put("/:userId", authenticateToken, updateUserByAdmin);
router.delete("/:userId", authenticateToken, deleteUserByAdmin);

export default router;
