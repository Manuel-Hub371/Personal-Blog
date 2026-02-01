const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String }, // Full project content
    link: { type: String }, // Live Demo Link
    githubLink: { type: String }, // GitHub Repo Link
    image: { type: String },
    technologies: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
