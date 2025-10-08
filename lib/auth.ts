import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Hardcoded users for V1 development
export const DEV_USERS = [
  {
    email: 'alice@demo.com',
    password: 'password123',
    name: 'Alice Johnson',
    age: 24,
    gender: 'female',
    state: 'Maharashtra',
    district: 'Mumbai',
    locality: 'Andheri West'
  },
  {
    email: 'bob@demo.com',
    password: 'password123',
    name: 'Bob Smith',
    age: 28,
    gender: 'male',
    state: 'Karnataka',
    district: 'Bangalore Urban',
    locality: 'Koramangala'
  },
  {
    email: 'charlie@demo.com',
    password: 'password123',
    name: 'Charlie Davis',
    age: 22,
    gender: 'male',
    state: 'Maharashtra',
    district: 'Pune',
    locality: 'Viman Nagar'
  }
];

// Simple session management (V1 - hardcoded validation)
export async function validateCredentials(email: string, password: string) {
  // Check for admin login (V1.2) - accept both 'admin' and 'admin@system.internal'
  if (email === 'admin' || email === 'admin@system.internal') {
    console.log('[AUTH] Admin login attempt detected');
    console.log('[AUTH] ADMIN_PWD is set:', !!process.env.ADMIN_PWD);
    
    if (!process.env.ADMIN_PWD) {
      console.error('[AUTH] ERROR: ADMIN_PWD environment variable is not set!');
      console.error('[AUTH] Please create a .env.local file with: ADMIN_PWD=your_password');
      return null;
    }
    
    if (password === process.env.ADMIN_PWD) {
      console.log('[AUTH] Admin password matched successfully');
      // Return a special admin user object
      let adminUser = await prisma.user.findUnique({ where: { email: 'admin@system.internal' } });
      
      if (!adminUser) {
        console.log('[AUTH] Creating admin user for first time');
        const hashedPassword = await bcrypt.hash(password, 10);
        adminUser = await prisma.user.create({
          data: {
            email: 'admin@system.internal',
            password: hashedPassword,
            name: 'System Administrator',
          }
        });
      }
      
      return adminUser;
    } else {
      console.log('[AUTH] Admin password did not match');
      return null;
    }
  }

  // Check hardcoded users first
  const devUser = DEV_USERS.find(u => u.email === email && u.password === password);
  
  if (devUser) {
    // Try to find in database, or create if doesn't exist
    let user = await prisma.user.findUnique({ where: { email } });
    
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await prisma.user.create({
        data: {
          email: devUser.email,
          password: hashedPassword,
          name: devUser.name,
          age: devUser.age,
          gender: devUser.gender,
          state: devUser.state,
          district: devUser.district,
          locality: devUser.locality,
        }
      });
    }
    
    return user;
  }
  
  // Check database for registered users
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  
  return isValid ? user : null;
}

// Check if user is admin (V1.2)
export function isAdmin(email: string) {
  return email === 'admin@system.internal';
}

export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  age?: number;
  gender?: string;
  state?: string;
  district?: string;
  locality?: string;
}) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    }
  });
  
  return user;
}

export async function getCurrentUser(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      age: true,
      gender: true,
      state: true,
      district: true,
      locality: true,
      createdAt: true,
    }
  });
}

// V2 Placeholders (not implemented)
// export async function loginWithFacebook() { throw new Error('Not implemented - V2') }
// export async function loginWithInstagram() { throw new Error('Not implemented - V2') }
// export async function verifyPhone() { throw new Error('Not implemented - V2') }
