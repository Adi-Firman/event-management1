import { Router } from 'express'
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  register,
  login,
  getProfile
} from '../controllers/userController'
import { authenticateJWT } from '../middleware/auth'

const router = Router()

// Auth
router.post('/register', register)
router.post('/login', login)
router.get('/profile', authenticateJWT, getProfile)

// CRUD User (admin only sebaiknya)
router.get('/users', getAllUsers)
router.get('/users/:id', getUserById)
router.post('/users', createUser)
router.put('/users/:id', updateUser)
router.delete('/users/:id', deleteUser)

export default router
