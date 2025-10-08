import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Get all messages involving the user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { recipientId: userId },
        ],
        groupId: null, // Only direct messages
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Group messages by conversation partner
    const conversationsMap = new Map();

    messages.forEach((message) => {
      const partnerId = message.senderId === userId ? message.recipientId : message.senderId;
      const partner = message.senderId === userId ? message.recipient : message.sender;

      if (partnerId && !conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          id: partnerId,
          name: partner?.name || 'Unknown',
          avatar: partner?.avatar,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values());

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
