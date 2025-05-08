import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { eventId, name, price, quantity } = req.body

    if (!eventId || !name || price == null || quantity == null) {
      return res.status(400).json({ error: "Semua field wajib diisi" })
    }

    try {
      const ticket = await prisma.ticket.create({
        data: {
          eventId,
          name,
          price,
          quantity,
        },
      })

      return res.status(200).json(ticket)
    } catch (err) {
      return res.status(500).json({ error: "Gagal membuat tiket" })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}
