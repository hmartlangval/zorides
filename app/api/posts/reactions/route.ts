import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { postId, userId, type } = body;

    if (!postId || !userId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if reaction already exists
    const existing = await prisma.reaction.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existing) {
      // If same type, remove reaction (toggle)
      if (existing.type === type) {
        await prisma.reaction.delete({
          where: { id: existing.id },
        });
        return NextResponse.json({ success: true, action: 'removed' });
      } else {
        // Update to new type
        const reaction = await prisma.reaction.update({
          where: { id: existing.id },
          data: { type },
        });
        return NextResponse.json({ success: true, reaction, action: 'updated' });
      }
    }

    // Create new reaction
    const reaction = await prisma.reaction.create({
      data: {
        postId,
        userId,
        type,
      },
    });

    return NextResponse.json({ success: true, reaction, action: 'created' });
  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json(
      { error: 'Failed to process reaction' },
      { status: 500 }
    );
  }
}
