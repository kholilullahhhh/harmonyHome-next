import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const faqUpdateSchema = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = faqUpdateSchema.parse(body);

    const faq = await prisma.faq.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: faq });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Update FAQ error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui FAQ.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.faq.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Delete FAQ error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus FAQ.' },
      { status: 500 }
    );
  }
}
