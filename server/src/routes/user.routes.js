import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getUserDetails,
  updateUserDetails
} from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/', protect, admin, getAllUsers);
router.get('/:id', protect, admin, getUserDetails);
router.put('/:id', protect, admin, updateUserDetails);
router.delete('/:id', protect, admin, deleteUser);
router.patch('/:id/role', protect, admin, updateUserRole);

export default router;
