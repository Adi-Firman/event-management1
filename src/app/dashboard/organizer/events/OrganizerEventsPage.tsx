// src/app/dashboard/organizer/events/page.tsx (Server Component)
import { prisma } from "@/lib/prisma"
import OrganizerEventsClientComponent from "./OrganizerEventsClientComponent"

interface Event {
  id: number
  name: string
  description: string
  location: string
}

export default async function OrganizerEventsPage() {
  // Ambil data event dari Prisma untuk organizer yang terautentikasi
  const events = await prisma.event.findMany({
    where: {
      organizerId: 'user-id', // Ganti dengan ID organizer yang sesuai (misalnya dari session)
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Event</h1>
      {/* Pass data events ke Client Component */}
      <OrganizerEventsClientComponent events={events} />
    </div>
  )
}
