import { Router, RequestHandler } from 'express'
import { getStats } from '../controllers/dashboard.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

// All routes require authentication
router.use(authenticate)

router.get('/stats', getStats as RequestHandler)

export default router


