import express from 'express';
import { getIsSubscribed, getSubscriptions, subscribeChannel } from '../controllers/subscribe.js';

const router = express.Router();

router.put('/subscribe/video/:userid',subscribeChannel);
router.get('/issubscribe',getIsSubscribed);
router.get('/fetch/user/subscriptions/:userid',getSubscriptions);


export default router;