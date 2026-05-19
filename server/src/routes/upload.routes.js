import express from 'express';
import {
  uploadImage,
  uploadMultipleImages,
  deleteImage,
} from '../controllers/upload.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

// Upload single image (available to all authenticated users for profile pictures)
router.post('/image', protect, upload.single('image'), uploadImage);

// Upload multiple images (admin only for product management)
router.post('/images', protect, admin, upload.array('images', 5), uploadMultipleImages);

// Delete image (admin only)
router.delete('/image', protect, admin, deleteImage);

export default router;
