import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params

  try {
    // Menghapus event berdasarkan ID
    const deletedEvent = await prisma.event.delete({
      where: {
        id: Number(id),
      },
    })

    return NextResponse.json(deletedEvent)
  } catch (error) {
    return NextResponse.error()
  }
}
