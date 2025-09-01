// controllers/Cart.js
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
    try {
        const { productId, qty = 1 } = req.body;
        const userId = req.user.id; // from auth middleware

        // Validate input
        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        if (qty < 1) {
            return res.status(400).json({ message: "Quantity must be at least 1" });
        }

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Check if item already exists in cart
        let cartItem = await Cart.findOne({ productId, userId });

        if (cartItem) {
            // Update quantity if item already exists
            cartItem.qty += qty;
            await cartItem.save();
        } else {
            // Create new cart item
            cartItem = new Cart({
                productId,
                userId,
                qty,
            });
            await cartItem.save();
        }

        // Populate product details
        await cartItem.populate("productId");

        res.status(201).json({
            message: "Item added to cart successfully",
            cartItem,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET USER'S CART
export const getUserCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cartItems = await Cart.find({ userId }).populate("productId");

        res.status(200).json({
            message: "Cart retrieved successfully",
            cartItems,
            totalItems: cartItems.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const { qty } = req.body;
        const userId = req.user.id;

        if (!qty || qty < 1) {
            return res.status(400).json({ message: "Valid quantity is required" });
        }

        const cartItem = await Cart.findOne({ _id: cartItemId, userId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        cartItem.qty = qty;
        await cartItem.save();

        await cartItem.populate("productId");

        res.status(200).json({
            message: "Cart item updated successfully",
            cartItem,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user.id;

        const cartItem = await Cart.findOneAndDelete({ _id: cartItemId, userId });

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({
            message: "Item removed from cart successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// CLEAR USER'S CART
export const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await Cart.deleteMany({ userId });

        res.status(200).json({
            message: "Cart cleared successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// GET CART ITEM BY ID
export const getCartItem = async (req, res) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user.id;

        const cartItem = await Cart.findOne({ _id: cartItemId, userId }).populate("productId");

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({
            message: "Cart item retrieved successfully",
            cartItem,
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
