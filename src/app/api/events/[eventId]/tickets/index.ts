import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.eventId)

  if (req.method === "POST") {
    const { name, price, quantity } = req.body

    if (!eventId || !name || price == null || quantity == null) {
      return res.status(400).json({ error: "Semua field diperlukan" })
    }

    try {
      const ticket = await prisma.ticket.create({
        data: {
          name,
          price: Number(price),
          quantity: Number(quantity),
          eventId,
        },
      })

      return res.status(201).json(ticket)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Gagal menambahkan tiket" })
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" })
}
