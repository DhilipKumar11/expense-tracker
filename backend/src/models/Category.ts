import { Schema, model, Document } from 'mongoose'

export interface ICategory extends Document {
  _id: string
  name: string
  color: string
  icon: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      maxlength: [30, 'Category name cannot be more than 30 characters'],
      unique: true,
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      default: '#7c6bf2',
      match: [
        /^#[0-9A-F]{6}$/i,
        'Color must be a valid hex color code',
      ],
    },
    icon: {
      type: String,
      required: [true, 'Icon is required'],
      default: 'ShoppingBag',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Index for better query performance
CategorySchema.index({ name: 1 })

export const Category = model<ICategory>('Category', CategorySchema)


