# BookWorm Client + Backend API

This repository now includes:
- React + Tailwind frontend (Vite)
- Node.js + Express backend in a **single file**: `index.js`

## Run frontend

```bash
npm install
npm run dev
```

## Run backend (single-file API)

```bash
npm install
npm run server
```

Backend base URL: `http://localhost:5000`

## Demo admin

- Email: `admin@bookworm.app`
- Password: `Admin@1234`

## API overview (index.js)

- Auth: register/login
- Protected books browse/details
- Library shelves + progress update
- Review submit + admin moderation
- Recommendation endpoint
- Tutorials + admin tutorial management
- Admin dashboard, user roles, books, genres
