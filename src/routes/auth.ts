// src/routes/auth.ts
import { Router } from 'express'
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  const existingUser = await prisma.user.findUnique({ where: { email } })

  if (existingUser) {
    return res.status(409).json({ error: 'Email already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  res.status(201).json({
    message: 'User created',
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  })
})

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })

  res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } })
})

export default router
