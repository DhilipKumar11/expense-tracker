import { Router, RequestHandler } from 'express'
import {
    getNotes,
    createNote,
    deleteNote,
} from '../controllers/note.controller'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate as RequestHandler)

router.get('/', getNotes as RequestHandler)
router.post('/', createNote as RequestHandler)
router.delete('/:id', deleteNote as RequestHandler)

export default router
