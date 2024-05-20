import express from 'express';
import { getComments, getMovieComments, postComments, postMovieComments } from '../controllers/comment.js';

const router = express.Router();

router.post('/post/comments/:videoid', postComments)
router.get('/fetch/comments/:videoid', getComments)
router.post('/post/movie/comments/:movieid', postMovieComments)
router.get('/fetch/movie/comments/:movieid', getMovieComments)

export default router;