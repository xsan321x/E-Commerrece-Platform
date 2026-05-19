import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getTopRatedProducts
} from '../controllers/product.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { createProductSchema, updateProductSchema, addReviewSchema } from '../validations/product.validation.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/top-rated', getTopRatedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, validate(createProductSchema), createProduct);
router.put('/:id', protect, admin, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/reviews', protect, validate(addReviewSchema), addReview);

export default router;
