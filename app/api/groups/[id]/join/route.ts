import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

    // Add member
    const member = await prisma.groupMember.create({
      data: {
        groupId: params.id,
        userId,
        status: 'ACCEPTED', // Auto-accept for V1
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

    console.log('Member joined:', member);

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
