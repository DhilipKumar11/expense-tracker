import { Router, RequestHandler } from 'express'
import {
  getCategories,
  getCategory,
  seedCategories,
} from '../controllers/category.controller'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public routes (categories are generally public)
router.get('/', getCategories as RequestHandler)
router.get('/:id', getCategory as RequestHandler)

// Admin only routes
router.post('/seed', authenticate, authorize('admin'), seedCategories as RequestHandler)

export default router


