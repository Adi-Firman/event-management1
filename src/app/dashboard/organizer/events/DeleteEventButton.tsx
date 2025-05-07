"use client"

import { useRouter } from "next/navigation"

type Props = {
  eventId: number
}

export default function DeleteEventButton({ eventId }: Props) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = confirm("Yakin ingin menghapus event ini?")
    if (!confirmed) return

    const res = await fetch(`/api/events/${eventId}`, {
      method: "DELETE",
    })

    if (res.ok) {
      router.refresh()
    } else {
      alert("Gagal menghapus event.")
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline">
      Delete
    </button>
  )
}
