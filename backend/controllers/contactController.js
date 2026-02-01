const ContactMessage = require('../models/ContactMessage');

// @desc    Get all contact messages (with optional status filter)
// @route   GET /api/contact
exports.getMessages = async (req, res) => {
    try {
        const { status } = req.query;
        // If status is provided, filter by it. Otherwise return all except deleted (unless specified)
        const filter = status ? { status } : { status: { $ne: 'deleted' } };

        // If status is 'deleted', specifically fetch from bin
        if (status === 'deleted') {
            const messages = await ContactMessage.find({ status: 'deleted' }).sort({ deletedAt: -1 });
            return res.json(messages);
        }

        const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update message status
// @route   PUT /api/contact/:id/status
exports.updateMessageStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const message = await ContactMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        message.status = status;

        // Handle binning logic dates
        if (status === 'deleted') {
            message.deletedAt = Date.now();
        } else {
            message.deletedAt = undefined; // Restore
        }

        await message.save();
        res.json(message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Permanently delete message
// @route   DELETE /api/contact/:id
exports.deleteMessage = async (req, res) => {
    try {
        const message = await ContactMessage.findById(req.params.id);

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        await message.deleteOne();
        res.json({ message: 'Message permanently deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clean up old messages from bin
// @internal Cron Job
exports.cleanupOldMessages = async () => {
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await ContactMessage.deleteMany({
            status: 'deleted',
            deletedAt: { $lt: thirtyDaysAgo }
        });
        if (result.deletedCount > 0) {
            console.log(`[Cron] Auto-deleted ${result.deletedCount} old messages.`);
        }
    } catch (error) {
        console.error('[Cron] Cleanup failed:', error);
    }
};

exports.saveMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const newMessage = new ContactMessage({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
