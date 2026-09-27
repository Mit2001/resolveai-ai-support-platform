import express from 'express';
import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from '../controllers/ticketController.js';
import {
  getMessagesByTicketId,
  createMessage,
} from '../controllers/messageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createTicket)
  .get(getTickets);

router.route('/:id')
  .get(getTicketById)
  .patch(updateTicket)
  .delete(authorize('admin'), deleteTicket);

// Nested message routes under tickets
router.route('/:id/messages')
  .get(getMessagesByTicketId)
  .post(createMessage);

export default router;
