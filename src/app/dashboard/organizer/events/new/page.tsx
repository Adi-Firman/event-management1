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
    if (file) setImageFile(file)
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
    } catch (error) {
      console.error(error)
      alert('Terjadi kesalahan saat mengirim data.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow space-y-4">
      <h1 className="text-2xl font-bold text-center">Tambah Event Baru</h1>
      {[
        { label: 'Judul', name: 'title', type: 'text' },
        { label: 'Deskripsi', name: 'description', type: 'textarea' },
        { label: 'Lokasi', name: 'location', type: 'text' },
        { label: 'Kategori', name: 'category', type: 'text' },
        { label: 'Harga', name: 'price', type: 'number' },
        { label: 'Tanggal Mulai', name: 'startDate', type: 'datetime-local' },
        { label: 'Tanggal Selesai', name: 'endDate', type: 'datetime-local' },
        { label: 'Kursi Tersedia', name: 'availableSeat', type: 'number' },
      ].map(({ label, name, type }) => (
        <div key={name}>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          {type === 'textarea' ? (
            <textarea
              name={name}
              onChange={handleChange}
              value={(form as any)[name]}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
              required
            />
          ) : (
            <input
              name={name}
              type={type}
              onChange={handleChange}
              value={(form as any)[name]}
              className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
              required
            />
          )}
        </div>
      ))}

      <div>
        <label className="block text-sm font-medium text-gray-700">Gambar</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 rounded px-4 py-2 mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Mengirim...' : 'Tambah Event'}
      </button>
    </form>
  )
}
