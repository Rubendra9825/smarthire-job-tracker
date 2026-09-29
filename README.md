# SmartHire — Job & Internship Tracker

> A full-stack web application that allows students and freshers to track job and internship applications, manage interview schedules, view analytics, and match resumes to job descriptions using AI.

---

## 🚀 Stage Status

| Stage | Topic | Status |
|-------|-------|--------|
| Stage 1 | Frontend UI (HTML + CSS + JS) | ✅ Complete |
| Stage 2 | Interactive JS (localStorage) | 🔲 Coming next |
| Stage 3 | Node.js + Express Backend | 🔲 Upcoming |
| Stage 4 | MongoDB Integration | 🔲 Upcoming |
| Stage 5 | JWT Authentication | 🔲 Upcoming |
| Stage 6 | Frontend ↔ Backend | 🔲 Upcoming |
| Stage 7 | Analytics & Charts | 🔲 Upcoming |
| Stage 8 | AI Resume Matcher | 🔲 Upcoming |
| Stage 9 | Testing & Bug Fixes | 🔲 Upcoming |
| Stage 10 | Deployment | 🔲 Upcoming |

---

## ✨ Features

- 📋 Track job/internship applications with full details
- 📊 Dashboard with stats — total, interviews, offers, rejections, response rate
- 🔍 Search and filter applications by company/role/status
- 📅 Upcoming interview calendar
- 📈 Analytics with 4 Chart.js charts
- 🤖 AI Resume Matcher (keyword-based in Stage 1, NLP in Stage 8)
- 👤 User profile with skills, preferences, and resume storage
- 🔐 JWT authentication (Stage 5)
- 📱 Fully responsive — desktop, tablet, mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, JavaScript (Vanilla) |
| CSS Framework | Bootstrap Icons + Custom CSS |
| Charts | Chart.js |
| Backend | Node.js + Express.js (Stage 3) |
| Database | MongoDB + Mongoose (Stage 4) |
| Auth | JWT + bcrypt (Stage 5) |
| AI Feature | Python / AI API (Stage 8) |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## 📁 Project Structure

```
SmartHire/
│
├── frontend/
│   ├── index.html              ← Landing page
│   ├── login.html              ← Login form
│   ├── register.html           ← Registration form
│   ├── dashboard.html          ← Stats, recent apps, chart
│   ├── applications.html       ← Applications table/card view
│   ├── application-detail.html ← Single application view
│   ├── analytics.html          ← 4 analytics charts
│   ├── profile.html            ← User profile + skills
│   ├── resume-matcher.html     ← AI resume vs JD analysis
│   ├── css/
│   │   └── style.css           ← All custom styles
│   └── js/
│       ├── main.js             ← Shared utilities + mock data
│       ├── dashboard.js        ← Dashboard page logic
│       ├── applications.js     ← CRUD + search/filter
│       ├── analytics.js        ← Chart.js charts
│       ├── profile.js          ← Profile + skills tags
│       └── resume-matcher.js   ← Keyword match engine
│
├── backend/                    ← Coming in Stage 3
│   ├── server.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── config/
│
├── ai/                         ← Coming in Stage 8
│
├── .env.example                ← Coming in Stage 3
├── .gitignore
└── README.md
```

---

## 🏃 How to Run (Stage 1 — No Server Needed)

Since Stage 1 is purely HTML/CSS/JS, you can open the app directly in your browser.

### Option A: Open Directly (simplest)

1. Navigate to `d:\project\smarthire\frontend\`
2. Double-click `index.html`
3. Click **Get Started** or **View Demo**

### Option B: VS Code Live Server (recommended)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Open the `frontend/` folder in VS Code
3. Right-click `index.html` → **Open with Live Server**
4. Your browser opens at `http://localhost:5500`

---

## 📖 Page Guide

| Page | URL | Description |
|------|-----|-------------|
| Landing | `index.html` | Hero section, features, CTA |
| Login | `login.html` | Email + password login |
| Register | `register.html` | Name, email, password + strength meter |
| Dashboard | `dashboard.html` | Stats cards, recent apps, interviews |
| Applications | `applications.html` | Table/card view, add/edit/delete |
| App Detail | `application-detail.html?id=1` | Full detail + status change + notes |
| Analytics | `analytics.html` | 4 Chart.js charts |
| Profile | `profile.html` | Personal info, skills, resume |
| Resume Matcher | `resume-matcher.html` | Paste resume + JD → keyword analysis |

---

## 🔐 Security (Stage 5+)

- Passwords hashed with **bcrypt**
- Authentication with **JWT tokens**
- Protected routes middleware
- Input validation on all endpoints
- CORS configured
- `.env` for secrets (never committed to git)

---

## 📝 Future Improvements

- Email notifications for interview reminders
- Chrome extension to add applications from job boards
- Mobile app (React Native)
- OpenAI / Gemini-powered resume suggestions
- Company research integration (Glassdoor / LinkedIn)
- Multi-resume management

---

## 💼 Resume Bullet Points

> Add these to your resume after completing the full project:

- **Developed SmartHire**, a full-stack job application tracker using Node.js, Express, MongoDB, and vanilla JavaScript, enabling students to manage 100+ applications with JWT-secured REST APIs
- **Engineered an AI-powered Resume Matcher** that performs NLP-based keyword extraction against job descriptions, providing match scores and skill gap analysis to improve application success rates
- **Built interactive analytics dashboards** using Chart.js displaying KPIs (response rate, interview conversion, offer rate) across 4 chart types, deployed via Vercel + Render

---

*Built with ❤️ for students and freshers. © 2025 SmartHire*
