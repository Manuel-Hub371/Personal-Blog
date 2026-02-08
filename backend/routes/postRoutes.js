const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, updatePost, deletePost, getRelatedPosts } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(getPosts)
    .post(protect, createPost);

router.route('/:id')
    .get(getPostById)
    .put(protect, updatePost)
    .delete(protect, deletePost);

router.get('/:id/related', getRelatedPosts);

module.exports = router;
