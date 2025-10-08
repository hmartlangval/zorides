import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; memberId: string } }
) {
  try {
    const body = await request.json();
    const { action, creatorId } = body; // action: 'accept' | 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }

    // Verify the requester is the group creator
    const group = await prisma.attendantGroup.findUnique({
      where: { id: params.id },
      select: { creatorId: true },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    if (group.creatorId !== creatorId) {
      return NextResponse.json(
        { error: 'Only the group creator can manage members' },
        { status: 403 }
      );
    }

    // Update member status
    const member = await prisma.groupMember.update({
      where: { id: params.memberId },
      data: {
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Send notification to the member
    await prisma.message.create({
      data: {
        senderId: creatorId,
        recipientId: member.userId,
        content: action === 'accept' 
          ? `Great news! Your interest in the group has been accepted. You're in!`
          : `Your interest in the group was not accepted this time. Keep looking for other groups!`,
        isSystemMessage: true,
      },
    });

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Member management error:', error);
    return NextResponse.json(
      { error: 'Failed to update member status' },
      { status: 500 }
    );
  }
}
