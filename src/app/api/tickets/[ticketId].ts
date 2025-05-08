import prisma from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ticketId = Number(req.query.ticketId)

  if (!ticketId) return res.status(400).json({ error: "Ticket ID is required" })

  try {
    if (req.method === "GET") {
      const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })
      if (!ticket) return res.status(404).json({ error: "Ticket not found" })
      return res.status(200).json(ticket)
    }

    if (req.method === "PUT") {
      const { name, price, quantity } = req.body
      const updatedTicket = await prisma.ticket.update({
        where: { id: ticketId },
        data: { name, price, quantity },
      })
      return res.status(200).json(updatedTicket)
    }

    if (req.method === "DELETE") {
      await prisma.ticket.delete({ where: { id: ticketId } })
      return res.status(200).json({ message: "Ticket deleted" })
    }

    return res.status(405).json({ error: "Method Not Allowed" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Server Error" })
  }
}
