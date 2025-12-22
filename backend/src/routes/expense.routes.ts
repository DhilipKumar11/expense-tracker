import { Router, RequestHandler } from 'express'
import multer from 'multer'
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  uploadPdfReceipt,
} from '../controllers/expense.controller'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validation'
import {
  createExpenseSchema,
  updateExpenseSchema,
  expenseQuerySchema,
} from '../validators/expense.schema'

const router = Router()

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true)
    } else {
      cb(new Error('Only PDF files are allowed'))
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

// All routes require authentication
router.use(authenticate)

router
  .route('/')
  .get(validate(expenseQuerySchema), getExpenses as RequestHandler)
  .post(validate(createExpenseSchema), createExpense as RequestHandler)

router
  .route('/:id')
  .get(getExpense as RequestHandler)
  .put(validate(updateExpenseSchema), updateExpense as RequestHandler)
  .delete(deleteExpense as RequestHandler)

router.post('/upload-pdf', upload.single('pdf'), uploadPdfReceipt as RequestHandler)

export default router


