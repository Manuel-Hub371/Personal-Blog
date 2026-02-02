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

// Dynamic base URL based on request (handles localhost vs render)
const baseUrl = `${req.protocol}://${req.get('host')}`;
const fullUrl = `${baseUrl}/uploads/${req.file.filename}`;

res.send({
    message: 'Image uploaded',
    location: fullUrl,
});
    } else {
    res.status(400).send({ message: 'No file uploaded' });
}
});

module.exports = router;
