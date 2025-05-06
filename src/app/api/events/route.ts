// src/app/api/events/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { supabase } from '@/lib/supabase';

export const config = {
  api: { bodyParser: false },
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const title = formData.get('title') as string;
  const image = formData.get('image') as File;

  let imageUrl = null;
  if (image) {
    const filePath = `events/${session.user.id}-${Date.now()}.${image.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('event-images').upload(filePath, image);

    if (!error) {
      imageUrl = supabase.storage.from('event-images').getPublicUrl(filePath).data.publicUrl;
    }
  }

  const newEvent = await prisma.event.create({
    data: {
      name: title,
      description: formData.get('description') as string,
      location: formData.get('location') as string,
      category: formData.get('category') as string,
      price: parseInt(formData.get('price') as string),
      startDate: new Date(formData.get('startDate') as string),
      endDate: new Date(formData.get('endDate') as string),
      availableSeat: parseInt(formData.get('availableSeat') as string),
      image: imageUrl,
      organizerId: session.user.id,
    },
  });

  return NextResponse.json(newEvent, { status: 201 });
}
