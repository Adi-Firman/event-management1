import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { getUserSession } from "@/lib/auth"
import { useState, useEffect } from "react"

interface Event {
  id: number
  name: string
  description: string
  location: string
}

export default function EditEventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Ambil data event saat halaman dimuat
  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/events/${params.id}`)
      const data = await res.json()

      if (data.event) {
        setEvent(data.event)
      }
      setLoading(false)
    }

    fetchEvent()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!event) return

    const response = await fetch(`/api/events/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })

    const data = await response.json()

    if (data.error) {
      alert("Gagal mengupdate event")
    } else {
      alert("Event berhasil diupdate!")
      redirect(`/dashboard/organizer/events/${event.id}`)
    }
  }

  if (loading) return <div>Loading...</div>

  if (!event) return <div>Event tidak ditemukan</div>

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Event</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm">Nama Event</label>
          <input
            type="text"
            id="name"
            value={event.name}
            onChange={(e) => setEvent({ ...event, name: e.target.value })}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm">Deskripsi</label>
          <textarea
            id="description"
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm">Lokasi</label>
          <input
            type="text"
            id="location"
            value={event.location}
            onChange={(e) => setEvent({ ...event, location: e.target.value })}
            className="mt-1 p-2 w-full border rounded"
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
            Update Event
          </button>
        </div>
      </form>
    </div>
  )
}
