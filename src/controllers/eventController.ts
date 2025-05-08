import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import { supabase } from '../lib/supabase'

export const updateEvent = async (req: Request, res: Response) => {
  const { id } = req.params
  const { name, description, location, category, price, startDate, endDate, availableSeat } = req.body
  const file = req.file

  try {
    let imageUrl: string | undefined

    // Kalau ada file baru dikirim, upload ke Supabase
    if (file) {
      const fileName = `event-${Date.now()}-${file.originalname}`
      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        })

      if (uploadError) {
        return res.status(500).json({ error: 'Image upload failed' })
      }

      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/event-images/${fileName}`
    }

    const updatedEvent = await prisma.event.update({
      where: { id: Number(id) },
      data: {
        name,
        description,
        location,
        category,
        price: Number(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        availableSeat: Number(availableSeat),
        ...(imageUrl && { imageUrl }) // hanya update image kalau ada file baru
      }
    })

    res.json(updatedEvent)
  } catch (error) {
    console.error(error)
    res.status(400).json({ error: 'Failed to update event' })
  }
}
