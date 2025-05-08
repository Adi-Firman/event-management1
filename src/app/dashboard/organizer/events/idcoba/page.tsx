// src/app/dashboard/organizer/events/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getUserSession } from "@/lib/auth"

interface Event {
  id: number
  name: string
  description: string
  location: string
}

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const user = await getUserSession()
  if (!user) {
    return redirect("/login")  // Jika tidak ada user, redirect ke login
  }

  // Ambil data event dari Prisma berdasarkan ID
  const event = await prisma.event.findUnique({
    where: { id: Number(params.id) },
  })

  if (!event) {
    return <p>Event tidak ditemukan</p>
  }

  // Pastikan event ini milik organizer yang sedang login
  if (event.organizerId !== user.id) {
    return <p>Unauthorized</p>
  }

  // Render form untuk mengedit event
  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <form action="/api/events/edit" method="POST">
        <input type="hidden" name="id" value={event.id} />
        <div>
          <label htmlFor="name" className="block">Nama Event</label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={event.name}
            className="border p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="description" className="block">Deskripsi Event</label>
          <textarea
            id="description"
            name="description"
            defaultValue={event.description}
            className="border p-2 w-full"
          />
        </div>
        <div className="mt-4">
          <label htmlFor="location" className="block">Lokasi Event</label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={event.location}
            className="border p-2 w-full"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Update Event
        </button>
      </form>
    </div>
  )
}
