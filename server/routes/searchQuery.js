import express from 'express';
import { searchMovies, searchVideos } from '../controllers/searchQuery.js';

const router = express.Router();

router.get('/search/videos', searchVideos);
router.get('/search/movies', searchMovies);

export default router;