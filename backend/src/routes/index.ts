import { Router } from 'express'
import authRoutes from './auth.routes'
import expenseRoutes from './expense.routes'
import dashboardRoutes from './dashboard.routes'
import categoryRoutes from './category.routes'

const router = Router()

// API routes
router.use('/auth', authRoutes)
router.use('/expenses', expenseRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/categories', categoryRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  })
})

export default router


