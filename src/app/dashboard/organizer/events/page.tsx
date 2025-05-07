import { prisma } from '@/lib/prisma'

export default async function OrganizerEventsPage() {
  const events = await prisma.event.findMany({
    where: {
      organizerId: 'user-id', // Ganti dengan ID organizer yang sesuai
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Event</h1>
      <ul className="mt-4">
        {events.map((event) => (
          <li key={event.id} className="mb-4 p-4 border">
            <h2 className="text-xl">{event.name}</h2>
            <p>{event.description}</p>
            <p>
              <strong>Lokasi:</strong> {event.location}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
