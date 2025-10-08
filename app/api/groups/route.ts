import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      creatorId,
      planDescription,
      ageMin,
      ageMax,
      genderPreference,
      rideMode,
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
        ageMin,
        ageMax,
        genderPreference,
        rideMode,
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
