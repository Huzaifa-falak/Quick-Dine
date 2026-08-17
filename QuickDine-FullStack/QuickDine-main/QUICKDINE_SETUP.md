# QuickDine Full-Stack Setup

## 1. MongoDB
Create a MongoDB database (local MongoDB or MongoDB Atlas) and put its connection string in `backend/.env` as `MONGO_URI`.

## 2. Backend
```bash
cd backend
copy .env.example .env
npm install
npm run seed
npm run dev
```

For macOS/Linux replace `copy` with `cp`.

## 3. Frontend
From the project root:
```bash
copy .env.example .env
npm install
npm run dev
```

## 4. Demo accounts
- Admin: `admin@quickdine.com` / `Admin@123`
- Owner: `owner@example.com` / `Owner@123`
- Diner: `alex@example.com` / `User@123`

Change demo passwords before deployment.
