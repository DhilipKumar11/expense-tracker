import { Response } from 'express'
import { Expense } from '../models/Expense'
import { Category } from '../models/Category'
import { AuthRequest } from '../middleware/auth'
import { CreateExpenseInput, UpdateExpenseInput, ExpenseQueryInput } from '../validators/expense.schema'
import * as fs from 'fs'
import * as path from 'path'

// @desc    Get all expenses for logged in user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const query = req.query as unknown as ExpenseQueryInput
    const { page = 1, limit = 10, category, startDate, endDate } = query

    // Build filter
    const filter: any = { user: req.user._id }

    if (category) {
      filter.category = category
    }

    if (startDate || endDate) {
      filter.date = {}
      if (startDate) {
        filter.date.$gte = new Date(startDate)
      }
      if (endDate) {
        filter.date.$lte = new Date(endDate)
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get expenses with pagination
    const expenses = await Expense.find(filter)
      .populate('category', 'name color icon')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Get total count for pagination
    const total = await Expense.countDocuments(filter)

    res.json({
      success: true,
      data: {
        data: expenses,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    })
  } catch (error) {
    console.error('Get expenses error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error getting expenses',
    })
  }
}

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('category', 'name color icon')

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      })
      return
    }

    res.json({
      success: true,
      data: expense,
    })
  } catch (error) {
    console.error('Get expense error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error getting expense',
    })
  }
}

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, description, category, paymentMethod, date, type } = req.body as CreateExpenseInput

    // Verify category exists
    const categoryExists = await Category.findById(category)
    if (!categoryExists) {
      res.status(400).json({
        success: false,
        message: 'Invalid category',
      })
      return
    }

    const expense = await Expense.create({
      user: req.user._id,
      amount,
      description,
      category,
      paymentMethod: paymentMethod || 'cash',
      date: date ? new Date(date) : new Date(),
      type: type || 'expense',
    })

    // Populate category info
    await expense.populate('category', 'name color icon')

    res.status(201).json({
      success: true,
      data: expense,
    })
  } catch (error) {
    console.error('Create expense error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error creating expense',
    })
  }
}

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { amount, description, category, paymentMethod, date } = req.body as UpdateExpenseInput

    // Check if category exists if provided
    if (category) {
      const categoryExists = await Category.findById(category)
      if (!categoryExists) {
        res.status(400).json({
          success: false,
          message: 'Invalid category',
        })
        return
      }
    }

    const updateData: any = {}
    if (amount !== undefined) updateData.amount = amount
    if (description !== undefined) updateData.description = description
    if (category !== undefined) updateData.category = category
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod
    if (date !== undefined) updateData.date = new Date(date)

    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate('category', 'name color icon')

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      })
      return
    }

    res.json({
      success: true,
      data: expense,
    })
  } catch (error) {
    console.error('Update expense error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error updating expense',
    })
  }
}

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    })

    if (!expense) {
      res.status(404).json({
        success: false,
        message: 'Expense not found',
      })
      return
    }

    res.json({
      success: true,
      message: 'Expense deleted successfully',
    })
  } catch (error) {
    console.error('Delete expense error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error deleting expense',
    })
  }
}

// @desc    Upload and process PDF receipt
// @route   POST /api/expenses/upload-pdf
// @access  Private
export const uploadPdfReceipt = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'No PDF file uploaded',
      })
      return
    }

    const filePath = req.file.path
    const fileName = req.file.filename

    // TODO: Process PDF content and extract expense data
    // For now, return mock extracted data
    const extractedData = {
      merchant: 'Mock Merchant',
      amount: 25.50,
      date: new Date(),
      items: [
        { description: 'Coffee', amount: 15.00 },
        { description: 'Pastry', amount: 10.50 }
      ],
      category: 'Food & Dining',
      paymentMethod: 'card'
    }

    // Clean up uploaded file
    fs.unlinkSync(filePath)

    res.json({
      success: true,
      data: {
        fileName,
        extractedData,
        expenses: [
          {
            amount: extractedData.amount,
            description: `Receipt from ${extractedData.merchant}`,
            category: extractedData.category,
            paymentMethod: extractedData.paymentMethod,
            date: extractedData.date
          }
        ]
      },
    })
  } catch (error) {
    console.error('PDF upload error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error processing PDF',
    })
  }
}


