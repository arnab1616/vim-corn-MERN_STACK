import express from 'express';
import {getLikeSubscribe, getRecomendedVideos, getSaveVideos, getTrendingVideos, getUserLikedVideos, getUserSavedVideos, getUserVideos, getVideos, likeVideo, newVideo, playVideo, saveVideo, views} from '../controllers/video.js';

const router = express.Router();

router.post('/upload/new/video/:email', newVideo);
router.post('/save/video/:videoid', saveVideo);
router.get('/get/save/video', getSaveVideos);
router.get('/fetch/user/saved/videos/:userid', getUserSavedVideos);
router.get('/fetch/user/liked/videos/:userid', getUserLikedVideos);
router.get('/videos/all', getVideos);
router.get('/trending/videos/all', getTrendingVideos);
router.get('/fetch/recomended/:videoid',getRecomendedVideos)
router.get('/fetch/user/videos/:userid',getUserVideos);
router.get('/play/video/:id',playVideo);
router.put('/views/video/:id',views);
router.put('/like/video/:id',likeVideo);
// router.put('/subscribe/video/:userid',subscribeChannel);
router.get('/video/handle',getLikeSubscribe);

export default router;