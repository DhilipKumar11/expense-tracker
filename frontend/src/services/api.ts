import { ApiResponse, AuthResponse, LoginRequest, RegisterRequest, DashboardStats, Expense, CreateExpenseRequest, UpdateExpenseRequest, PaginatedResponse } from '@/shared/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
    ...options,
  }

  // Add auth token if available
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || 'An error occurred')
  }

  return response.json()
}

// Auth API
export const authApi = {
  login: (data: LoginRequest): Promise<ApiResponse<AuthResponse>> =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  register: (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: (): Promise<ApiResponse<void>> =>
    apiRequest('/auth/logout', { method: 'POST' }),

  getProfile: (): Promise<ApiResponse<any>> =>
    apiRequest('/auth/profile'),
}

// Dashboard API
export const dashboardApi = {
  getStats: (): Promise<ApiResponse<DashboardStats>> =>
    apiRequest('/dashboard/stats'),
}

// Expenses API
export const expensesApi = {
  getExpenses: (params?: {
    page?: number
    limit?: number
    category?: string
    startDate?: string
    endDate?: string
  }): Promise<ApiResponse<PaginatedResponse<Expense>>> => {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.set('page', params.page.toString())
    if (params?.limit) searchParams.set('limit', params.limit.toString())
    if (params?.category) searchParams.set('category', params.category)
    if (params?.startDate) searchParams.set('startDate', params.startDate)
    if (params?.endDate) searchParams.set('endDate', params.endDate)

    return apiRequest(`/expenses?${searchParams.toString()}`)
  },

  createExpense: (data: CreateExpenseRequest): Promise<ApiResponse<Expense>> =>
    apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateExpense: (id: string, data: UpdateExpenseRequest): Promise<ApiResponse<Expense>> =>
    apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteExpense: (id: string): Promise<ApiResponse<void>> =>
    apiRequest(`/expenses/${id}`, { method: 'DELETE' }),

  getExpense: (id: string): Promise<ApiResponse<Expense>> =>
    apiRequest(`/expenses/${id}`),

  uploadPdf: (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('pdf', file)

    const url = `${API_BASE_URL}/expenses/upload-pdf`
    const config: RequestInit = {
      method: 'POST',
      body: formData,
    }

    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers = {
        Authorization: `Bearer ${token}`,
      }
    }

    return fetch(url, config).then(response => {
      if (!response.ok) {
        throw new ApiError(response.status, 'Upload failed')
      }
      return response.json()
    })
  },
}

// Categories API
export const categoriesApi = {
  getCategories: (): Promise<ApiResponse<any[]>> =>
    apiRequest('/categories'),
}

export { ApiError }


