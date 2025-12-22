import { z } from 'zod'

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters'),
  }),
})

export const registerSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot be more than 50 characters')
      .trim(),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Invalid email format'),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot be more than 100 characters'),
  }),
})

export const updateProfileSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name cannot be more than 50 characters')
      .trim()
      .optional(),
    email: z
      .string()
      .email('Invalid email format')
      .optional(),
  }),
})

export type LoginInput = z.infer<typeof loginSchema>['body']
export type RegisterInput = z.infer<typeof registerSchema>['body']
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body']


