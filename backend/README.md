# GoBeyond Travels — Backend Architecture & API Documentation

This directory contains the production-grade **Node.js, Express, Prisma ORM, Socket.io, and AI-powered Backend Engine** for the **GoBeyond Travels** Indian Cultural & Heritage Tourism platform.

---

## 🚀 Quick Start

### 1. Start Server
From the project root:
```bash
# Option A: Double click the root launcher:
run.bat

# Option B: Run via npm in backend:
cd backend
npm run dev
```

The backend starts on `http://localhost:5000` with the health check live at:
`http://localhost:5000/api/health`

---

## 🔐 Pre-Seeded Demonstration Accounts

| Role | Email | Password | Access Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@gobeyond.travel` | `admin123` | Full access to `/admin.html`, guide verification queue, metrics, and fraud controls |
| **Traveler** | `anita@gobeyond.travel` | `traveler123` | Booking expeditions, verified reviews, payment checkout |
| **Local Guide** | `ramesh.bastar@gobeyond.travel` | `guide123` | Muria Guild Master profile, guide earnings wallet, review responses |

---

## 🗄️ Database & PostgreSQL Switchability

By default, the backend utilizes **SQLite (`dev.db`)** for zero-configuration, instant plug-and-play local execution without requiring a local PostgreSQL daemon or Docker container.

### To switch to PostgreSQL:
1. Open `backend/prisma/schema.prisma` and update:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Open `backend/.env` and supply your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/gobeyond?schema=public"
   ```
3. Run:
   ```bash
   npx prisma db push
   node prisma/seed.js
   ```

---

## 📡 The 12 Architectural Modules & API Endpoints

### 1. Authentication & Authorization (RBAC)
- `POST /api/auth/register` — Register traveler, guide, or admin
- `POST /api/auth/login` — Returns JWT token and user profile
- `GET /api/auth/me` — Authenticated profile (Bearer token)
- `POST /api/auth/forgot-password` & `POST /api/auth/reset-password`
- `POST /api/auth/google` — Social login verification

### 2 & 3. Guide Verification & Badge System
- `POST /api/guides/apply` — Multer upload for Government ID and Certificates
- `GET /api/guides` — Filter by city, badge tier, language
- `GET /api/guides/:id` — Guide details with dynamically calculated `liveScore`
- `PATCH /api/guides/:id/status` — Admin verification (`APPROVED` / `REJECTED`, badge: `Bronze`, `Silver`, `Gold`, `Verified Expert`)

### 4. Booking Management
- `GET /api/bookings/availability` — Slot availability check against max non-mass threshold
- `POST /api/bookings` — Create booking with reference (`GB-XXXXXX`)
- `GET /api/bookings` — User / guide / admin booking list
- `GET /api/bookings/:id` — Ticket slip details
- `PATCH /api/bookings/:id/status` — Status machine (`PENDING` -> `CONFIRMED` -> `COMPLETED` -> `CANCELLED`)
- `POST /api/bookings/:id/cancel` — Cancellation policy & refund trigger

### 5. Real-Time Crowd Density Engine (Socket.io)
- `GET /api/crowd` — Live crowd meters for all heritage hubs
- `GET /api/crowd/:destinationId` — Detailed visitor density history
- `POST /api/crowd/report` — Guide check-in / sensor submission
- **WebSocket Broadcast**: Emits `crowd:update` and `crowd:global_update` events live to clients

### 6. Recommendation Engine
- `GET /api/recommendations` — Scored ranking based on user interests, budget ceiling, season matching, and low-crowd bonus

### 7. Maps & Route Optimization
- `GET /api/routes/:destinationId` — Airport, railway junction, and highway road conditions with transfer times and insider travel tips
- `POST /api/routes/multi-stop` — Multi-day itinerary sequencing across heritage clusters

### 8. Review & Trust System
- `POST /api/reviews` — Enforces verified stay checks before publishing
- `POST /api/reviews/:id/reply` — Native guide response system
- `GET /api/reviews/destination/:destinationId` — Verified traveler feedback with AI sentiment summary
- **Dynamic Trust Formula**:
  $$\text{Guide Score} = (\text{Rating} \times 0.70) + (\text{Completed Tours Weight} \times 0.20) + (\text{Response Rate} \times 0.10)$$

### 9. Payments Engine
- `POST /api/payments/create-order` — Razorpay order generation (sandbox test keys included)
- `POST /api/payments/verify` — Cryptographic signature check & automated **85% Guide Share / 15% Platform Conservation** split
- `GET /api/payments/wallet` — Guide disbursements, platform commission ledger, and traveler heritage credits

### 10. Notification Service
- `GET /api/notifications` — In-app notification inbox
- `PATCH /api/notifications/:id/read` — Mark notifications as read
- **Live Push**: Socket.io emits `notification:new` on booking confirmation and guide assignments

### 11. Admin Dashboard API
- `GET /api/admin/metrics` — Active users, gross booking value, commission, payouts
- `GET /api/admin/guides/pending` — Live verification queue
- `PATCH /api/admin/users/:id/block` — Fraud management

### 12. AI Features (Hackathon Ready)
- `POST /api/ai/chat` — AI Travel Assistant: recommends hidden heritage spots under budget
- `POST /api/ai/itinerary` — AI Itinerary Generator: generates structured Day 1, Day 2, Day 3 plans
- `GET /api/ai/summarize/:destinationId` — AI Review Summarizer: extracts Pros & Cons
