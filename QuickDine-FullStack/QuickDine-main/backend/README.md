# QuickDine Backend

Express + MongoDB API for the QuickDine reservation platform.

## Setup

1. Copy `.env.example` to `.env`.
2. Set `MONGO_URI` and `JWT_SECRET`.
3. Install dependencies: `npm install`
4. Seed demo data: `npm run seed`
5. Start API: `npm run dev`

API runs on `http://localhost:5000` by default.

### Demo accounts
- Admin: `admin@quickdine.com` / `Admin@123`
- Owner: `owner@example.com` / `Owner@123`
- Diner: `alex@example.com` / `User@123`

Change these passwords before production use.
