const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Configure Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blog_uploads', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
        public_id: (req, file) => `${file.fieldname}-${Date.now()}`
    },
});

const upload = multer({ storage });

// @route   POST /api/upload
// @desc    Upload an image to Cloudinary
// @access  Protected
router.post('/', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        // Cloudinary returns the full absolute URL in `path`
        const fullUrl = req.file.path;

        res.send({
            message: 'Image uploaded',
            location: fullUrl,
        });
    } else {
        res.status(400).send({ message: 'No file uploaded' });
    }
});

module.exports = router;
