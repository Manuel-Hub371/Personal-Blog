const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' }); // Load .env from backend root
const BlogPost = require('../models/BlogPost');
const Project = require('../models/Project');

// Configuration
const OLD_BASE = 'http://localhost:5000';
const NEW_BASE = 'https://personal-blog-cqk4.onrender.com';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Connection Error:', error);
        process.exit(1);
    }
};

const fixPaths = async () => {
    await connectDB();

    console.log(`Replacing "${OLD_BASE}" with "${NEW_BASE}"...`);

    // 1. Fix Blog Posts
    const posts = await BlogPost.find({});
    let postCount = 0;
    for (const post of posts) {
        if (post.coverImage && post.coverImage.includes(OLD_BASE)) {
            post.coverImage = post.coverImage.replace(OLD_BASE, NEW_BASE);
            await post.save();
            postCount++;
        }
    }
    console.log(`Updated ${postCount} blog posts.`);

    // 2. Fix Projects
    const projects = await Project.find({});
    let projectCount = 0;
    for (const project of projects) {
        if (project.image && project.image.includes(OLD_BASE)) {
            project.image = project.image.replace(OLD_BASE, NEW_BASE);
            await project.save();
            projectCount++;
        }
    }
    console.log(`Updated ${projectCount} projects.`);

    process.exit();
};

fixPaths();
