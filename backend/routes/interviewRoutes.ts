import express from 'express';
import { getQuestions, submitInterview, getResults, getDemoInterview, chat } from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/chat', chat);
router.get('/questions', getQuestions);
router.get('/demo', getDemoInterview);
router.post('/interview/submit', protect, submitInterview);
router.get('/results/:userId', protect, getResults);

export default router;
