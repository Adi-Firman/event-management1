import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { getUserSession } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, name, description, location } = req.body
    const user = await getUserSession()

    if (!user) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    if (!id || !name || !description || !location) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const event = await prisma.event.findUnique({ where: { id: Number(id) } })

    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Validasi apakah organizer yang sedang login adalah pemilik event
    if (event.organizerId !== user.id) {
      return res.status(403).json({ error: "You can only edit your own events" })
    }

    try {
      const updatedEvent = await prisma.event.update({
        where: { id: Number(id) },
        data: { name, description, location },
      })

      return res.status(200).json({ event: updatedEvent })
    } catch (error) {
      return res.status(500).json({ error: "Failed to update event" })
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" })
}
