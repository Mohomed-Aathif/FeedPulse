# 🚀 AI-Powered Feedback Management System

A full-stack web application that allows users to submit feedback and enables admins to manage, analyze, and prioritize feedback using AI.

---

## 📌 Project Overview

This system allows:

* Users to submit feedback without authentication
* Automatic AI analysis of feedback (category, sentiment, priority, summary, tags)
* Admin dashboard to manage feedback efficiently
* Filtering, sorting, searching, and analytics for better decision-making

---

## 🛠️ Tech Stack

### Frontend

* Next.js (App Router)
* React (TypeScript)
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)

### AI Integration

* Google Gemini API

### Authentication

* JWT-based authentication
* bcrypt password hashing

---

## ⚙️ Features

### 🧑 User Features

* Submit feedback (no login required)
* Form validation (frontend + backend)
* Character counter for description
* Rate limiting (max 5 submissions/hour per IP)

---

### 🤖 AI Features

* Automatic analysis on submission:

  * Category
  * Sentiment (Positive / Neutral / Negative)
  * Priority score (1–10)
  * Summary
  * Tags
* Manual re-analysis by admin
* Weekly summary: Top 3 themes from last 7 days

---

### 🔐 Admin Features

* Secure login (JWT + hashed passwords)
* Dashboard with:

  * View all feedback
  * Update status (New → In Review → Resolved)
  * Delete feedback
  * Re-run AI analysis

---

### 📊 Dashboard Features

* Search (title + AI summary)
* Filters:

  * Category
  * Sentiment
  * Status
* Sorting:

  * Date
  * Priority
  * Sentiment
* Pagination (10 items per page)
* Stats:

  * Total feedback
  * Open items
  * Average priority score
  * Most common tag

---

## 📦 Project Structure

```
backend/
  src/
    controllers/
    models/
    routes/
    middleware/
    services/
  scripts/
    createAdmin.js

frontend/
  app/
    dashboard/
    login/
```

---

## 🔑 Environment Variables

### Backend (`.env`)

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=4000
```

---

### Frontend (`.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## ▶️ How to Run Locally

### 1. Clone the repository

```
git clone https://github.com/Mohomed-Aathif/FeedPulse.git
cd feedpulse
```

---

### 2. Setup Backend

```
cd backend
npm install
```

Create `.env` file and add variables.

Run server:

```
npm run dev
```

---

### 👤 Admin Setup

To create the Initial admin user:
## Local Development
```
node scripts/createAdmin.js
```

## Docker Environment
```
docker exec -it feedpulse-backend-1 node scripts/createAdmin.js
```
> Run `docker ps` to confirm the backend container name if different

Default credentials:

```
Email: admin@example.com
Password: Admin123
```
This is a one-time setup to seed the admin user into the database.

---

### 3. Setup Frontend

```
cd frontend
npm install
```

Create `.env.local` file and add:

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Run frontend:

```
npm run dev
```

---

### 4. Access Application

* Frontend: http://localhost:3000
* Admin Dashboard: http://localhost:3000/dashboard

---

## 🖼️ Screenshots

## Feedback Form
![Feedback Form](./screenshots/form.png)
## Admin Dashboard
![Dashboard](./screenshots/dashboard.png)
## Admin Login
![Login](./screenshots/login.png)
## AI Insights & Analytics
![AI Integration](./screenshots/AIIntegration.png)

---

## 🐳 Docker Setup

### Run the full application using Docker
```bash
docker compose up --build
```

### Services:

* Frontend → http://localhost:3000
* Backend → http://localhost:4000
* MongoDB included

### Environment Variables

Create a `.env` file in the root:

```
GEMINI_API_KEY=your_api_key
JWT_SECRET=your_secret
```

> MongoDB is automatically configured via Docker.
---

## 🔐 Security & Best Practices

* Passwords hashed using bcrypt
* JWT-based authentication
* Rate limiting implemented
* Environment variables secured
* Admin stored in database (not hardcoded)

---

## 🚧 Future Improvements

* Add role-based access control (multiple admins)
* Implement real-time updates using WebSockets
* Add charts/visual analytics for trends
* Improve AI insights with clustering
* Add email notifications for feedback updates
* Deploy application (Vercel + Render)

---