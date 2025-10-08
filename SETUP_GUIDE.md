# 🚀 Setup Guide for Zorides

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

#### Option A: Using Prisma Cloud (Recommended for V1)

1. Go to [Prisma Cloud](https://cloud.prisma.io/)
2. Create a new project
3. Get your connection string (looks like: `prisma://accelerate.prisma-data.net/?api_key=...`)
4. Copy `.env.local.example` to `.env.local`
5. Add your connection string to `.env.local`

#### Option B: Using Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE zorides;
   ```
3. Update `.env.local` with your connection string:
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/zorides?schema=public"
   ```

### 3. Generate Prisma Client & Push Schema

```bash
npm run prisma:generate
npm run prisma:push
```

This will:
- Generate the Prisma Client
- Push the database schema to your database
- Create all tables

### 4. Seed Database (Optional but Recommended)

```bash
npm run prisma:seed
```

This creates:
- 3 demo users (alice@demo.com, bob@demo.com, charlie@demo.com)
- 2 sample events
- All with password: `password123`

### 5. Start Development Server

```bash
npm run dev
```

### 6. Open in Browser

Navigate to: `http://localhost:3000`

## 🎯 First Steps After Setup

1. **Login with demo account:**
   - Email: `alice@demo.com`
   - Password: `password123`

2. **Or Register a new account:**
   - Click "Sign Up" on landing page
   - Fill in your details
   - Add your location (state, district, locality)

3. **Create your first event:**
   - Go to Events → Create Event
   - Add title, description, location, date/time
   - Optionally upload photos

4. **Create an attendant group:**
   - Open an event
   - Click "Create Group"
   - Set your preferences (age range, gender, ride mode, max people)

5. **Browse and join groups:**
   - View all groups in an event
   - Click "Join This Group" to connect
   - Start messaging group members

## 🛠️ Troubleshooting

### "Prisma Client not found"
```bash
npm run prisma:generate
```

### "Connection refused" / Database errors
- Check if PostgreSQL is running
- Verify DATABASE_URL in `.env.local`
- Ensure database exists

### File upload errors
- Ensure `public/uploads` directory exists
- Check write permissions

### Port 3000 already in use
```bash
# Use different port
npm run dev -- -p 3001
```

## 📝 Environment Variables

Create a `.env.local` file with:

```env
DATABASE_URL="your-database-url"
SESSION_SECRET="any-random-string"
```

## 🗺️ Adding More Locations

Edit `lib/locations.ts` and add states/districts:

```typescript
export const INDIA_LOCATIONS: LocationData = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
  "Karnataka": ["Bangalore Urban", "Mysore"],
  "Your State": ["District 1", "District 2"],
};
```

## 🎨 Customizing UI

- Colors: Edit `tailwind.config.ts`
- Global styles: Edit `app/globals.css`
- Components: Modify files in `components/` directory

## 🚀 Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Works on any platform supporting Next.js:
- Netlify
- Railway
- Render
- AWS
- DigitalOcean

## 📞 Need Help?

Check:
1. README.md for general info
2. This SETUP_GUIDE.md for setup issues
3. Prisma docs: https://www.prisma.io/docs
4. Next.js docs: https://nextjs.org/docs

---

Happy coding! 🎉
