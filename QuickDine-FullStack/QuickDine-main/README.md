# QuickDine — Full Stack

QuickDine is a premium restaurant discovery and reservation platform with separate diner, restaurant owner and administrator workflows.

## Stack
- Frontend: React 19, Vite, TypeScript, Tailwind CSS v4
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Uploads: Multer

## Run locally

### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend
```bash
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

See `backend/README.md` for demo accounts and environment settings.
