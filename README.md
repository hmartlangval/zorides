# 🎉 Zorides - Social Event Platform

Find friends for every event! Zorides is a social networking platform where users can create events, form attendant groups based on preferences, and connect with like-minded people.

## 🚀 Features (V1)

- ✅ User Authentication (Hardcoded dev accounts + Registration)
- ✅ Event Management (Create, Browse, Filter by Location)
- ✅ Attendant Groups (Create groups with preferences)
- ✅ Location-based Filtering (State, District, Locality)
- ✅ Social Feed with Posts
- ✅ Reactions (Help Find Friend, Hit Me Up)
- ✅ Comments System
- ✅ Direct Messaging
- ✅ Responsive GenZ UI Design

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL + Prisma ORM
- **File Storage:** Local filesystem (V1)
- **Authentication:** Custom (Hardcoded for V1)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd zorides
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Database**
   
   Update the `.env` file with your Prisma connection string:
   ```env
   DATABASE_URL="your-postgresql-connection-string"
   ```

4. **Run Prisma migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed database (optional)**
   ```bash
   npx prisma db seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   Navigate to `http://localhost:3000`

## 🔑 Demo Credentials

For quick testing, use these hardcoded accounts:

- **Email:** alice@demo.com | **Password:** password123
- **Email:** bob@demo.com | **Password:** password123
- **Email:** charlie@demo.com | **Password:** password123

Or register a new account!

## 📂 Project Structure

```
zorides/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── (main)/              # Main app pages (feed, events, groups, messages)
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── posts/               # Post-related components
│   └── LocationInput.tsx    # Location picker
├── lib/
│   ├── auth.ts              # Authentication logic
│   ├── prisma.ts            # Prisma client
│   ├── upload.ts            # File upload handler
│   ├── locations.ts         # India location data
│   └── utils.ts             # Utility functions
├── prisma/
│   └── schema.prisma        # Database schema
├── types/
│   └── index.ts             # TypeScript types
└── public/
    └── uploads/             # Local file storage
```

## 🗺️ Location Data

The app uses a structured location system:
- **State:** Dropdown (predefined)
- **District:** Dropdown (filtered by state)
- **Locality:** Free text input

Add more states/districts in `lib/locations.ts` as needed.

## 🌟 Roadmap

### V2 (Planned)
- Social Login (Facebook, Instagram)
- Phone Verification
- Cloud Storage (Cloudinary/AWS S3)
- Real-time Messaging (WebSockets)
- Push Notifications

### V3+ (Future)
- Mobile App (React Native)
- Advanced Matching Algorithm
- Event Recommendations
- Payment Integration
- User Verification Badges

## 🤝 Contributing

This is a V1 MVP. Contributions welcome for bug fixes and improvements!

## 📝 License

MIT License

## 🙏 Acknowledgments

Built with ❤️ for connecting people and making events memorable!

---

**Note:** This is Version 1 with simplified features for rapid development. Future versions will include more advanced features as outlined in the roadmap.
