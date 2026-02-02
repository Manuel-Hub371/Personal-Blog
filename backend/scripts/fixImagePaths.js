const mongoose = require('mongoose');
const dotenv = require('dotenv');
const BlogPost = require('../models/BlogPost'); // Adjust path as needed
const Project = require('../models/Project'); // Adjust path as needed

// Load env vars
dotenv.config({ path: '../.env' }); // Adjust if run from inside scripts folder

// Hardcoded default backend URL for fallback
const BACKEND_URL = 'https://personal-blog-cqk4.onrender.com';

const fixPaths = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Fix Blog Posts
        console.log('Scanning Blog Posts...');
        const posts = await BlogPost.find();
        let postsUpdated = 0;

        for (const post of posts) {
            let modified = false;
            // Fix coverImage
            if (post.coverImage && !post.coverImage.startsWith('http')) {
                // Ensure it starts with / if not
                const path = post.coverImage.startsWith('/') ? post.coverImage : `/${post.coverImage}`;
                post.coverImage = `${BACKEND_URL}${path}`;
                modified = true;
            }
            // Add checks for content body if needed? 
            // The frontend script handles content body better dynamically, but we could do regex here.
            // For now, let's stick to the main image fields which are critical for listing pages.

            if (modified) {
                await post.save();
                postsUpdated++;
            }
        }
        console.log(`Updated ${postsUpdated} posts.`);

        // 2. Fix Projects
        console.log('Scanning Projects...');
        const projects = await Project.find();
        let projectsUpdated = 0;

        for (const project of projects) {
            let modified = false;
            if (project.image && !project.image.startsWith('http')) {
                const path = project.image.startsWith('/') ? project.image : `/${project.image}`;
                project.image = `${BACKEND_URL}${path}`;
                modified = true;
            }

            if (modified) {
                await project.save();
                projectsUpdated++;
            }
        }
        console.log(`Updated ${projectsUpdated} projects.`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

fixPaths();
