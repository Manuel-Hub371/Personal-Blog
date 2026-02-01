const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/user
exports.getUserProfile = async (req, res) => {
    try {
        // For a personal blog, there's usually just one user.
        // We can fetch the first user or a specific one by email.
        const user = await User.findOne();
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/user
exports.updateUserProfile = async (req, res) => {
    try {
        let user = await User.findOne();
        if (!user) {
            user = new User(req.body);
        } else {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.bio = req.body.bio || user.bio;
            user.profileImage = req.body.profileImage || user.profileImage;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
