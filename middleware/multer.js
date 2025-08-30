import multer from "multer";

// Use memory storage so file goes to buffer (not saved in local disk)
const storage = multer.memoryStorage();

// File filter (only images allowed)
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/webp"
    ) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"), false);
    }
};

// Multer upload middleware
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

export default upload;
