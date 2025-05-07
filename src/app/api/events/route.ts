// src/app/api/events/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string
    const price = parseInt(formData.get('price') as string)
    const startDate = new Date(formData.get('startDate') as string)
    const endDate = new Date(formData.get('endDate') as string)
    const availableSeat = parseInt(formData.get('availableSeat') as string)

    const imageFile = formData.get('image') as File
    let imageUrl = ''

    // Upload image to Supabase
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      const filePath = `events/${randomUUID()}-${imageFile.name}`

      const { data, error } = await supabase.storage
        .from('event-images')
        .upload(filePath, buffer, {
          contentType: imageFile.type,
        })

      if (error) {
        return NextResponse.json({ message: 'Upload gambar gagal', error }, { status: 500 })
      }

      imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-images/${filePath}`
    }

    const newEvent = await prisma.event.create({
      data: {
        name: title,
        description,
        location,
        category,
        price,
        startDate,
        endDate,
        availableSeat,
        imageUrl,
      },
    })

    return NextResponse.json(newEvent, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Terjadi kesalahan saat mengirim data.' }, { status: 500 })
  }
}
