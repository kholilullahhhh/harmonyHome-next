import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

const ruleUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  items: z.array(z.string()).optional(),
  sortOrder: z.number().min(0).optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = ruleUpdateSchema.parse(body);

    const rule = await prisma.rule.update({
      where: { id: params.id },
      data: validated,
    });

    return NextResponse.json({ data: rule });
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
    console.error('Update rule error:', error);
    return NextResponse.json(
      { error: 'Gagal memperbarui aturan.' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.rule.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Data tidak ditemukan.' },
        { status: 404 }
      );
    }
    console.error('Delete rule error:', error);
    return NextResponse.json(
      { error: 'Gagal menghapus aturan.' },
      { status: 500 }
    );
  }
}
