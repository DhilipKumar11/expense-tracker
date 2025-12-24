import { Response } from 'express'
import { Category } from '../models/Category'
import { AuthRequest } from '../middleware/auth'

// Default categories to seed the database
const defaultCategories = [
  { name: 'Food & Dining', color: '#FF6B6B', icon: 'UtensilsCrossed' },
  { name: 'Transportation', color: '#4ECDC4', icon: 'Car' },
  { name: 'Shopping', color: '#45B7D1', icon: 'ShoppingBag' },
  { name: 'Entertainment', color: '#FFA07A', icon: 'Film' },
  { name: 'Bills & Utilities', color: '#98D8C8', icon: 'Receipt' },
  { name: 'Healthcare', color: '#F7DC6F', icon: 'Heart' },
  { name: 'Education', color: '#BB8FCE', icon: 'GraduationCap' },
  { name: 'Travel', color: '#85C1E9', icon: 'Plane' },
  { name: 'Personal Care', color: '#F8C471', icon: 'Sparkles' },
  { name: 'Other', color: '#D5DBDB', icon: 'MoreHorizontal' },
]

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public (for now, could be private)
export const getCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    let categories = await Category.find({}).sort({ name: 1 }).lean()

    // Auto-seed if empty
    if (categories.length === 0) {
      console.log('No categories found. Seeding default categories...')
      await Category.insertMany(
        defaultCategories.map(cat => ({ ...cat, isDefault: true }))
      )
      categories = await Category.find({}).sort({ name: 1 }).lean()
    }

    res.json({
      success: true,
      data: categories,
    })
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error getting categories',
    })
  }
}

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
export const getCategory = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id)

    if (!category) {
      res.status(404).json({
        success: false,
        message: 'Category not found',
      })
      return
    }

    res.json({
      success: true,
      data: category,
    })
  } catch (error) {
    console.error('Get category error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error getting category',
    })
  }
}



// @desc    Seed default categories
// @route   POST /api/categories/seed
// @access  Private (Admin only)
export const seedCategories = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    // Check if categories already exist
    const existingCategories = await Category.find({})
    if (existingCategories.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Categories already seeded',
      })
      return
    }

    const categories = await Category.insertMany(
      defaultCategories.map(cat => ({ ...cat, isDefault: true }))
    )

    res.status(201).json({
      success: true,
      data: categories,
      message: 'Default categories seeded successfully',
    })
  } catch (error) {
    console.error('Seed categories error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error seeding categories',
    })
  }
}


