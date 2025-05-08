import { Router } from 'express'
import multer from 'multer'
import { authenticateJWT } from '../middleware/auth'
import { authorizeRole } from '../middleware/authorize'
import { createEvent } from '../controllers/eventController'
import { updateEvent } from '../controllers/eventController'

const router = Router()
const upload = multer() // in-memory storage

router.post(
  '/events',
  authenticateJWT,
  authorizeRole(['organizer']),
  upload.single('image'), // ⬅️ ini wajib untuk handle upload
  createEvent
)

router.put(
  '/events/:id',
  authenticateJWT,
  authorizeRole(['organizer']),
  upload.single('image'), // ⬅️ untuk handle upload saat update
  updateEvent
)

export default router
