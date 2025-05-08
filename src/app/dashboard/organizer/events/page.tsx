import { prisma } from "@/lib/prisma"
import { getUserSession } from "@/lib/auth"
import OrganizerEventsClientComponent from "./OrganizerEventsClientComponent"

export default async function OrganizerEventsPage() {
  const user = await getUserSession()

  if (!user) {
    // Redirect atau tampilkan pesan unauthorized
    return <p>Silakan login terlebih dahulu.</p>
  }

  const events = await prisma.event.findMany({
    where: {
      organizerId: user.id,
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Daftar Event</h1>
      <OrganizerEventsClientComponent events={events} />
    </div>
  )
}
