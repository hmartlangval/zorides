import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/auth';

// Force dynamic - NO CACHING
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// V1.2 - Get all groups (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminEmail = searchParams.get('adminEmail');

    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    const groups = await prisma.attendantGroup.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ groups });
  } catch (error) {
    console.error('Admin groups fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch groups' },
      { status: 500 }
    );
  }
}

// V1.2 - Delete group (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    const adminEmail = searchParams.get('adminEmail');

    if (!adminEmail || !isAdmin(adminEmail)) {
      return NextResponse.json(
        { error: 'Unauthorized - admin access required' },
        { status: 403 }
      );
    }

    if (!groupId) {
      return NextResponse.json(
        { error: 'Missing groupId parameter' },
        { status: 400 }
      );
    }

    await prisma.attendantGroup.delete({
      where: { id: groupId },
    });

    return NextResponse.json({ success: true, message: 'Group deleted' });
  } catch (error) {
    console.error('Admin group deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete group' },
      { status: 500 }
    );
  }
}

