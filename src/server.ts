import express from 'express'
import prisma from './lib/prisma'  // Pastikan path benar
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authenticateJWT } from './middleware/auth'  // Pastikan path benar
import { Request, Response } from 'express'

// Extend the Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }
    }
  }
}

dotenv.config()

const app = express()
app.use(express.json())

// Middleware untuk memastikan Prisma terhubung
app.use(async (req, res, next) => {
  try {
    await prisma.$connect()  // Cek koneksi ke database
    next()
  } catch (error) {
    console.error('Prisma connection error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
})

// Endpoint untuk registrasi pengguna baru
app.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body

  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Endpoint untuk login dan menghasilkan JWT
app.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET not set in .env' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' } // Token expires in 1 hour
    )

    res.status(200).json({
      message: 'Login successful',
      token,  // Send the JWT token
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Endpoint untuk mendapatkan data profile user
app.get('/profile', authenticateJWT, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Endpoint untuk mendapatkan semua pengguna
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Tutup koneksi saat server shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit()
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`)
})
