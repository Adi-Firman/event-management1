import { Request, Response } from 'express'
import prisma from '../lib/prisma'

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany({ where: { organizerId: req.user?.id } })
    res.json(events)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch events' })
  }
}

export const createEvent = async (req: Request, res: Response) => {
  const { name, description, location, category, price, startDate, endDate, availableSeat } = req.body
  try {
    const event = await prisma.event.create({
      data: {
        name, description, location, category,
        price: Number(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        availableSeat: Number(availableSeat),
        organizerId: req.user?.id
      }
    })
    res.status(201).json(event)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create event' })
  }
}

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, location, category, price, startDate, endDate, availableSeat } = req.body
  try {
    const event = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        name, description, location, category,
        price: Number(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        availableSeat: Number(availableSeat)
      }
    })
    res.json(event)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update event' })
  }
}

export const deleteEvent = async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await prisma.event.delete({ where: { id: Number(id) } })
    res.status(204).send()
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete event' })
  }
}
