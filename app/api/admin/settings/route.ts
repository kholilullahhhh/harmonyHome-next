import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { z } from 'zod';

const settingsSchema = z.object({
  settings: z.array(
    z.object({
      key: z.string().min(1),
      value: z.string(),
      group: z.string().optional(),
    })
  ),
});

function deriveGroup(key: string): string {
  if (key.startsWith('contact_')) return 'contact';
  if (key.startsWith('maps_')) return 'maps';
  if (key.startsWith('stats_')) return 'stats';
  return 'general';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = settingsSchema.parse(body);

    const updates = validated.settings.map((s) =>
      prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value },
        create: {
          key: s.key,
          value: s.value,
          group: s.group ?? deriveGroup(s.key),
        },
      })
    );

    await prisma.$transaction(updates);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validasi gagal', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Upsert settings error:', error);
    return NextResponse.json(
      { error: 'Gagal menyimpan pengaturan.' },
      { status: 500 }
    );
  }
}
