import { Expense, ExpenseCategory } from '@/shared/types'
import { Button } from '@/components/ui/Button'
import { Edit, Trash2, Calendar, Tag } from 'lucide-react'
import { format } from 'date-fns'

interface ExpenseListProps {
  expenses: Expense[]
  categories: ExpenseCategory[]
  loading: boolean
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

export function ExpenseList({ expenses, categories, loading, onEdit, onDelete }: ExpenseListProps) {
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category?.name || 'Unknown'
  }

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat._id === categoryId)
    return category?.color || '#6b7280'
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 dark:text-gray-500 mb-4">
          <Tag className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No expenses yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start tracking your expenses by adding your first one above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div
          key={expense._id}
          className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: getCategoryColor(expense.category._id) }}
            >
              {getCategoryName(expense.category._id).charAt(0)}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                {expense.description}
              </h4>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center space-x-1">
                  <Tag className="h-4 w-4" />
                  <span>{getCategoryName(expense.category._id)}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-xl font-bold text-red-600">
                -${expense.amount.toFixed(2)}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(expense)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(expense._id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


