import express from "express";
import { 
    addToCart, 
    getUserCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartItem 
} from "../controllers/Cart.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticateToken);

// Add item to cart
router.post("/", addToCart);

// Get user's cart
router.get("/", getUserCart);

// Get specific cart item
router.get("/:cartItemId", getCartItem);

// Update cart item quantity
router.put("/:cartItemId", updateCartItem);

// Remove item from cart
router.delete("/:cartItemId", removeFromCart);

// Clear entire cart
router.delete("/clear", clearCart);

export default router;
