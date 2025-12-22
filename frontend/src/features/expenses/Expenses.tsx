import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { expensesApi, categoriesApi } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ExpenseForm } from './components/ExpenseForm'
import { ExpenseList } from './components/ExpenseList'
import { Expense } from '@/shared/types'
import { Plus, Receipt } from 'lucide-react'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toaster'

export function Expenses() {
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const queryClient = useQueryClient()

  // Fetch expenses
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => expensesApi.getExpenses(),
  })

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesApi.getCategories(),
  })

  const categories = categoriesData?.data || []
  const expenses = expensesData?.data?.data || []

  // Delete expense mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => expensesApi.deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      showSuccessToast('Expense deleted successfully')
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Failed to delete expense')
    },
  })

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    handleFormClose()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track and manage your expenses
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Expense</span>
        </Button>
      </div>

      {/* Expense Form Modal */}
      {showForm && (
        <Card className="p-6">
          <ExpenseForm
            expense={editingExpense}
            categories={categories}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </Card>
      )}

      {/* Expenses List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>All Expenses</span>
          </h2>
        </div>

        <ExpenseList
          expenses={expenses}
          categories={categories}
          loading={expensesLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>
    </div>
  )
}


