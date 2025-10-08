## What i did for the database
1. I registered at prisma.io website
2. Then i generate credentials from the website
```
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=the_api_key"
```
3. Then execute the command in my local terminal
```
npx prisma generate --no-engine
npx prisma db push
npx prisma db seed
```

4. Start dev ``npm run dev``