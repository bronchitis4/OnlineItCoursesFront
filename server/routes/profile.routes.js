import express from 'express';
import ProfileController from '../controllers/profile.controller.js'; 
import verifyFirebaseToken from '../middleware/verifyToken.js';

const router = express.Router();
const profileController = new ProfileController();

router.get('/', verifyFirebaseToken, profileController.getUserProfile);
export default router;