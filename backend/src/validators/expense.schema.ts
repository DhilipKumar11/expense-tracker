import { z } from 'zod'

export const createExpenseSchema = z.object({
  body: z.object({
    amount: z
      .number({
        required_error: 'Amount is required',
      })
      .positive('Amount must be greater than 0')
      .max(999999.99, 'Amount cannot be more than 999,999.99'),
    description: z
      .string({
        required_error: 'Description is required',
      })
      .min(1, 'Description cannot be empty')
      .max(200, 'Description cannot be more than 200 characters')
      .trim(),
    category: z
      .string({
        required_error: 'Category is required',
      })
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID'),
    paymentMethod: z
      .enum(['cash', 'card', 'upi', 'gpay', 'phonepe', 'bank_transfer', 'other'], {
        required_error: 'Payment method is required',
      })
      .default('cash'),
    date: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        'Invalid date format'
      ),
  }),
})

export const updateExpenseSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .positive('Amount must be greater than 0')
      .max(999999.99, 'Amount cannot be more than 999,999.99')
      .optional(),
    description: z
      .string()
      .min(1, 'Description cannot be empty')
      .max(200, 'Description cannot be more than 200 characters')
      .trim()
      .optional(),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
      .optional(),
    paymentMethod: z
      .enum(['cash', 'card', 'upi', 'gpay', 'phonepe', 'bank_transfer', 'other'])
      .optional(),
    date: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        'Invalid date format'
      ),
  }),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid expense ID'),
  }),
})

export const expenseQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 1))
      .refine((val) => val > 0, 'Page must be greater than 0'),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val) : 10))
      .refine((val) => val > 0 && val <= 100, 'Limit must be between 1 and 100'),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, 'Invalid category ID')
      .optional(),
    startDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        'Invalid start date format'
      ),
    endDate: z
      .string()
      .optional()
      .refine(
        (date) => !date || !isNaN(Date.parse(date)),
        'Invalid end date format'
      ),
  }),
})

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>['body']
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>['body']
export type ExpenseQueryInput = z.infer<typeof expenseQuerySchema>['query']


