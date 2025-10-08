# 🚀 Vercel Deployment Guide

## Prerequisites

1. **Prisma Accelerate Setup**
   - You're using Prisma Accelerate
   - Your connection string format: `prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_KEY`

## Environment Variables in Vercel

Go to your Vercel project settings and add these environment variables:

### Required Variables:

1. **`DATABASE_URL`**
   ```
   prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_ACTUAL_API_KEY
   ```
   ⚠️ Replace `YOUR_ACTUAL_API_KEY` with your real Prisma Accelerate API key

2. **`SESSION_SECRET`**
   ```
   your-production-secret-key-change-this
   ```
   ⚠️ Use a strong random string for production

## Build Configuration

### Build Command (Already set in package.json)
```bash
npm run build
```

This will:
1. Generate Prisma Client with `--no-engine` flag (optimized for serverless)
2. Build the Next.js app

### Install Command (Default)
```bash
npm install
```

## Deployment Steps

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import project in Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your repository

3. **Configure Environment Variables**
   - In Project Settings > Environment Variables
   - Add `DATABASE_URL` and `SESSION_SECRET`
   - Apply to: Production, Preview, and Development

4. **Deploy**
   - Vercel will automatically deploy
   - The `postinstall` script will generate Prisma Client
   - The build will succeed

## Troubleshooting

### Error: "PrismaClientInitializationError"
**Solution:** Make sure `DATABASE_URL` is set in Vercel environment variables

### Error: "Can't reach database server"
**Solution:** 
- Check your Prisma Accelerate API key is valid
- Ensure the connection string format is correct
- Verify your Prisma Accelerate subscription is active

### Error: "Module not found: Can't resolve '@prisma/client'"
**Solution:** The `postinstall` script should fix this automatically

### Build Fails on "prisma generate"
**Solution:** 
- Ensure `prisma` is in `devDependencies`
- Check that `@prisma/client` is in `dependencies`
- Both are already set correctly in package.json

## Vercel Deployment Settings

### Framework Preset
- **Framework:** Next.js

### Build Settings
- **Build Command:** `npm run build` (uses our custom script)
- **Output Directory:** `.next` (default)
- **Install Command:** `npm install` (default)

### Node.js Version
- **Recommended:** 18.x or 20.x (Vercel default)

## Post-Deployment

After successful deployment:

1. **Test all features:**
   - Login/Register
   - Create events
   - Create groups
   - Show interest in groups
   - Profile pages
   - Feed updates

2. **Check logs:**
   - Go to Vercel Dashboard > Your Project > Deployments
   - Click on the deployment
   - Check "Functions" tab for any API errors

3. **Monitor performance:**
   - Vercel Analytics (if enabled)
   - Check response times

## Security Checklist

- [ ] `SESSION_SECRET` is a strong random string
- [ ] `DATABASE_URL` contains valid Prisma Accelerate API key
- [ ] Environment variables are not committed to Git
- [ ] `.env` file is in `.gitignore`

## Performance Tips

1. **Enable Vercel Analytics** (Optional)
   ```bash
   npm install @vercel/analytics
   ```

2. **Enable Edge Runtime** for specific API routes (Future optimization)
   ```typescript
   export const runtime = 'edge';
   ```

3. **Monitor Prisma Accelerate usage**
   - Check your Prisma Cloud dashboard
   - Monitor query performance

## Important Notes

- ✅ Prisma generates with `--no-engine` flag (optimized for serverless)
- ✅ All API routes have `force-dynamic` (no caching)
- ✅ Middleware disables caching globally
- ✅ Perfect for real-time social app behavior

## Common Issues

### Issue: Old data showing after deployment
**Solution:** Clear browser cache or hard refresh (Ctrl+Shift+R)

### Issue: API routes timing out
**Solution:** 
- Check Prisma Accelerate connection
- Verify query performance
- Consider adding indexes to frequently queried fields

### Issue: Images not loading
**Solution:** 
- Images are stored locally in `/public/uploads`
- For production, migrate to Cloudinary or AWS S3 (V2 feature)

## Next Steps After Deployment

1. Share your Vercel URL: `https://your-app-name.vercel.app`
2. Test on mobile devices
3. Invite friends to test
4. Monitor for any errors

---

**Deployment Status:** ✅ Ready to deploy!

**Your app will be live at:** `https://[your-project-name].vercel.app`

