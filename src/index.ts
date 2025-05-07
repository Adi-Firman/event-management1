// src/index.ts
import express from 'express'
import prisma from './lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { authenticateToken } from './middleware/authMiddleware'

dotenv.config()

const app = express()
app.use(express.json())

// GET all users (protected route, requires authentication)
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// POST new user (with hashed password)
app.post('/users', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json(user)
  } catch (error: any) {
    console.error(error)
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email already exists' })
    } else {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
})

// POST login route
app.post('/login', async (req, res) => {
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

    // If login successful, create JWT
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined in .env' })
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },  // Payload
      jwtSecret,                          // Secret Key
      { expiresIn: '1h' }                // Token expires in 1 hour
    )

    res.status(200).json({
      message: 'Login successful',
      token,  // Send JWT token
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

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}`)
})
