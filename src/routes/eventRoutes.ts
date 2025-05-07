import { Router } from 'express'
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController'
import { authenticateJWT } from '../middleware/auth'
import { authorizeRole } from '../middleware/authorizeRole'

const router = Router()

router.use(authenticateJWT, authorizeRole(['organizer', 'admin']))

router.get('/', getAllEvents)
router.post('/', createEvent)
router.put('/:id', updateEvent)
router.delete('/:id', deleteEvent)

export default router
