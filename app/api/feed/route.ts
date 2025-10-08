import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');
    // Fetch recent events
    const events = await prisma.event.findMany({
      where: {
        status: { not: 'CANCELLED' },
      },
      include: {
        creator: {
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
      take: 20,
    });

    // Fetch recent groups
    const groups = await prisma.attendantGroup.findMany({
      where: {
        status: { in: ['OPEN', 'FILLED'] },
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
            date: true,
            state: true,
            district: true,
            locality: true,
          },
        },
        members: currentUserId ? {
          where: {
            userId: currentUserId,
          },
          select: {
            status: true,
            userId: true,
          },
        } : false,
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });

    // Combine and format for feed
    const feedItems = [
      ...events.map((event) => ({
        id: event.id,
        type: 'event' as const,
        userId: event.creator.id,
        userName: event.creator.name,
        userAvatar: event.creator.avatar,
        image: event.mediaUrls[0] || null,
        title: event.title,
        description: event.description,
        location: `${event.locality}, ${event.district}, ${event.state}`,
        date: event.date.toISOString(),
        status: event.status,
        createdAt: event.createdAt.toISOString(),
      })),
      ...groups.map((group) => {
        const userMembership = currentUserId && group.members && group.members.length > 0 ? group.members[0] : null;
        return {
          id: group.id,
          type: 'group' as const,
          userId: group.creator.id,
          userName: group.creator.name,
          userAvatar: group.creator.avatar,
          image: group.groupImage || null,
          title: `Looking for companions - ${group.event?.title || 'Event'}`,
          description: group.planDescription,
          location: group.event ? `${group.event.locality}, ${group.event.district}, ${group.event.state}` : 'Location not specified',
          date: group.event?.date?.toISOString(),
          rideOwnership: group.rideOwnership,
          maxPeople: group.maxPeople,
          memberCount: group._count.members,
          status: group.status,
          userMembershipStatus: userMembership?.status || null,
          isCreator: group.creator.id === currentUserId,
          createdAt: group.createdAt.toISOString(),
          eventId: group.eventId,
        };
      }),
    ];

    // Sort by creation date (most recent first)
    feedItems.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({ feed: feedItems });
  } catch (error) {
    console.error('Feed fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feed' },
      { status: 500 }
    );
  }
}
