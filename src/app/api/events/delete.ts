// src/pages/api/events/delete.ts
import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"
import { getUserSession } from "@/lib/auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id } = req.body

    // Cek jika ID event tidak ada
    if (!id) {
      return res.status(400).json({ error: "Event ID is required" })
    }

    // Mendapatkan session pengguna
    const user = await getUserSession()

    // Cek apakah pengguna terautentikasi
    if (!user) {
      return res.status(403).json({ error: "Unauthorized" })
    }

    // Cek apakah event ada di database
    const event = await prisma.event.findUnique({
      where: { id: Number(id) },
    })

    // Cek apakah event ditemukan
    if (!event) {
      return res.status(404).json({ error: "Event not found" })
    }

    // Cek apakah event milik pengguna yang terautentikasi
    if (event.organizerId !== user.id) {
      return res.status(403).json({ error: "You can only delete your own events" })
    }

    try {
      // Menghapus event berdasarkan ID
      const deletedEvent = await prisma.event.delete({
        where: { id: Number(id) },
      })

      return res.status(200).json(deletedEvent)
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete event" })
    }
  }

  // Jika metode selain POST, kembalikan 405 (Method Not Allowed)
  return res.status(405).json({ error: "Method Not Allowed" })
}
