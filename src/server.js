const express = require('express')
const prisma = require('./lib/prisma') // Pastikan path benar

const app = express()
app.use(express.json())

// Middleware untuk memastikan Prisma terhubung
app.use(async (req, res, next) => {
  try {
    await prisma.$connect()
    next()
  } catch (error) {
    console.error('Prisma connection error:', error)
    res.status(500).json({ error: 'Database connection failed' })
  }
})

// Contoh endpoint
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

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})