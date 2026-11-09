# Student Attendance System

A full-stack web application for managing student attendance, built with the MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
student-attendance-system/
├── backend/            # Express.js REST API & MongoDB models
│   ├── middleware/     # Auth & role verification middleware
│   ├── models/         # Mongoose schemas (Attendance, Students, User)
│   ├── Routes/         # API endpoints (Auth, Attendance, Students)
│   ├── .env.example    # Environment variable template
│   ├── package.json
│   └── server.js       # Main server entry point
├── frontend/           # React + Vite frontend application
│   ├── src/
│   │   ├── pages/      # Dashboards & Auth pages (Login, Register, etc.)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (running locally or a MongoDB Atlas URI)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env` and adjust the variables if needed:
   ```bash
   cp .env.example .env
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```
   The backend runs on `http://localhost:5000` by default.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

## Features
- **Authentication & Authorization**: Role-based access control (Admin, Faculty, Student) with JWT and bcrypt.
- **Attendance Management**: Mark and track student attendance records.
- **Student Management**: Add, update, and manage student details.
- **Responsive Dashboard**: Clean interface built with modern React.
