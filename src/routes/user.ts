// src/routes/user.ts
import prisma from '../lib/prisma'

export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
}
