const express = require('express');
const router = express.Router();
const AboutContent = require('../models/AboutContent');
const { protect } = require('../middleware/authMiddleware');

// @route   GET /api/about
// @desc    Get About page content
// @access  Public
router.get('/', async (req, res) => {
    try {
        let aboutContent = await AboutContent.findOne();

        // If no content exists, create default content
        if (!aboutContent) {
            aboutContent = new AboutContent();
            await aboutContent.save();
        }

        res.json(aboutContent);
    } catch (error) {
        console.error('Error fetching about content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/about
// @desc    Update About page content
// @access  Private (Admin only)
router.put('/', protect, async (req, res) => {
    try {
        const { bio, journey, skills, profileImage } = req.body;

        // Validation
        if (!bio || !journey || !skills || !profileImage) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: 'Skills must be an array' });
        }

        let aboutContent = await AboutContent.findOne();

        if (!aboutContent) {
            // Create new content if none exists
            aboutContent = new AboutContent({
                bio,
                journey,
                skills,
                profileImage
            });
        } else {
            // Update existing content
            aboutContent.bio = bio;
            aboutContent.journey = journey;
            aboutContent.skills = skills;
            aboutContent.profileImage = profileImage;
        }

        await aboutContent.save();

        res.json({
            message: 'About content updated successfully',
            aboutContent
        });
    } catch (error) {
        console.error('Error updating about content:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
