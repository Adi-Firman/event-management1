'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function EventDetailPage({ params }: { params: { eventId: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const eventRes = await fetch(`/api/events/${params.eventId}`)
      const eventData = await eventRes.json()
      setEvent(eventData)

      const ticketsRes = await fetch(`/api/events/${params.eventId}/tickets`)
      const ticketsData = await ticketsRes.json()
      setTickets(ticketsData)
    }

    fetchData()
  }, [params.eventId])

  if (!event) return <p>Loading...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{event.name}</h1>
      <p>{event.description}</p>

      <h2 className="text-xl font-semibold mt-8">Daftar Tiket</h2>
      {tickets.length === 0 ? (
        <p className="text-gray-500">Belum ada tiket</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket.id} className="border p-4 mt-4 rounded">
            <p className="font-semibold">{ticket.name}</p>
            <p>Harga: {ticket.price}</p>
            <p>Jumlah: {ticket.quantity}</p>
            <div className="mt-2">
              <button
                className="text-blue-500 mr-4"
                onClick={() =>
                  router.push(`/dashboard/organizer/events/${event.id}/tickets/edit/${ticket.id}`)
                }
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={async () => {
                  const confirmed = confirm("Yakin hapus tiket ini?")
                  if (confirmed) {
                    await fetch(`/api/tickets/${ticket.id}`, { method: 'DELETE' })
                    router.refresh()
                  }
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  )
}
