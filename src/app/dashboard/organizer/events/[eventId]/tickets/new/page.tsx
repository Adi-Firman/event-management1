'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddTicketPage({ params }: { params: { eventId: string } }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !price || !quantity) {
      setError('Semua field wajib diisi')
      return
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      setError('Harga dan jumlah harus lebih dari atau sama dengan 0')
      return
    }

    setLoading(true)
    setError('')

    const res = await fetch(`/api/events/${params.eventId}/tickets`, {
      method: 'POST',
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
      setError(data.error || 'Gagal menambahkan tiket')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 space-y-6">
      <h1 className="text-2xl font-bold">Tambah Tiket</h1>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Gagal</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Tiket</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Tiket Reguler"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Harga</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Contoh: 50000"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Jumlah</Label>
          <Input
            id="quantity"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Contoh: 100"
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Menyimpan..." : "Tambah Tiket"}
        </Button>
      </form>
    </div>
  )
}
