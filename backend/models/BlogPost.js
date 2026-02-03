const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    coverImage: { type: String },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);
