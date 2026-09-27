import express from 'express';
import { analyzeTicket, generateResponse, chatAssistant, getAiStatus } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/status', getAiStatus);
router.post('/analyze-ticket', analyzeTicket);
router.post('/generate-response', generateResponse);
router.post('/chat', chatAssistant);

export default router;

