# StyleSphere 🛍️✨
> **Discover. Personalize. Shop.**

StyleSphere is a modern, premium full-stack fashion and lifestyle e-commerce platform built with the MERN stack (MongoDB, Express.js, React, Node.js), Vite, Tailwind CSS, Redux Toolkit, and Razorpay test mode payment integration.

---

## 🏗️ Architecture & Stack

- **Frontend**: React, Vite, Tailwind CSS, Redux Toolkit, React Router, Axios, Lucide React Icons
- **Backend**: Node.js, Express.js, Mongoose, Helmet, Morgan, CORS, Dotenv
- **Database**: MongoDB (Atlas / Local)
- **Auth**: JWT & bcrypt password hashing
- **Payments**: Razorpay Test Mode
- **Storage**: Cloudinary

---

## 📁 Project Structure

```
StyleSphere/
├── client/          # Frontend React + Vite SPA
├── server/          # Backend Express REST API
├── .env.example     # Environment variable reference
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Configure your MONGO_URI and PORT
npm run dev
```
Backend runs by default at `http://localhost:5000`.

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs by default at `http://localhost:5173`.

### 4. Health Check
Verify API status:
- URL: `http://localhost:5000/api/health`
- Response:
```json
{
  "success": true,
  "message": "StyleSphere API is healthy and operational",
  "environment": "development",
  "timestamp": "..."
}
```
