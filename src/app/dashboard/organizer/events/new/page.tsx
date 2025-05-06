'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    price: '',
    startDate: '',
    endDate: '',
    availableSeat: '',
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const res = await fetch('/api/events', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Gagal menambahkan event')
      } else {
        alert('Event berhasil ditambahkan!')
        router.push('/dashboard/organizer/events')
      }
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Tambah Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
        {[
          { label: 'Judul Event', name: 'title', type: 'text' },
          { label: 'Lokasi', name: 'location', type: 'text' },
          { label: 'Kategori', name: 'category', type: 'text' },
          { label: 'Harga', name: 'price', type: 'number' },
          { label: 'Tanggal Mulai', name: 'startDate', type: 'datetime-local' },
          { label: 'Tanggal Selesai', name: 'endDate', type: 'datetime-local' },
          { label: 'Kursi Tersedia', name: 'availableSeat', type: 'number' },
        ].map(({ label, name, type }) => (
          <div key={name}>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg focus:ring focus:outline-none"
              required
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-semibold mb-1">Deskripsi</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg focus:ring focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Gambar Event</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border px-4 py-2 rounded-lg"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Mengirim...' : 'Tambah Event'}
        </button>
      </form>
    </div>
  )
}
