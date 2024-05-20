import express from 'express';
import { getClips, getlikeSubscribe, likeClips, newClip, playClips, playClipsNext, views } from '../controllers/clips.js';
const router = express.Router();

router.post('/upload/new/clips/:email', newClip);
router.get('/get/clips/all', getClips);
router.get('/play/clip/:id',playClips);
router.get('/play/clip/next/:id',playClipsNext);
router.get('/clips/handle/:id',getlikeSubscribe);
router.put('/views/clips/:id',views);
router.put('/like/clips/:id',likeClips);

export default router;