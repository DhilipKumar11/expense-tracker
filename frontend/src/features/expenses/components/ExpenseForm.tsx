import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { expensesApi } from '@/services/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Expense, ExpenseCategory } from '@/shared/types'
import { showSuccessToast, showErrorToast } from '@/components/ui/Toaster'
import { format } from 'date-fns'

interface ExpenseFormProps {
  expense?: Expense | null
  categories: ExpenseCategory[]
  onSuccess: () => void
  onCancel: () => void
}

export function ExpenseForm({ expense, categories, onSuccess, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    category: '',
    paymentMethod: 'cash' as Expense['paymentMethod'],
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  const isEditing = !!expense

  useEffect(() => {
    if (expense) {
      setFormData({
        amount: expense.amount.toString(),
        description: expense.description,
        category: expense.category._id,
        paymentMethod: expense.paymentMethod || 'cash',
        date: format(new Date(expense.date), 'yyyy-MM-dd'),
      })
    }
  }, [expense])

  const mutation = useMutation({
    mutationFn: (data: any) =>
      isEditing
        ? expensesApi.updateExpense(expense._id, data)
        : expensesApi.createExpense(data),
    onSuccess: () => {
      showSuccessToast(
        isEditing ? 'Expense updated successfully' : 'Expense created successfully'
      )
      onSuccess()
    },
    onError: (error: any) => {
      showErrorToast(error.message || 'Failed to save expense')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      category: formData.category,
      paymentMethod: formData.paymentMethod,
      date: new Date(formData.date),
    }

    mutation.mutate(data)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {isEditing ? 'Edit Expense' : 'Add New Expense'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <Input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <Input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="What did you spend on?"
            required
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date *
          </label>
          <Input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="cash">Cash</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="gpay">Google Pay (GPay)</option>
            <option value="phonepe">PhonePe</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={mutation.isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add')} Expense
          </Button>
        </div>
      </form>
    </div>
  )
}


