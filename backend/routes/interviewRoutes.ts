import express from 'express';
import { getQuestions, submitInterview, getResults, getDemoInterview } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/questions', getQuestions);
router.get('/demo', getDemoInterview);
router.post('/interview/submit', protect, submitInterview);
router.get('/results/:userId', protect, getResults);

export default router;
