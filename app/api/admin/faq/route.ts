import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = faqSchema.parse(body);

    const faq = await prisma.faq.create({
      data: {
        question: validated.question,
        answer: validated.answer,
        sortOrder: validated.sortOrder ?? 0,
        isPublished: validated.isPublished ?? true,
      },
    });

    return NextResponse.json({ data: faq }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create FAQ error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat FAQ.' },
      { status: 500 }
    );
  }
}
