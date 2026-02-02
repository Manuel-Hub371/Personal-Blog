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
const uploadMiddleware = upload.single('image');

router.post('/', protect, (req, res) => {
    // 1. Check Config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
        console.error('Cloudinary config missing');
        return res.status(500).json({ message: 'Server configuration error: Cloudinary credentials missing' });
    }

    // 2. Handle Upload
    uploadMiddleware(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error('Multer error:', err);
            return res.status(400).json({ message: `Upload error: ${err.message}` });
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error('Unknown upload error:', err);
            return res.status(500).json({ message: `Cloudinary error: ${err.message}` });
        }

        // Everything went fine.
        if (req.file) {
            res.send({
                message: 'Image uploaded successfully',
                location: req.file.path,
            });
        } else {
            res.status(400).send({ message: 'No file uploaded' });
        }
    });
});


module.exports = router;
