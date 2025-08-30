import { uploadFile } from "../utils/upload.js";
import Product from "../models/Product.js";

// 👉 Insert (Create) Product
export const createProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Upload to Cloudinary
        const imageUrl = await uploadFile(req.file.buffer);

        const product = new Product({
            name,
            category,
            price,
            description,
            image: imageUrl,
        });

        await product.save();
        res.status(201).json({ message: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 👉 Get All Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 👉 Get Single Product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 👉 Update Product
export const updateProduct = async (req, res) => {
    try {
        const { name, category, price, description } = req.body;
        const file = req.file;

        let updateData = { name, category, price, description };

        if (file) {
            // Upload new image if provided
            const imageUrl = await uploadFile(file.buffer);
            updateData.image = imageUrl;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// 👉 Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
