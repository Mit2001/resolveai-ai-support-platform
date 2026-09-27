import express from 'express';
import { getCustomers, getCustomerById } from '../controllers/customerController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('agent', 'admin'));

router.get('/', getCustomers);
router.get('/:id', getCustomerById);

export default router;
