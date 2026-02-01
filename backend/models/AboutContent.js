const mongoose = require('mongoose');

const aboutContentSchema = new mongoose.Schema({
    bio: {
        type: String,
        required: true,
        default: 'Welcome to my personal corner of the web. I\'m a developer exploring the intersection of technology and design.'
    },
    journey: {
        type: String,
        required: true,
        default: 'I started my journey in development because I was fascinated by how simple lines of code could create interactive experiences that reach millions. Today, I focus on building high-performance web applications with clean, intuitive designs.'
    },
    skills: {
        type: [String],
        default: [
            '✨ Full-stack Web Development',
            '🎨 UI/UX Design Systems',
            '🚀 Performance Optimization',
            '🛠️ API Development'
        ]
    },
    profileImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('AboutContent', aboutContentSchema);
