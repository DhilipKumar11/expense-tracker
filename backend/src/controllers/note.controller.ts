import { Response } from 'express'
import { Note } from '../models/Note'
import { AuthRequest } from '../middleware/auth'

// @desc    Get user notes
// @route   GET /api/notes
// @access  Private
export const getNotes = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const notes = await Note.find({ user: req.user._id })
            .sort({ date: -1 })
            .lean()

        res.json({
            success: true,
            data: notes,
        })
    } catch (error) {
        console.error('Get notes error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error getting notes',
        })
    }
}

// @desc    Create a note
// @route   POST /api/notes
// @access  Private
export const createNote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const { content } = req.body

        const note = await Note.create({
            user: req.user._id,
            content,
        })

        res.status(201).json({
            success: true,
            data: note,
        })
    } catch (error) {
        console.error('Create note error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error creating note',
        })
    }
}

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
export const deleteNote = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {
    try {
        const note = await Note.findById(req.params.id)

        if (!note) {
            res.status(404).json({
                success: false,
                message: 'Note not found',
            })
            return
        }

        // Make sure user owns note
        if (note.user.toString() !== req.user._id.toString()) {
            res.status(401).json({
                success: false,
                message: 'Not authorized',
            })
            return
        }

        await note.deleteOne()

        res.json({
            success: true,
            data: {},
        })
    } catch (error) {
        console.error('Delete note error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error deleting note',
        })
    }
}
