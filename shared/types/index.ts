// Shared TypeScript types for frontend and backend

export interface User {
  _id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  _id: string
  user: string // User ID
  amount: number
  description: string
  category: ExpenseCategory
  paymentMethod: 'cash' | 'card' | 'upi' | 'gpay' | 'phonepe' | 'bank_transfer' | 'other'
  type: 'expense' | 'income'
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  _id: string
  name: string
  color: string
  icon: string
  type: 'expense' | 'income'
}

export interface Note {
  _id: string
  user: string
  content: string
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface DashboardStats {
  totalExpenses: number
  totalIncome: number
  balance: number
  monthlyExpenses: number
  categoryBreakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
  recentExpenses: Expense[]
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface CreateExpenseRequest {
  amount: number
  description: string
  category: string
  paymentMethod: 'cash' | 'card' | 'upi' | 'gpay' | 'phonepe' | 'bank_transfer' | 'other'
  type: 'expense' | 'income'
  date: Date
}

export interface UpdateExpenseRequest extends Partial<CreateExpenseRequest> {
  _id: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}


