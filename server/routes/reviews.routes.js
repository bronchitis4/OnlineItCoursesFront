import express from 'express';
import ReviewsConroller from '../controllers/reviews.controller.js'; 
import verifyFirebaseToken from '../middleware/verifyToken.js';

const router = express.Router();
const reviewsController = new ReviewsConroller();

router.get('/', verifyFirebaseToken, reviewsController.getReviewsById);
router.post('/', verifyFirebaseToken, reviewsController.createNewReview)
export default router;