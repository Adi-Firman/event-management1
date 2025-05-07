import { prisma } from "@/lib/prisma"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (req.method === "DELETE") {
    try {
      await prisma.event.delete({
        where: { id: Number(id) },
      })
      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: "Gagal menghapus event" })
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" })
  }
}
