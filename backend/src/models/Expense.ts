import { Schema, model, Document } from 'mongoose'

export interface IExpense extends Document {
  _id: string
  user: Schema.Types.ObjectId
  amount: number
  description: string
  category: Schema.Types.ObjectId
  paymentMethod: 'cash' | 'card' | 'upi' | 'gpay' | 'phonepe' | 'bank_transfer' | 'other'
  type: 'expense' | 'income'
  date: Date
  createdAt: Date
  updatedAt: Date
}

const ExpenseSchema = new Schema<IExpense>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'upi', 'gpay', 'phonepe', 'bank_transfer', 'other'],
      default: 'cash',
      required: [true, 'Payment method is required'],
    },
    type: {
      type: String,
      enum: ['expense', 'income'],
      default: 'expense',
      required: [true, 'Type is required'],
    },
  },
  {
    timestamps: true,
  }
)

// Compound indexes for better query performance
ExpenseSchema.index({ user: 1, date: -1 })
ExpenseSchema.index({ user: 1, category: 1 })
ExpenseSchema.index({ user: 1, createdAt: -1 })

export const Expense = model<IExpense>('Expense', ExpenseSchema)


