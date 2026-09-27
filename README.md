# ResolveAI

AI-Powered Customer Support & Ticket Management Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.2.8-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-orange.svg)](https://ai.google.dev/)
[![Vercel Ready](https://img.shields.io/badge/Vercel-Single%20Project%20Deployment-black.svg)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

ResolveAI is a modern, production-grade SaaS customer support platform where **Google Gemini AI** is deeply integrated into core operational workflows rather than just acting as a disconnected chatbot.

Support agents can autonomously analyze incoming tickets, predict customer sentiment, calculate SLA urgency, and generate contextual responses that can be reviewed, edited, and dispatched with a single click.

---

## 🏗️ Production Architecture (Unified Vercel Deployment)

```text
Vercel (Single Full-Stack Project)
├── React Frontend (Vite SPA static assets from client/dist)
└── Express.js REST API (Vercel Serverless Function via /api/index.js)
      ├── MongoDB Atlas (Cloud Database)
      └── Google Gemini AI Engine (Server-Side Only)
```

> 🔒 **Security Notice**: All Google Gemini API calls and JWT operations are strictly performed server-side in `server/services/geminiService.js`. The `GEMINI_API_KEY`, `MONGODB_URI`, and `JWT_SECRET` are **never** exposed or bundled into the client browser application. Furthermore, AI outputs are suggestions—support agents always maintain final human oversight before dispatching replies to customers.

---

## ✨ Key Features & AI Capabilities

### 1. 🤖 Deep Gemini AI Ticket Intelligence
- **Autonomous Semantic Extraction**: Analyzes ticket subject, description, and multi-turn conversation logs to determine:
  - **Category**: Technical, Payment, Billing, Account, Bug, Feature Request, Other
  - **Priority**: Low, Medium, High, Critical
  - **Customer Sentiment**: Positive, Neutral, Frustrated, Angry, Urgent, Confused
  - **Urgency Level**: Low, Medium, High, Immediate
  - **Executive Summary**: 1-2 sentence issue synopsis
  - **Action Items**: Prescriptive technical troubleshooting steps
- **Smart Response Generator**: Generates customized multi-paragraph customer replies tailored by tone (*Empathetic*, *Technical*, *Concise*, *Executive*).
- **"Use Response" 1-Click Workflow**: Injects the AI draft directly into the live textarea for agent review and editing.
- **AI Support Copilot (`/ai-assistant`)**: Conversational support copilot capable of querying queue status, finding critical tickets, and composing escalation templates.

### 2. 🎨 Modern SaaS User Interface & Aesthetics
- **Linear & Intercom-Inspired Design**: Clean border radii, glassmorphism (`backdrop-blur-xl`), subtle micro-animations, and custom scrollbars.
- **Full Dark Mode & Light Mode**: Tailored dark surfaces and text hierarchy with persistent state in `localStorage`.
- **Global ⌘K Command Search**: Instant modal for finding tickets by ID, subject, customer, or jumping to AI Copilot.
- **Floating Toast System & Skeleton Loaders**: Real-time feedback and smooth loading transitions across all operations.

### 3. 📊 Interactive Analytics & Telemetry (Recharts)
- 7-Day Ticket Inflow vs. Resolution Area Chart
- Horizontal Category Distribution Bar Chart
- Customer Sentiment Breakdown Donut Chart
- Hourly Ticket Volume Inflow Heatmap
- Support Agent SLA Leaderboard

### 4. 👥 Role-Based Access Control (RBAC) & Customers Directory
- **Customer Role**: Submit inquiries, track resolution progress, participate in live conversation threads.
- **Support Agent Role**: Ticket triage, Gemini AI analysis, customer replies, internal staff notes, SLA tracking.
- **Admin Role**: Full workspace control, team management, invite/disable agents, workspace analytics.
- **Customer 360° View**: Historic customer profiles, satisfaction ratings, and previous conversation records.

---

## 🔑 Demo Accounts & Credentials

> ℹ️ *Note: All demo accounts and seed tickets use fictional demo data for portfolio demonstration purposes.*

| Role | Email | Password | Scope |
|---|---|---|---|
| **Support Agent** | `agent@resolveai.io` | `password123` | Ticket queue, Gemini AI analysis, replies, analytics |
| **Customer** | `customer@resolveai.io` | `password123` | Submit and track support inquiries |
| **Administrator** | `admin@resolveai.io` | `password123` | Full team management, invite members, workspace settings |

*The login page also provides **1-Click Quick Demo Login buttons** for instant evaluation.*

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide Icons, Framer Motion, Recharts, Axios, React Router DOM |
| **Backend** | Node.js, Express.js, REST API Architecture, JWT Authentication, bcryptjs, Mongoose, Morgan |
| **Database** | MongoDB Atlas (with zero-configuration local in-memory fallback store) |
| **AI Integration** | Google Gemini Generative AI SDK (`@google/generative-ai`) + Fallback NLP engine |
| **Deployment** | Vercel (Unified Frontend + Serverless Express REST API) |

---

## 📁 Folder Structure

```
├── api/
│   └── index.js                # Vercel Serverless Function entry point (Express adapter)
├── client/                     # Vite React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/         # AppNavbar, Navbar, Sidebar, DashboardLayout
│   │   │   ├── ui/             # Badge, Button, Card, Input, Modal, Skeleton, Toast, EmptyState
│   │   │   ├── tickets/        # CreateTicketModal
│   │   │   └── search/         # CommandSearchModal (⌘K)
│   │   ├── context/            # AuthContext, ThemeContext, ToastContext
│   │   ├── pages/              # LandingPage, LoginPage, RegisterPage, DashboardPage,
│   │   │                       # TicketsPage, TicketDetailsPage, AIAssistantPage,
│   │   │                       # CustomersPage, CustomerDetailsPage, AnalyticsPage,
│   │   │                       # TeamPage, SettingsPage
│   │   ├── services/           # Axios client & centralized API service methods
│   │   ├── App.jsx             # React Router routing & ProtectedRoute guards
│   │   ├── main.jsx            # React root mount & BrowserRouter
│   │   └── index.css           # Tailwind design tokens & dark mode utilities
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── server/                     # Express REST API Backend
│   ├── config/                 # db.js (MongoDB serverless connection pooling)
│   ├── controllers/            # auth, ticket, message, customer, ai, analytics, team
│   ├── middleware/             # authMiddleware.js (JWT & RBAC), errorMiddleware.js
│   ├── models/                 # User.js, Ticket.js, Message.js, AIInsight.js
│   ├── routes/                 # Express modular routes
│   ├── services/               # geminiService.js & mockDataStore.js
│   ├── utils/                  # seedData.js
│   ├── app.js                  # Express middleware & single-origin CORS
│   ├── server.js               # Local development server entry point
│   ├── package.json
│   └── .env.example
│
├── vercel.json                 # Vercel routing & build configuration
├── package.json                # Root package orchestration & serverless dependencies
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

### Vercel Environment Variables (Configured in Project Settings)

| Variable | Scope | Description |
|---|---|---|
| `MONGODB_URI` | **Server-Only** | MongoDB Atlas connection URI |
| `JWT_SECRET` | **Server-Only** | Secure random key for signing JWT auth tokens |
| `GEMINI_API_KEY` | **Server-Only** | Google Gemini API key from Google AI Studio |
| `NODE_ENV` | **Server-Only** | `production` |
| `VITE_API_URL` | **Client (Optional)** | Defaults to `/api` for same-origin routing |

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
# Clone repository
git clone https://github.com/Mit2001/resolveai-ai-support-platform.git
cd resolveai-ai-support-platform

# Install root, backend, and frontend packages
npm run install:all
```

### 2. Start Backend API Server
```bash
cd server
npm run dev
# Server running at http://localhost:5000
```

### 3. Start Frontend Client
```bash
cd client
npm run dev
# Frontend running at http://localhost:5173
```

---

## 🚢 Single-Project Vercel Deployment Guide

1. In **[Vercel](https://vercel.com)**, click **Add New > Project** and import `Mit2001/resolveai-ai-support-platform`.
2. Configure project settings:
   - **Framework Preset**: `Other` (or `Vite`)
   - **Root Directory**: `./` *(Leave blank / project root)*
   - **Build Command**: `npm run build`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`
3. Under **Environment Variables**, add:
   - `MONGODB_URI` = `mongodb+srv://<user>:<password>@cluster0.mongodb.net/resolveai?retryWrites=true&w=majority`
   - `JWT_SECRET` = `<your-secure-random-jwt-secret>`
   - `GEMINI_API_KEY` = `<your-google-gemini-api-key>`
   - `NODE_ENV` = `production`
4. Click **Deploy**. Both the React frontend and Express serverless API will be live on your single Vercel URL!

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Create new user account (Customer/Agent/Admin)
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Get current authenticated user profile

### Tickets
- `POST /api/tickets` — Create a new support ticket (with optional AI pre-classification)
- `GET /api/tickets` — List tickets with search, filters (Status, Priority, Category), sort & pagination
- `GET /api/tickets/:id` — Get ticket details, customer profile, and assigned agent
- `PATCH /api/tickets/:id` — Update ticket status, priority, category, or assigned agent
- `DELETE /api/tickets/:id` — Delete ticket (Admin only)

### Ticket Conversation
- `GET /api/tickets/:id/messages` — Fetch chronological conversation messages
- `POST /api/tickets/:id/messages` — Post reply or internal staff note

### Gemini AI Intelligence
- `POST /api/ai/analyze-ticket` — Runs Gemini AI model to analyze category, priority, sentiment, and summary
- `POST /api/ai/generate-response` — Generates tone-specific customer reply draft
- `POST /api/ai/chat` — Queries ResolveAI Copilot assistant

### Customers & Team
- `GET /api/customers` — Customer roster with total/open/resolved ticket stats
- `GET /api/customers/:id` — 360-degree customer profile and history
- `GET /api/team` — Team roster with ticket capacity
- `POST /api/team` — Invite new team member (Admin only)
- `PATCH /api/team/:id` — Update member role or active/disabled status

### Analytics & Health
- `GET /api/analytics/dashboard` — High-level KPI metrics & 7-day throughput chart data
- `GET /api/analytics/tickets` — SLA compliance, sentiment distribution, and hourly volume
- `GET /api/health` — System status and Gemini configuration indicator

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
