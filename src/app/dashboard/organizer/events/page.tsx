// src/app/dashboard/organizer/events/page.tsx

interface Event {
  id: string
  name: string
  description: string
  // Add other fields as per your Prisma schema
}

export default async function OrganizerEventsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/organizer/events`, {
    cache: 'no-store',
  })

  const events: Event[] = await res.json()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Saya</h1>
      {events.length === 0 ? (
        <p>Belum ada event.</p>
      ) : (
        <ul className="space-y-2">
          {events.map((event) => (
            <li key={event.id} className="p-4 border rounded shadow">
              <h2 className="text-lg font-semibold">{event.name}</h2>
              <p>{event.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

