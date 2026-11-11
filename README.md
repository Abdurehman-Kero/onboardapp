# LaunchBoard

Where bootcamp projects go live. Browse, discover, and showcase student projects.

## Project Structure

- `client/` - React + Vite frontend application
- `server/` - Node.js + Express REST API backend
- `docs/API_CONTRACT.md` - Complete REST API specification

## Getting Started

### 1. Frontend (`client/`)
```bash
cd client
npm install
npm run dev
```
By default, the client runs in **Demo Mode** using in-memory mock data when `VITE_API_URL` is unset.
To connect to the backend, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend (`server/`)
```bash
cd server
npm install
npm run dev
```
The server listens on `http://localhost:4000`.
