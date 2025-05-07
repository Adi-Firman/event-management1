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
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized - Please log in' },
      { status: 401 }
    );
  }

  try {
    // Check content type to handle both JSON and FormData
    const contentType = req.headers.get('content-type');
    
    let formData;
    if (contentType?.includes('multipart/form-data')) {
      formData = await req.formData();
    } else {
      // Fallback to JSON if not FormData
      try {
        const jsonData = await req.json();
        formData = new FormData();
        
        // Convert JSON to FormData-like structure
        for (const key in jsonData) {
          if (key === 'image' && jsonData[key] instanceof Object) {
            // Handle base64 image if sent via JSON
            const imageData = jsonData[key];
            const blob = new Blob([Buffer.from(imageData.data)], { type: imageData.type });
            formData.append(key, blob, imageData.name);
          } else {
            formData.append(key, jsonData[key]);
          }
        }
      } catch (jsonError) {
        return NextResponse.json(
          { error: 'Invalid request format' },
          { status: 400 }
        );
      }
    }

    // Validate required fields
    const requiredFields = ['title', 'description', 'location', 'category', 
                           'price', 'startDate', 'endDate', 'availableSeat'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse form data
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const location = formData.get('location') as string;
    const category = formData.get('category') as string;
    const price = parseInt(formData.get('price') as string);
    const startDate = new Date(formData.get('startDate') as string);
    const endDate = new Date(formData.get('endDate') as string);
    const availableSeat = parseInt(formData.get('availableSeat') as string);
    const imageFile = formData.get('image') as File | null;

    // Handle image upload
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      try {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const filePath = `events/${randomUUID()}-${imageFile.name}`;

        const { error } = await supabase.storage
          .from('event-images')
          .upload(filePath, buffer, {
            contentType: imageFile.type,
          });

        if (error) throw error;

        imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-images/${filePath}`;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    }

    // Create event
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
        userId: session.user.id,
      },
    });

    return NextResponse.json(newEvent, { status: 201 });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}