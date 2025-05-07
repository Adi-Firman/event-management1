// src/app/api/organizer/events/route.ts

import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ⚠️ Pakai Service Role Key hanya di server
)

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('image') as File
  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = `events/${randomUUID()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(filePath, buffer, {
      contentType: file.type,
    })

  if (error) {
    return NextResponse.json({ message: 'Upload gagal', error }, { status: 500 })
  }

  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-images/${filePath}`

  const newEvent = await prisma.event.create({
    data: {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      price: parseInt(formData.get('price') as string),
      availableSeat: parseInt(formData.get('availableSeat') as string),
      imageUrl,
      organizer: {
        connect: { email: session.user.email },
      },
    },
  })

  return NextResponse.json(newEvent)
}
