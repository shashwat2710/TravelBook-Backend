import express from "express";
import authMiddleware from '../middleware/auth.js'
import { getPosts, getPostBySearch, createPost, updatePost, deletePost, likePost, getPostById, commentPost } from "../controllers/posts.js";

const router =  express.Router();

router.get('/search',getPostBySearch)
router.get('/',getPosts);
router.get('/:id', getPostById);
router.post('/',authMiddleware,createPost)
router.patch('/:id',authMiddleware,updatePost)
router.delete('/:id',authMiddleware,deletePost)
router.patch('/:id/likePost', authMiddleware,likePost)
router.post('/:id/commentPost',commentPost);

export default router;