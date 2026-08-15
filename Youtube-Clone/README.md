# YouTube Clone

Minimal YouTube-like app with a React frontend and Express backend.

Quick start

1. Install server dependencies and start server:

```bash
cd server
npm install
npm run dev
```

2. Install client dependencies and start frontend:

```bash
cd client
npm install
npm run dev
```

Backend runs on `http://localhost:4000` and API is under `/api/videos`.

Frontend runs on `http://localhost:5173` (Vite default).

Authentication

- Register: `POST /api/auth/register` with `{ "username": "you", "password": "pass" }`.
- Login: `POST /api/auth/login` with same body — returns a `token` to send as `Authorization: Bearer <token>`.

Protected endpoints (require auth):
- `POST /api/videos` (upload)
- `POST /api/videos/:id/like`
- `POST /api/videos/:id/comments`

The frontend has `/login` and `/signup` pages that store the token in `localStorage`.

File uploads

- You can upload video files and optional thumbnail images at `POST /api/videos/upload` (multipart/form-data, fields: `video` (file), `thumbnail` (file), `title`, `description`).
- Uploaded files are served under `/uploads` (e.g. `/uploads/videos/...`, `/uploads/thumbs/...`).
- If no thumbnail is provided, the server generates a simple placeholder thumbnail.
