import express from 'express';
import { getTeam, addTeamMember, updateTeamMember } from '../controllers/teamController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', authorize('agent', 'admin'), getTeam);
router.post('/', authorize('admin'), addTeamMember);
router.patch('/:id', authorize('admin'), updateTeamMember);

export default router;
