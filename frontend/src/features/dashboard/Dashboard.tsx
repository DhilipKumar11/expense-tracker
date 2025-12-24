import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dashboardApi, expensesApi, categoriesApi, notesApi } from '@/services/api'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { TrendingUp, DollarSign, Calendar, Smartphone, CreditCard, Banknote, Wallet, Plus } from 'lucide-react'
import { DashboardStats, Note } from '@/shared/types'
import { format } from 'date-fns'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toaster'

export function Dashboard() {
  const [showQuickForm, setShowQuickForm] = useState(false)
  const [showIncomeForm, setShowIncomeForm] = useState(false)
  const [showCategorySelection, setShowCategorySelection] = useState(false)
  const [showNotes, setShowNotes] = useState(false)
  const [quickExpense, setQuickExpense] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'cash' as const,
  })
  const [incomeForm, setIncomeForm] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'bank_transfer' as const,
  })
  const [newNote, setNewNote] = useState('')

  const queryClient = useQueryClient()

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  })

  const { data: incomeCategoriesData } = useQuery({
    queryKey: ['categories', 'income'],
    queryFn: () => categoriesApi.getCategories('income'),
  })

  const { data: notesData } = useQuery({
    queryKey: ['notes'],
    queryFn: () => notesApi.getNotes(),
  })

  const categories = categoriesData?.data || []
  const incomeCategories = incomeCategoriesData?.data || []
  const notes = notesData?.data || []

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

  const createIncomeMutation = useMutation({
    mutationFn: (data: any) => expensesApi.createExpense({ ...data, type: 'income' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      showSuccessToast('Income added successfully!')
      setIncomeForm({ amount: '', description: '', category: '', paymentMethod: 'bank_transfer' })
      setShowIncomeForm(false)
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Failed to add income')
    },
  })

  const createNoteMutation = useMutation({
    mutationFn: (content: string) => notesApi.createNote(content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      showSuccessToast('Note added successfully!')
      setNewNote('')
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Failed to add note')
    },
  })

  const deleteNoteMutation = useMutation({
    mutationFn: (id: string) => notesApi.deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      showSuccessToast('Note deleted successfully!')
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

  const handleIncome = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      amount: parseFloat(incomeForm.amount),
      description: incomeForm.description.trim(),
      category: incomeForm.category,
      paymentMethod: incomeForm.paymentMethod,
      date: new Date(),
    }
    createIncomeMutation.mutate(data)
  }

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    createNoteMutation.mutate(newNote)
  }

  const handleDeleteNote = (id: string) => {
    deleteNoteMutation.mutate(id)
  }

  const paymentMethods = [
    { id: 'cash', label: 'Cash', icon: Banknote, color: 'bg-green-500' },
    { id: 'card', label: 'Card', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'upi', label: 'UPI', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'gpay', label: 'GPay', icon: Wallet, color: 'bg-blue-600' },
    { id: 'phonepe', label: 'PhonePe', icon: Smartphone, color: 'bg-purple-600' },
    { id: 'bank_transfer', label: 'Bank Transfer', icon: CreditCard, color: 'bg-indigo-500' },
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
                  Total Income
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${dashboardData.totalIncome.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Balance
                </p>
                <p className={`text-2xl font-bold ${dashboardData.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${dashboardData.balance.toLocaleString()}
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
                  This Month
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${dashboardData.monthlyExpenses.toLocaleString()}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
            Quick Actions
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your finances
          </p>
        </div>

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

          {/* Add Income */}
          <button
            onClick={() => setShowIncomeForm(true)}
            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-center"
          >
            <div className="text-3xl mb-3">💰</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Add Income
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Record incoming funds
            </div>
          </button>

          {/* Notes */}
          <button
            onClick={() => setShowNotes(true)}
            className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors text-center"
          >
            <div className="text-3xl mb-3">📝</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              Notes
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Write references
            </div>
          </button>
        </div>
      </Card>

      {/* Category Selection Modal */}
      {showCategorySelection && (
        <Card className="p-6 fixed inset-0 z-50 m-auto max-w-4xl h-fit max-h-[90vh] overflow-y-auto shadow-xl">
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

      {/* Expense Form Modal (Manual Entry) */}
      {showQuickForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Expense</h3>
              <button onClick={() => setShowQuickForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleQuickExpense} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                  <select
                    value={quickExpense.category}
                    onChange={(e) => setQuickExpense(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <Input
                  type="text"
                  value={quickExpense.description}
                  onChange={(e) => setQuickExpense(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Coffee, Lunch..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method *</label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {paymentMethods.filter(m => m.id !== 'bank_transfer').map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setQuickExpense(prev => ({ ...prev, paymentMethod: method.id as any }))}
                        className={`p-3 border-2 rounded-lg transition-colors ${quickExpense.paymentMethod === method.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'}`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-1 ${method.color} text-white rounded p-1`} />
                        <div className="text-xs font-medium text-gray-900 dark:text-white">{method.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowQuickForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createExpenseMutation.isLoading}>
                  {createExpenseMutation.isLoading ? 'Adding...' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Income Form Modal */}
      {showIncomeForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Income</h3>
              <button onClick={() => setShowIncomeForm(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <form onSubmit={handleIncome} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount *</label>
                  <Input
                    type="number"
                    value={incomeForm.amount}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                    className="text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source (Category) *</label>
                  <select
                    value={incomeForm.category}
                    onChange={(e) => setIncomeForm(prev => ({ ...prev, category: e.target.value }))}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white text-lg"
                  >
                    <option value="">Select source</option>
                    {incomeCategories.map(category => (
                      <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
                <Input
                  type="text"
                  value={incomeForm.description}
                  onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g., Salary, Dividend..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Deposit Method</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {paymentMethods.filter(m => ['cash', 'bank_transfer', 'upi'].includes(m.id)).map((method) => {
                    const Icon = method.icon
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setIncomeForm(prev => ({ ...prev, paymentMethod: method.id as any }))}
                        className={`p-3 border-2 rounded-lg transition-colors ${incomeForm.paymentMethod === method.id ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-green-300'}`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-1 ${method.color} text-white rounded p-1`} />
                        <div className="text-xs font-medium text-gray-900 dark:text-white">{method.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="secondary" onClick={() => setShowIncomeForm(false)}>Cancel</Button>
                <Button type="submit" disabled={createIncomeMutation.isLoading} className="bg-green-600 hover:bg-green-700 text-white">
                  {createIncomeMutation.isLoading ? 'Adding...' : 'Add Income'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Notes</h3>
              <button onClick={() => setShowNotes(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleCreateNote} className="mb-6">
              <div className="flex gap-2">
                <Input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note..."
                  className="flex-1"
                />
                <Button type="submit" disabled={createNoteMutation.isLoading || !newNote.trim()}>
                  <Plus className="h-4 w-4 mr-2" /> Add
                </Button>
              </div>
            </form>

            <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              {notes.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No notes yet.</p>
              ) : (
                notes.map((note: Note) => (
                  <div key={note._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg flex justify-between items-start group hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <div>
                      <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-2">{format(new Date(note.date), 'MMM dd, yyyy HH:mm')}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 p-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
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

