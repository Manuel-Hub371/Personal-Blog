const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Configure Local Storage
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    },
});

// Check file type
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

// Hardcoded base URL for Render Backend
const BASE_URL = 'https://personal-blog-cqk4.onrender.com';

// @route   POST /api/upload
// @desc    Upload an image
// @access  Protected
router.post('/', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        // Return FULL absolute URL
        const fullUrl = `${BASE_URL}/uploads/${req.file.filename}`;

        res.send({
            message: 'Image uploaded',
            location: fullUrl,
        });
    } else {
        res.status(400).send({ message: 'No file uploaded' });
    }
});

module.exports = router;
