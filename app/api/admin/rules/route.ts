import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const ruleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  items: z.array(z.string()).optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = ruleSchema.parse(body);

    const rule = await prisma.rule.create({
      data: {
        title: validated.title,
        description: validated.description ?? '',
        icon: validated.icon ?? 'ScrollText',
        items: validated.items ?? [],
        sortOrder: validated.sortOrder ?? 0,
        isPublished: validated.isPublished ?? true,
      },
    });

    return NextResponse.json({ data: rule }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Create rule error:', error);
    return NextResponse.json(
      { error: 'Gagal membuat aturan.' },
      { status: 500 }
    );
  }
}
