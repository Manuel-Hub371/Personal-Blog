const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts
// @route   GET /api/posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await BlogPost.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single post
// @route   GET /api/posts/:id
exports.getPostById = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            res.json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new post
// @route   POST /api/posts
exports.createPost = async (req, res) => {
    const post = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        coverImage: req.body.coverImage,
        tags: req.body.tags
    });

    try {
        const newPost = await post.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/posts/:id
exports.updatePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            post.title = req.body.title || post.title;
            post.content = req.body.content || post.content;
            post.coverImage = req.body.coverImage || post.coverImage;
            post.tags = req.body.tags || post.tags;
            post.updatedAt = Date.now();

            const updatedPost = await post.save();
            res.json(updatedPost);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
exports.deletePost = async (req, res) => {
    try {
        const post = await BlogPost.findById(req.params.id);
        if (post) {
            await post.deleteOne();
            res.json({ message: 'Post removed' });
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
