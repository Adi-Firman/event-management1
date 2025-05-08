'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddTicketPage({ params }: { params: { id: string } }) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [quantity, setQuantity] = useState(0)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const res = await fetch("/api/tickets/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, quantity, eventId: Number(params.id) }),
    })

    if (res.ok) {
      router.push(`/dashboard/organizer/events/${params.id}`)
    } else {
      alert("Gagal menambahkan tiket")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Tambah Tiket</h1>
      <input
        type="text"
        placeholder="Nama Tiket"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <input
        type="number"
        placeholder="Harga"
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
        className="border p-2 w-full"
      />
      <input
        type="number"
        placeholder="Jumlah Tiket"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="border p-2 w-full"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Simpan
      </button>
    </form>
  )
}
