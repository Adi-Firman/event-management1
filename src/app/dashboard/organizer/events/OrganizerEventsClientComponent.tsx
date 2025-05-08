// src/app/dashboard/organizer/events/OrganizerEventsClientComponent.tsx (Client Component)
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Event {
  id: number
  name: string
  description: string
  location: string
}

interface OrganizerEventsClientComponentProps {
  events: Event[]
}

const OrganizerEventsClientComponent: React.FC<OrganizerEventsClientComponentProps> = ({ events }) => {
  const [eventList, setEventList] = useState<Event[]>(events)
  const router = useRouter()

  const handleDelete = async (id: number) => {
    const confirmation = window.confirm("Apakah Anda yakin ingin menghapus event ini?")
    if (confirmation) {
      const response = await fetch("/api/events/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        alert("Event berhasil dihapus!")
        // Hapus event dari daftar setelah dihapus
        setEventList((prev) => prev.filter((event) => event.id !== id))
      } else {
        alert("Gagal menghapus event.")
      }
    }
  }

  return (
    <div>
      <ul className="mt-4">
        {eventList.map((event) => (
          <li key={event.id} className="mb-4 p-4 border">
            <h2 className="text-xl">{event.name}</h2>
            <p>{event.description}</p>
            <p>
              <strong>Lokasi:</strong> {event.location}
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push(`/dashboard/organizer/events/${event.id}`)}
                className="px-4 py-2 mr-2 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(event.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default OrganizerEventsClientComponent
