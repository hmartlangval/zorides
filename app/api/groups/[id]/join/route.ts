import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    // Check if group exists and is open
    const group = await prisma.attendantGroup.findUnique({
      where: { id: params.id },
      include: {
        members: true,
        event: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    if (group.status !== 'OPEN') {
      return NextResponse.json(
        { error: 'Group is not accepting new members' },
        { status: 400 }
      );
    }

    // Check if already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: params.id,
          userId,
        },
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'Already a member of this group' },
        { status: 400 }
      );
    }

    // Check if group is full (excluding creator)
    if (group.members.length >= group.maxPeople - 1) {
      return NextResponse.json(
        { error: 'Group is full' },
        { status: 400 }
      );
    }

    // Add member with INTERESTED status (requires approval)
    const member = await prisma.groupMember.create({
      data: {
        groupId: params.id,
        userId,
        status: 'INTERESTED', // V1.1 - Requires approval
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    console.log('Member showed interest:', member);

    // Send system notification to group creator
    await prisma.message.create({
      data: {
        senderId: userId, // From the interested user
        recipientId: group.creatorId,
        content: `${member.user.name} is interested in your group "${group.event?.title || 'your event'}". Check their profile and accept or message them!`,
        isSystemMessage: true,
      },
    });

    console.log('System notification sent to creator');

    // Check if group is now full and update status
    const totalMembers = group.members.length + 1; // +1 for new member
    console.log(`Total members now: ${totalMembers}, Max: ${group.maxPeople}`);
    
    if (totalMembers >= group.maxPeople - 1) {
      await prisma.attendantGroup.update({
        where: { id: params.id },
        data: { status: 'FILLED' },
      });
      console.log('Group marked as FILLED');
    }

    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Join group error:', error);
    return NextResponse.json(
      { error: 'Failed to join group' },
      { status: 500 }
    );
  }
}
