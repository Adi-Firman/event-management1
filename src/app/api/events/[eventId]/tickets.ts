import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const eventId = Number(req.query.eventId)

  if (req.method === "GET") {
    if (!eventId) return res.status(400).json({ error: "Event ID is required" })

    try {
      const tickets = await prisma.ticket.findMany({
        where: { eventId },
      })

      return res.status(200).json(tickets)
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch tickets" })
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" })
}
