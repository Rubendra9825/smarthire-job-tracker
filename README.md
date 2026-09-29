# SmartHire Job Tracker

A complete, full-stack web application designed to help job seekers cleanly organize, track, and manage their job applications in one central dashboard. 

## Features
- **Authentication:** Secure user registration and login implemented with JWT and bcrypt.
- **Job Dashboard:** View total applications, response rates, and recent activity.
- **Full CRUD:** Create, edit, delete, and read applications dynamically.
- **RESTful Architecture:** Express.js API interacting with a MongoDB database.
- **Glassmorphism UI:** A modern, clean, custom-built CSS interface.

## Tech Stack
- Frontend: HTML5, CSS3, Vanilla JS
- Backend: Node.js, Express.js
- Database: MongoDB Atlas, Mongoose
- Utilities: Chart.js for analytics

## Getting Started

### 1. Set up the Backend
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory based on `.env.example`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

Start the development server:
```bash
npm run dev
```

### 2. Run the Frontend
You can serve the frontend with any static server. For example, if you have python installed:
```bash
cd frontend
python -m http.server 3000
```
Then navigate to `http://localhost:3000/index.html` in your browser.

## Built With Care
This project was built from scratch using vanilla technologies to maximize understanding of DOM rendering, application state flows, and full-stack integration without relying heavily on bloated frameworks.
