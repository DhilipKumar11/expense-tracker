import { Schema, model, Document } from 'mongoose'

export interface INote extends Document {
    _id: string
    user: Schema.Types.ObjectId
    content: string
    date: Date
    createdAt: Date
    updatedAt: Date
}

const NoteSchema = new Schema<INote>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User is required'],
            index: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            trim: true,
            maxlength: [500, 'Note cannot be more than 500 characters'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
)

NoteSchema.index({ user: 1, date: -1 })

export const Note = model<INote>('Note', NoteSchema)
