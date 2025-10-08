import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      creatorId,
      planDescription,
      genderPreference,
      rideOwnership,
      rideMode,
      groupImage,
      maxPeople,
    } = body;

    if (!eventId || !creatorId || !planDescription || !maxPeople) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const group = await prisma.attendantGroup.create({
      data: {
        eventId,
        creatorId,
        planDescription,
        genderPreference,
        rideOwnership,
        rideMode,
        groupImage,
        maxPeople,
        status: 'OPEN',
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, group });
  } catch (error) {
    console.error('Group creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create group' },
      { status: 500 }
    );
  }
}

// V1.2 - Update group (author only)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      groupId,
      userId,
      planDescription,
      genderPreference,
      rideOwnership,
      rideMode,
      groupImage,
      maxPeople,
      status,
    } = body;

    if (!groupId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify ownership
    const group = await prisma.attendantGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    if (group.creatorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - not the group creator' },
        { status: 403 }
      );
    }

    const updateData: any = {};
    if (planDescription !== undefined) updateData.planDescription = planDescription;
    if (genderPreference !== undefined) updateData.genderPreference = genderPreference;
    if (rideOwnership !== undefined) updateData.rideOwnership = rideOwnership;
    if (rideMode !== undefined) updateData.rideMode = rideMode;
    if (groupImage !== undefined) updateData.groupImage = groupImage;
    if (maxPeople !== undefined) updateData.maxPeople = maxPeople;
    if (status !== undefined) updateData.status = status;

    const updatedGroup = await prisma.attendantGroup.update({
      where: { id: groupId },
      data: updateData,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, group: updatedGroup });
  } catch (error) {
    console.error('Group update error:', error);
    return NextResponse.json(
      { error: 'Failed to update group' },
      { status: 500 }
    );
  }
}

// V1.2 - Delete group (author only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const userId = searchParams.get('userId');

    if (!groupId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify ownership
    const group = await prisma.attendantGroup.findUnique({
      where: { id: groupId },
    });

    if (!group) {
      return NextResponse.json(
        { error: 'Group not found' },
        { status: 404 }
      );
    }

    if (group.creatorId !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized - not the group creator' },
        { status: 403 }
      );
    }

    await prisma.attendantGroup.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Group deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}