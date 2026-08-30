import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const messageUpdateSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'REPLIED']),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = messageUpdateSchema.parse(body);

    const message = await prisma.contactMessage.update({
      where: { id: params.id },
      data: { status: validated.status },
    });

    return NextResponse.json({ data: message });
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
    console.error('Update message error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui pesan.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.contactMessage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Delete message error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus pesan.' },
      { status: 500 }
    );
  }
}
