import { Router } from 'express'
import prisma from '../prisma'

const router = Router()

router.post('/events', async (req, res) => {
  try {
    const {
      name,
      description,
      location,
      startDate,
      endDate,
      price,
      availableSeat
    } = req.body

    const event = await prisma.event.create({
      data: {
        name,
        description,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        price: parseFloat(price),
        availableSeat: parseInt(availableSeat),
      }
    })

    res.json(event)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Terjadi kesalahan server' })
  }
})

export default router
