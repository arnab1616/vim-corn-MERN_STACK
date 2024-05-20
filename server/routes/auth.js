import express from 'express';
import { googleSignup, signupUser } from '../controllers/auth.js';
const router = express.Router();

// create new user
router.post('/login/success',signupUser)
router.post('/google/login/success', googleSignup)
export default router;