import express from "express";
import upload from "../middleware/multer.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controllers/Product.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// Routes with image uploads
router.post("/",auth, upload.single("image"), createProduct);
router.get("/", getAllProducts);
router.put("/:id",auth, upload.single("image"), updateProduct);
router.get("/:id", getProductById);
router.delete("/:id",auth, deleteProduct);

export default router;
