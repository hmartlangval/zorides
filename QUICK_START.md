# ⚡ Quick Start - Get Running in 5 Minutes!

## Prerequisites
- Node.js installed ✅
- Database ready (Prisma Cloud or local PostgreSQL)

## 🚀 5-Minute Setup

### 1. Install & Setup Database (2 min)
```bash
# Install dependencies
npm install

# Setup your DATABASE_URL in .env.local
# Example: DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=YOUR_KEY"
```

### 2. Initialize Database (1 min)
```bash
# Generate Prisma client and push schema
npm run prisma:generate
npm run prisma:push

# Seed with demo data (optional)
npm run prisma:seed
```

### 3. Start the App (1 min)
```bash
npm run dev
```

### 4. Login & Explore (1 min)
Open `http://localhost:3000`

**Demo Login:**
- Email: `alice@demo.com`
- Password: `password123`

## ✨ What You Can Do Now

1. ✅ **Browse Events** - See all events near you
2. ✅ **Create Event** - Add your own event with photos
3. ✅ **Create Groups** - Set preferences and find companions
4. ✅ **Join Groups** - Connect with others
5. ✅ **React to Posts** - Use "Help Find Friend" or "Hit Me Up"
6. ✅ **Message Users** - Direct messaging with group members
7. ✅ **Filter by Location** - Find events in your area

## 🎯 Try These First

```
1. Login with alice@demo.com
2. Go to Events → Browse existing events
3. Click "Create Event" → Add a new event
4. Open an event → "Create Group"
5. Set your preferences → Create
6. Go to Feed → See all posts
7. Messages → (Will populate as you interact)
```

## 🐛 Issues?

**Prisma Error?**
```bash
npm run prisma:generate
```

**Database Connection?**
- Check `.env.local` has correct `DATABASE_URL`

**Port in use?**
```bash
npm run dev -- -p 3001
```

---

That's it! You're ready to go! 🎉
