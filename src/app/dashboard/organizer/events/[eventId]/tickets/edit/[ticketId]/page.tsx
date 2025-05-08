'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"

export default function EditTicketPage({ params }: { params: { eventId: string; ticketId: string } }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await fetch(`/api/tickets/${params.ticketId}`)
        if (!res.ok) throw new Error('Gagal mengambil data tiket')

        const data = await res.json()
        setName(data.name)
        setPrice(String(data.price))
        setQuantity(String(data.quantity))
      } catch (err) {
        setError('Gagal mengambil data tiket')
      }
    }

    fetchTicket()
  }, [params.ticketId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !quantity) {
      setError("Semua field wajib diisi")
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch(`/api/tickets/${params.ticketId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        price: Number(price),
        quantity: Number(quantity),
      }),
    })

    setLoading(false)

    if (res.ok) {
      router.push(`/dashboard/organizer/events/${params.eventId}`)
    } else {
      const data = await res.json()
      setError(data.error || 'Gagal mengedit tiket')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Tiket</h1>

      {error && (
        <Alert variant="destructive" title="Error">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Tiket</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Harga</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Jumlah</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  )
}
