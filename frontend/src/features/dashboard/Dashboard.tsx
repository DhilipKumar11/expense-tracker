import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi, expensesApi, categoriesApi } from '@/services/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TrendingUp, DollarSign, Receipt, Calendar, Smartphone, CreditCard, Banknote, Wallet } from 'lucide-react'
import { DashboardStats } from '@/shared/types'
import { format } from 'date-fns'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toaster'

export function Dashboard() {
  const [showQuickForm, setShowQuickForm] = useState(false)
  const [showCategorySelection, setShowCategorySelection] = useState(false)
  const [showPdfUpload, setShowPdfUpload] = useState(false)
  const [quickExpense, setQuickExpense] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'cash' as const,
  })

  const queryClient = useQueryClient()

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  })

  const categories = categoriesData?.data || []

  const createExpenseMutation = useMutation({
    mutationFn: (data: any) => expensesApi.createExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      showSuccessToast('Expense added successfully!')
      setQuickExpense({ amount: '', description: '', category: '', paymentMethod: 'cash' })
      setShowQuickForm(false)
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Failed to add expense')
    },
  })

  const handleQuickExpense = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      amount: parseFloat(quickExpense.amount),
      description: quickExpense.description.trim(),
      category: quickExpense.category,
      paymentMethod: quickExpense.paymentMethod,
      date: new Date(),
    }
    createExpenseMutation.mutate(data)
  }

  const handlePdfUpload = async (file: File) => {
    try {
      const result = await expensesApi.uploadPdf(file)

      if (result.success) {
        showSuccessToast('PDF processed successfully!')
        // Refresh expenses data
        queryClient.invalidateQueries({ queryKey: ['expenses'] })
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
        console.log('Extracted expenses:', result.data.expenses)
      } else {
        showErrorToast(result.message || 'Failed to process PDF')
      }
    } catch (error) {
      console.error('PDF upload error:', error)
      showErrorToast('Failed to upload PDF')
    }

    setShowPdfUpload(false)
  }

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'gpay', label: 'GPay', icon: Wallet, color: 'bg-blue-600' },
    { id: 'phonepe', label: 'PhonePe', icon: Smartphone, color: 'bg-purple-600' },
  ]



  const dashboardData = stats?.data as DashboardStats

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome to ExpenseTracker! 💰
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Track your expenses easily and stay on top of your finances
        </p>
      </div>

      {/* Quick Add Expense */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            What did you spend on today?
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Quick expense entry - just a few taps away!
          </p>
        </div>

        {!showQuickForm ? (
          <div className="space-y-4">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Manual Entry */}
              <button
                onClick={() => setShowCategorySelection(true)}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
              >
                <div className="text-3xl mb-3">✏️</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Manual Entry
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Add expense manually
                </div>
              </button>

              {/* PDF Upload */}
              <button
                onClick={() => setShowPdfUpload(true)}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
              >
                <div className="text-3xl mb-3">📄</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Upload PDF
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Extract from receipt/bill
                </div>
              </button>

              {/* Quick Categories */}
              <button
                onClick={() => setShowCategorySelection(true)}
                className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
              >
                <div className="text-3xl mb-3">🏷️</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Quick Add
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Fast category entry
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Quick Expense Form */
          <form onSubmit={handleQuickExpense} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Amount *
                </label>
                <Input
                  type="number"
                  value={quickExpense.amount}
                  onChange={(e) => setQuickExpense(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category *
                </label>
                <select
                  value={quickExpense.category}
                  onChange={(e) => setQuickExpense(prev => ({ ...prev, category: e.target.value }))}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                What did you buy? *
              </label>
              <Input
                type="text"
                value={quickExpense.description}
                onChange={(e) => setQuickExpense(prev => ({ ...prev, description: e.target.value }))}
                placeholder="e.g., Coffee, Lunch, Transport..."
                required
                className="text-lg"
              />
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How did you pay? *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {paymentMethods.map((method) => {
                  const Icon = method.icon
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setQuickExpense(prev => ({ ...prev, paymentMethod: method.id as any }))}
                      className={`p-3 border-2 rounded-lg transition-colors ${quickExpense.paymentMethod === method.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                        }`}
                    >
                      <Icon className={`h-6 w-6 mx-auto mb-1 ${method.color} text-white rounded p-1`} />
                      <div className="text-xs font-medium text-gray-900 dark:text-white">
                        {method.label}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setShowQuickForm(false)
                  setShowCategorySelection(false)
                  setShowPdfUpload(false)
                  setQuickExpense({ amount: '', description: '', category: '', paymentMethod: 'cash' })
                }}
                disabled={createExpenseMutation.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createExpenseMutation.isLoading}
                className="px-8"
              >
                {createExpenseMutation.isLoading ? 'Adding...' : 'Add Expense'}
              </Button>
            </div>
          </form>
        )}
      </Card>

      {/* Category Selection Modal */}
      {showCategorySelection && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Select Expense Category
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Choose a category for your expense
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => {
                  setQuickExpense(prev => ({ ...prev, category: category._id }))
                  setShowCategorySelection(false)
                  setShowQuickForm(true)
                }}
                className="p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors text-center"
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowCategorySelection(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* PDF Upload Modal */}
      {showPdfUpload && (
        <Card className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Upload PDF Receipt/Bill
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We'll extract expense details automatically
            </p>
          </div>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
            <div className="text-4xl mb-4">📄</div>
            <div className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Drop PDF here or click to browse
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Supports receipts, bills, and statements
            </div>
            <input
              type="file"
              accept=".pdf"
              className="hidden"
              id="pdf-upload"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handlePdfUpload(file)
                }
              }}
            />
            <label htmlFor="pdf-upload">
              <Button className="cursor-pointer" type="button">
                Choose PDF File
              </Button>
            </label>
          </div>

          <div className="flex justify-end mt-6 space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowPdfUpload(false)}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Overview */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Expenses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${dashboardData.totalExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 dark:bg-green-900">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${dashboardData.monthlyExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900">
                <Receipt className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Transactions
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.recentExpenses.length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-50 dark:bg-orange-900">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Categories
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dashboardData.categoryBreakdown.length}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Expenses Quick View */}
      {dashboardData && dashboardData.recentExpenses.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Expenses
            </h3>
            <a href="/expenses" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {dashboardData.recentExpenses.slice(0, 3).map((expense) => (
              <div key={expense._id} className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {expense.description}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {format(new Date(expense.date), 'MMM dd, yyyy')} • {expense.category.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">
                    -${expense.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {expense.paymentMethod.replace('_', ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}


