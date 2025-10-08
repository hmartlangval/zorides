import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo users
  const users = [
    {
      email: 'alice@demo.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Alice Johnson',
      age: 24,
      gender: 'female',
      state: 'Maharashtra',
      district: 'Mumbai',
      locality: 'Andheri West',
      bio: 'Love music and outdoor events! Always looking for new friends.',
    },
    {
      email: 'bob@demo.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Bob Smith',
      age: 28,
      gender: 'male',
      state: 'Karnataka',
      district: 'Bangalore Urban',
      locality: 'Koramangala',
      bio: 'Tech enthusiast and adventure seeker.',
    },
    {
      email: 'charlie@demo.com',
      password: await bcrypt.hash('password123', 10),
      name: 'Charlie Davis',
      age: 22,
      gender: 'male',
      state: 'Maharashtra',
      district: 'Pune',
      locality: 'Viman Nagar',
      bio: 'Movie buff and foodie!',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.name}`);
  }

  // Create sample events
  const alice = await prisma.user.findUnique({ where: { email: 'alice@demo.com' } });
  const bob = await prisma.user.findUnique({ where: { email: 'bob@demo.com' } });

  if (alice) {
    const event1 = await prisma.event.create({
      data: {
        title: 'Weekend Concert at Phoenix Mall',
        description: 'Amazing live music event this weekend! Looking for company to enjoy the concert together.',
        state: 'Maharashtra',
        district: 'Mumbai',
        locality: 'Lower Parel',
        venue: 'Phoenix Marketcity',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        creatorId: alice.id,
        status: 'OPEN',
        mediaUrls: [],
      },
    });
    console.log(`✅ Created event: ${event1.title}`);
  }

  if (bob) {
    const event2 = await prisma.event.create({
      data: {
        title: 'Tech Meetup - Bangalore',
        description: 'Networking event for tech enthusiasts. Great opportunity to connect with like-minded people!',
        state: 'Karnataka',
        district: 'Bangalore Urban',
        locality: 'Indiranagar',
        venue: 'Social Offline',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        creatorId: bob.id,
        status: 'OPEN',
        mediaUrls: [],
      },
    });
    console.log(`✅ Created event: ${event2.title}`);
  }

  console.log('✨ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
