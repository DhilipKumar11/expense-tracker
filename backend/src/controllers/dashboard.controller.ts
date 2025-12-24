import { Response } from 'express'
import { Expense } from '../models/Expense'
import { AuthRequest } from '../middleware/auth'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private
export const getStats = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user._id
    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now)
    const endOfCurrentMonth = endOfMonth(now)
    const startOfLastMonth = startOfMonth(subMonths(now, 1))
    const endOfLastMonth = endOfMonth(subMonths(now, 1))

    // Get all expenses for the user
    const allExpenses = await Expense.find({ user: userId })
      .populate('category', 'name color')
      .sort({ date: -1 })
      .lean()

    // Separate expenses and income
    const expenses = allExpenses.filter((item: any) => item.type === 'expense' || !item.type)
    const income = allExpenses.filter((item: any) => item.type === 'income')

    // Calculate total expenses
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)

    // Calculate total income
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)

    const balance = totalIncome - totalExpenses

    // Get current month expenses
    const currentMonthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= startOfCurrentMonth && expenseDate <= endOfCurrentMonth
    })

    const monthlyExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate category breakdown
    const categoryMap = new Map()
    expenses.forEach(expense => {
      const categoryId = (expense.category as any)._id.toString()
      const categoryName = (expense.category as any).name
      if (categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, {
          ...categoryMap.get(categoryId),
          amount: categoryMap.get(categoryId).amount + expense.amount,
        })
      } else {
        categoryMap.set(categoryId, {
          category: categoryName,
          amount: expense.amount,
        })
      }
    })

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([id, data]) => ({
      category: data.category,
      amount: data.amount,
      percentage: totalExpenses > 0 ? Math.round((data.amount / totalExpenses) * 100) : 0,
    }))

    // Get recent expenses (last 5)
    // Filter out income from recent transactions list if desired, or keep them. 
    // Usually dashboard shows recent *expenses*. Let's show expenses only for now.
    const recentExpenses = expenses.slice(0, 5)

    res.json({
      success: true,
      data: {
        totalExpenses,
        totalIncome,
        balance,
        monthlyExpenses,
        categoryBreakdown,
        recentExpenses,
      },
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error getting dashboard stats',
    })
  }
}


