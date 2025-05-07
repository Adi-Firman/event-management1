'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateEventPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    price: '',
    availableSeat: '',
  })
  const [image, setImage] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setImage(e.target.files[0])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData()
    // Menambahkan data dari form ke FormData
    Object.entries(form).forEach(([key, value]) => formData.append(key, value))
    // Menambahkan gambar jika ada
    if (image) formData.append('image', image)

    // Log data sebelum mengirim untuk debug
    console.log('Data yang dikirim:', formData)

    try {
      const res = await fetch('/api/organizer/events', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        alert('Event berhasil ditambahkan!')
        router.push('/dashboard/organizer/events')
      } else {
        const data = await res.json()
        alert(data.error || 'Gagal menambahkan event')
      }
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat mengirim data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Buat Event</h1>
      <input
        name="name"
        placeholder="Nama event"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <textarea
        name="description"
        placeholder="Deskripsi"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        name="location"
        placeholder="Lokasi"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        type="datetime-local"
        name="startDate"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        type="datetime-local"
        name="endDate"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        name="price"
        placeholder="Harga"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        name="availableSeat"
        placeholder="Jumlah Kursi"
        onChange={handleChange}
        required
        className="w-full border p-2"
      />
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="w-full border p-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Submit'}
      </button>
    </form>
  )
}
