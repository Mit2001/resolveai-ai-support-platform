# ResolveAI

AI-Powered Customer Support & Ticket Management Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-19.2.8-blue.svg)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-v4-38bdf8.svg)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-Generative%20AI-orange.svg)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)

ResolveAI is a modern, production-grade SaaS customer support platform where **Google Gemini AI** is deeply integrated into core operational workflows rather than just acting as a disconnected chatbot.

Support agents can autonomously analyze incoming tickets, predict customer sentiment, calculate SLA urgency, and generate contextual responses that can be reviewed, edited, and dispatched with a single click.

---

## 🏗️ System Architecture

```text
React (Vite + Tailwind CSS + Recharts)
   │
   ▼
Axios Client (VITE_API_URL + JWT Interceptors)
   │
   ▼
Express.js REST API (Node.js + RBAC Middleware)
   │
   ├───────────────────────────────┐
   ▼                               ▼
MongoDB (Mongoose Schemas)   Google Gemini AI Engine (Server-Side Only)
```

> 🔒 **Security Notice**: All Google Gemini API calls are strictly performed server-side in `server/services/geminiService.js`. The `GEMINI_API_KEY` is **never** exposed or bundled into the client application. Furthermore, AI outputs are suggestions—support agents always maintain final human oversight before dispatching replies to customers.

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
| **Database** | MongoDB (with zero-configuration local in-memory fallback store) |
| **AI Integration** | Google Gemini Generative AI SDK (`@google/generative-ai`) + Fallback NLP engine |

---

## 📁 Folder Structure

```
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
│   ├── config/                 # db.js (MongoDB connection with graceful fallback)
│   ├── controllers/            # auth, ticket, message, customer, ai, analytics, team
│   ├── middleware/             # authMiddleware.js (JWT & RBAC), errorMiddleware.js
│   ├── models/                 # User.js, Ticket.js, Message.js, AIInsight.js
│   ├── routes/                 # Express modular routes
│   ├── services/               # geminiService.js & mockDataStore.js
│   ├── utils/                  # seedData.js
│   ├── app.js                  # Express middleware & CORS configuration
│   ├── server.js               # Server entry point
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root package orchestration
├── .gitignore
├── .env.example
└── README.md
```

---

## ⚙️ Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/resolveai
JWT_SECRET=resolveai_super_secret_jwt_key_2026_modern_saas
GEMINI_API_KEY=your_google_gemini_api_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Local Development Setup

### 1. Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/resolveai-ai-support-platform.git
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

## 🗄️ MongoDB & Gemini AI Configuration

### MongoDB Setup
- **Local MongoDB**: Ensure `mongod` is running on `mongodb://127.0.0.1:27017/resolveai`.
- **MongoDB Atlas**: Replace `MONGODB_URI` with your connection string:
  ```env
  MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/resolveai?retryWrites=true&w=majority
  ```
- **Fallback Data Mode**: If MongoDB is unreachable or not installed, the platform automatically switches to an in-memory datastore with pre-seeded tickets for zero-configuration testing.

### Gemini AI Setup
1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Set `GEMINI_API_KEY=your_key_here` in `server/.env`.
3. The platform will automatically use live `gemini-1.5-flash` / `gemini-2.0-flash` models. If no key is provided, the platform uses an intelligent deterministic semantic NLP fallback engine so features remain testable.

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

## 🚢 Production Deployment Architecture

```text
       Vercel (Frontend Client)
                 │  (HTTPS / REST)
                 ▼
       Render / Railway (Node.js API Server)
        ├── MongoDB Atlas (Managed Database)
        └── Google Gemini AI API (Server-Side Inference)
```

### Vercel (Frontend)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://<your-backend-domain>/api`

### Render / Railway (Backend)
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `CLIENT_URL=https://<your-vercel-domain>`

---

## 📸 Screenshots Preview

| Landing Page & Hero | AI Insights & Ticket Details |
|---|---|
| Clean modern SaaS landing page with AI workflow visualizer | Real-time Gemini analysis panel with "Use Response" button |

| Analytics & SLA Metrics | AI Support Copilot |
|---|---|
| Recharts throughput, sentiment, and agent leaderboard | Conversational copilot for queue triage and email drafting |

---

## 🔮 Future Improvements

- [ ] Real-time WebSocket ticket updates via Socket.io
- [ ] Multi-channel support integration (Slack / Discord / Email webhooks)
- [ ] Multilingual automated response translation
- [ ] Automated SLA breach notification webhooks via PagerDuty / Opsgenie

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
