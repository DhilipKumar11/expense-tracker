import { Router, RequestHandler } from 'express'
import {
  register,
  login,
  getProfile,
  updateProfile,
  logout,
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { loginSchema, registerSchema, updateProfileSchema } from '../validators/auth.schema'

const router = Router()

// Public routes
router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)

// Protected routes
router.get('/profile', authenticate, getProfile as RequestHandler)
router.put('/profile', authenticate, validate(updateProfileSchema), updateProfile as RequestHandler)
router.post('/logout', authenticate, logout)

export default router


