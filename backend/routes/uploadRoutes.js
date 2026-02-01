const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configure storage
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

// @route   POST /api/upload
// @desc    Upload an image
// @access  Public (protected by auth middleware in server.js usually, but here we'll rely on route protection if needed, 
//          though often upload endpoints are left open or protected via token. 
//          Since TinyMCE will call this with the token header, we should protect it in server.js mount or here.)
//          For simplicity in this step, we'll keep it simple, but in prod we'd add `protect`.
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, upload.single('image'), (req, res) => {
    if (req.file) {
        res.send({
            message: 'Image uploaded',
            location: `/uploads/${req.file.filename}`, // URL for the frontend
        });
    } else {
        res.status(400).send({ message: 'No file uploaded' });
    }
});

module.exports = router;
