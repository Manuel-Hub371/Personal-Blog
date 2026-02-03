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
        const post = await BlogPost.findById(req.params.id).populate('relatedPosts', 'title coverImage tags createdAt');

        if (post) {
            let related = post.relatedPosts || [];

            // Dynamic suggestions if we don't have enough manual ones
            if (related.length < 3 && post.tags && post.tags.length > 0) {
                const excludeIds = [post._id, ...related.map(p => p._id)];

                const limit = 3 - related.length;
                const dynamic = await BlogPost.find({
                    _id: { $nin: excludeIds },
                    tags: { $in: post.tags }
                })
                    .select('title coverImage tags createdAt')
                    .limit(limit);

                related = [...related, ...dynamic];
            }

            // If still less than 3, just fill with recent posts
            if (related.length < 3) {
                const excludeIds = [post._id, ...related.map(p => p._id)];
                const limit = 3 - related.length;
                const recent = await BlogPost.find({
                    _id: { $nin: excludeIds }
                })
                    .select('title coverImage tags createdAt')
                    .sort({ createdAt: -1 })
                    .limit(limit);

                related = [...related, ...recent];
            }

            // Convert to object to attach extra property without Mongoose restrictions
            const postObj = post.toObject();
            postObj.related = related;

            res.json(postObj);
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
    const { title, content, coverImage, tags, relatedPosts, seoTitle, seoDescription, seoKeywords } = req.body;

    // Auto-generate SEO metadata if not provided
    const generatedSeoTitle = seoTitle || title;

    let generatedSeoDescription = seoDescription;
    if (!generatedSeoDescription && content) {
        // Strip HTML/Markdown - simple heuristic: remove special chars or just take substring
        // For simplicity, just taking raw substring and cleaning up a bit
        generatedSeoDescription = content.substring(0, 150).replace(/[#*`]/g, '').trim() + '...';
    }

    let generatedSeoKeywords = seoKeywords;
    if (!generatedSeoKeywords && tags && Array.isArray(tags)) {
        generatedSeoKeywords = tags.join(', ');
    }

    const post = new BlogPost({
        title,
        content,
        coverImage,
        tags,
        relatedPosts: relatedPosts || [],
        seoTitle: generatedSeoTitle,
        seoDescription: generatedSeoDescription,
        seoKeywords: generatedSeoKeywords
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

            if (req.body.relatedPosts) {
                post.relatedPosts = req.body.relatedPosts;
            }

            // SEO Fields
            post.seoTitle = req.body.seoTitle || post.seoTitle;
            post.seoDescription = req.body.seoDescription || post.seoDescription;
            post.seoKeywords = req.body.seoKeywords || post.seoKeywords;

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
