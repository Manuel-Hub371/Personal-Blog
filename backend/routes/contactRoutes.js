const express = require('express');
const router = express.Router();
const { saveMessage, getMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', saveMessage);
router.get('/', protect, getMessages);
router.put('/:id/status', protect, updateMessageStatus);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
