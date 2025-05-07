// src/index.ts
import express from 'express'
import prisma from './lib/prisma'

const app = express()

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

app.listen(3000, () => {
  console.log('Server ready on http://localhost:3000')
})
