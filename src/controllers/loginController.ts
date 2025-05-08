import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'
import bcrypt from 'bcryptjs'

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(400).json({ error: 'User not found' })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }

    // ✅ Generate token dengan role
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    )

    res.json({ token }) // kirim token ke frontend
  } catch (error) {
    res.status(500).json({ error: 'Login failed' })
  }
}
