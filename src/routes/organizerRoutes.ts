import { Router } from 'express'
import { authenticateJWT } from '../middleware/auth'
import { authorizeRole } from '../middleware/authorizeRole'

const router = Router()

router.get('/dashboard', authenticateJWT, authorizeRole(['organizer', 'admin']), (req, res) => {
  res.send(`Welcome to your dashboard, ${req.user?.role}`)
})

export default router
