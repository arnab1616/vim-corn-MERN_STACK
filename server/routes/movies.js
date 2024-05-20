import express from 'express';
import { getMovieById, getMovies, suggestMovie } from '../controllers/movies.js';

const router = express.Router();

router.post('/suggest/movie/:userid',suggestMovie)
router.get('/fetch/movies/all',getMovies)
router.get('/get/movie/:id',getMovieById)

export default router;