import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders,
  updateOrderStatus,
  cancelOrder
} from '../controllers/order.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createOrderSchema } from '../validations/order.validation.js';

const router = express.Router();

router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/all', protect, admin, getAllOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.patch('/:id/cancel', protect, cancelOrder);

export default router;
