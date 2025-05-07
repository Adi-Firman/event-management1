// src/pages/api/events/edit.ts
import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, name, description, location } = req.body

    if (!id || !name || !description || !location) {
      return res.status(400).json({ error: "All fields are required" })
    }

    try {
      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: {
          name,
          description,
          location,
        },
      })

      return res.status(200).json(updatedEvent)
    } catch (error) {
      return res.status(500).json({ error: "Failed to update event" })
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" })
}
