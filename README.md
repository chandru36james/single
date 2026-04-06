# SingleFrame Proposal System

A production-hardened, decoupled full-stack application for generating high-quality PDF proposals and brochures. Built with a React frontend and a Node.js Express backend, optimized for performance, scalability, and security.

## 🚀 Key Features

### Frontend (React + Vite + TS)
- **Decoupled Architecture**: Designed for independent deployment on Vercel.
- **Centralized API Utility**: Custom `api.ts` with built-in:
  - Request deduplication for GET requests.
  - Automatic timeout protection (30s).
  - Intelligent `FormData` vs `JSON` handling.
  - Robust error parsing for both JSON and Blob (PDF) responses.
- **Modern UI**: Styled with Tailwind CSS and Framer Motion for smooth animations.
- **Firebase Integration**: Secure authentication and real-time data synchronization with Firestore.

### Backend (Express + TS)
- **Standalone Server**: Optimized for deployment on Render.
- **Puppeteer PDF Generation**:
  - **Singleton Browser**: Reuses a single Chromium instance to eliminate cold-start latency.
  - **Concurrency Control**: Limits simultaneous PDF generations to prevent memory exhaustion (OOM).
  - **In-Memory Caching**: Caches the last 10 unique PDF brochures for 10 minutes.
- **Production Hardening**:
  - `helmet` for security headers.
  - `cors` with dynamic origin validation.
  - `express-rate-limit` for abuse prevention.
  - `compression` for smaller, faster payloads.
  - `morgan` for detailed request logging.
- **Stability & Safety**:
  - `catchAsync` utility to prevent unhandled promise rejections.
  - Graceful shutdown handlers (`SIGTERM`) with resource cleanup.
  - Race-condition safe timeout middleware.

---

## 📂 Folder Structure

```text
├── server/                 # Standalone Express Backend
│   ├── controllers/        # Request handlers
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic (e.g., Puppeteer service)
│   └── index.ts            # Server entry point
├── src/                    # React Frontend
│   ├── components/         # UI components
│   ├── lib/                # Utilities (api.ts, firebase.ts)
│   ├── pages/              # Route pages
│   └── App.tsx             # Main React entry
├── package.json            # Scripts and shared dependencies
└── tsconfig.server.json    # Backend-specific TS configuration
```

---

## 🛠 Prerequisites

- **Node.js**: v18 or higher.
- **npm**: v9 or higher.
- **Firebase Project**: For Auth and Firestore.

## 🔑 Authentication & Database Configuration

This project uses **Firebase** for authentication and **Firestore** for the database. Below are the credentials and configuration details for your personal documentation.

### Firebase Configuration (`firebase-applet-config.json`)
| Key | Value |
| :--- | :--- |
| **Project ID** | `neat-acre-471604-k3` |
| **App ID** | `1:818383162805:web:f2ec440a644cae4e71ddfc` |
| **API Key** | `AIzaSyD4O3fWqMqJtPBQXprityZFbghiseLE4Vs` |
| **Auth Domain** | `neat-acre-471604-k3.firebaseapp.com` |
| **Firestore DB ID** | `ai-studio-59156c13-75cc-47bb-9a8f-6ec6ebef1df0` |
| **Storage Bucket** | `neat-acre-471604-k3.firebasestorage.app` |
| **Messaging ID** | `818383162805` |

### Environment Variables (`.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Required for AI features. | *Managed by AI Studio* |
| `PORT` | Backend server port. | `3000` |
| `CLIENT_URL` | Frontend origin for CORS. | `http://localhost:5173` |
| `VITE_API_URL` | Backend API endpoint. | `http://localhost:3000` |
| `NODE_ENV` | Environment mode. | `development` / `production` |

---

## ⚙️ Installation & Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd singleframe-proposal-system
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory:

```env
# Backend
PORT=3000
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

### 3. Local Development

Run the backend:
```bash
npm run dev:server
```

Run the frontend:
```bash
npm run dev:client
```

---

## 🌍 Deployment Guide

### Backend (Render)
1.  **Create a New Web Service**: Connect your repository.
2.  **Runtime**: Node.
3.  **Build Command**: `npm install && npm run build:server`
4.  **Start Command**: `npm run start`
5.  **Environment Variables**:
    *   `PORT`: `3000`
    *   `CLIENT_URL`: `https://your-frontend.vercel.app`
    *   `NODE_ENV`: `production`

### Frontend (Vercel)
1.  **Import Project**: Connect your repository.
2.  **Framework Preset**: Vite.
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `dist`
5.  **Environment Variables**:
    *   `VITE_API_URL`: `https://your-backend.onrender.com`

---

## 🛡️ Security & Performance

- **Rate Limiting**: 100 requests per 15 minutes per IP.
- **Body Size**: JSON payloads are limited to `10kb`.
- **Timeout**: Both client and server enforce a 30-second timeout.
- **Browser Lifecycle**: Chromium is managed as a singleton to save memory and reduce latency.
- **Graceful Shutdown**: The server waits for active connections and the Puppeteer browser to close before exiting.

---

## 📄 License

This project is private and proprietary.
