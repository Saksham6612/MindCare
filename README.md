# MindCare

MindCare is a comprehensive mental healthcare platform with dedicated client frontend and backend API services.

## Project Structure

```
MindCare/
├── frontend/          # React + Vite frontend application
│   ├── src/           # Components, pages, hooks, api, layouts
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies & scripts
│   └── vite.config.js # Vite configuration
├── backend/           # Node.js / Express backend service
│   ├── src/           # Controllers, routes, db, models
│   └── package.json   # Backend dependencies & scripts
└── README.md          # Project overview & documentation
```

## Running the Application

### Option A: From the Root Directory
```bash
# Start frontend dev server
npm run dev

# Start backend dev server
npm run dev:backend
```

### Option B: From Individual Folders
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
npm run dev
```
