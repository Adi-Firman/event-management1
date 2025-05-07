// src/controllers/userController.ts
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma'

// ✅ Get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany()
    res.json(users)
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ✅ Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    })
    user
      ? res.json(user)
      : res.status(404).json({ error: 'User not found' })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ Create user (tanpa password / untuk admin misalnya)
export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body
  try {
    const newUser = await prisma.user.create({
      data: { name, email }
    })
    res.status(201).json(newUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

// ✅ Update user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, email } = req.body
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { name, email }
    })
    res.json(updatedUser)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

// ✅ Delete user
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.user.delete({
      where: { id: Number(id) }
    })
    res.status(204).send()
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

// ✅ Register
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) return res.status(409).json({ error: 'Email already exists' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    })

    res.status(201).json({
      message: 'User created successfully',
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ✅ Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ error: 'Invalid email or password' })

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid email or password' })

    const jwtSecret = process.env.JWT_SECRET!
    const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, { expiresIn: '1h' })

    res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

// ✅ Get user profile (authenticated)
export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user?.id } })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json({ id: user.id, name: user.name, email: user.email })
  } catch (error: any) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const token = jwt.sign(
  { id: user.id, email: user.email, role: user.role }, // ⬅️ tambahkan role
  jwtSecret,
  { expiresIn: '1h' }
)