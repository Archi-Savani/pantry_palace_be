// models/Cart.js
import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        qty: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
        },
    },
    { timestamps: true }
);

// Compound index to ensure unique product-user combinations
cartSchema.index({ productId: 1, userId: 1 }, { unique: true });

export default mongoose.model("Cart", cartSchema);
