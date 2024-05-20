import express from 'express';
import { getUser, updateCover, updateUser } from '../controllers/user.js';

const router = express.Router();

router.get('/callback/:email', getUser);

router.post('/update/:email', updateUser);

router.post('/update/cover/:email', updateCover);

export default router;