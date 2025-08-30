import express from "express";
import upload from "../middleware/multer.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/Product.js";

const router = express.Router();

// Routes with image upload
router.post("/", upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.put("/:id", upload.single("image"), updateProduct);
router.get("/:id", getProductById);
router.delete("/:id", deleteProduct);

export default router;
