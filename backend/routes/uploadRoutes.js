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
        folder: 'blog-uploads', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        // transformation: [{ width: 500, height: 500, crop: 'limit' }] // Optional
    },
});

const upload = multer({ storage: storage });

// @route   POST /api/upload
// @desc    Upload an image
// @access  Protected
router.post('/', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        // req.file.path contains the secure_url from Cloudinary
        res.send({
            message: 'Image uploaded successfully',
            location: req.file.path,
        });
    } else {
        res.status(400).send({ message: 'No file uploaded' });
    }
});

module.exports = router;
