// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "fruit",
                "vegetable",
                "dairy",
                "meat",
                "seafood",
                "bakery",
                "pantry",
                "frozen",
                "beverages",
                "snacks",
            ], // dropdown options
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: String, // will store image URL or file path
            required: true,
        },
        description: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
