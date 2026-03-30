# 🚀 Scalable SaaS Dashboard System (MERN)

A production-ready enterprise dashboard system built with the MERN stack. Features role-based access control, a robust application workflow engine, and a premium interactive UI.

---

## ✨ Core Features

- **🔐 Robust Authentication**: JWT-based login with Refresh Token support.
- **🛡️ RBAC (Role-Based Access Control)**:
  - **SuperAdmin**: Full system control, user management, and audit logs.
  - **Admin**: Manage applications and user approvals.
  - **User**: Create, draft, and submit applications.
- **📈 Advanced Analytics**:
  - Real-time KPI metrics for application statuses.
  - Interactive trend charts (Area & Pie) using Recharts.
- **📂 Workflow Engine**: 
  - Status transitions: Draft → Submitted → Reviewed → Approved/Rejected.
  - Audit trail for every status change.
- **🔔 Notification System**: In-app notifications for status updates and system events.
- **💎 Premium UI**: Built with React, Tailwind CSS, and Framer Motion for smooth micro-animations.

---

## 🏗️ Technology Stack

### Backend
- **Node.js & Express**: Modular MVC architecture.
- **MongoDB & Mongoose**: Indexed collections for high performance.
- **Security**: Helmet, CORS, Rate Limiting, and Zod validation.
- **Utilities**: Morgan logging, Bcrypt password hashing.

### Frontend
- **React (Vite)**: Ultra-fast development and build.
- **Redux Toolkit**: Centralized state management for Auth and Data.
- **Tailwind CSS**: Modern utility-first styling with custom theme.
- **Lucide React**: Beautiful iconography.
- **Axios**: Promised-based HTTP client for API integration.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Installation
Clone the repository and install dependencies for both backend and frontend.

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configuration
Copy the example environment file and fill in your own secrets:
```bash
cd backend
cp .env.example .env
```
Then edit `.env` with your own values. **Never commit the `.env` file** — it is already in `.gitignore`.

> 💡 Generate strong JWT secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Database Seeding
Populate the database with sample users and applications:
```bash
cd backend
npm run seed
```
**Default Accounts:**
- **SuperAdmin**: `admin@example.com` / `admin123`
- **User**: `user@example.com` / `user123`

### 4. Running the Application
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## 🔥 Load Testing

A built-in load test script is included to stress-test the API with **10,000 requests**.

### Running the Load Test
With the backend server running, open a **separate terminal**:
```bash
cd backend
npm run loadtest
```

The script will:
1. Authenticate as the seeded admin account
2. Fire 10,000 GET requests (in batches of 200) across multiple endpoints
3. Print a detailed report with success/failure counts, throughput (req/s), and HTTP status breakdown

### Sample Output
```
═══════════════════  RESULTS  ═══════════════════
  Total Requests   : 10,000
  ✅ Success (2xx) : 2,599
  ❌ Failed        : 7,401
  🚧 Rate-Limited  : 7,401
  ⏱  Elapsed       : 3.47s
  ⚡ Throughput    : ~2882 req/s
═════════════════════════════════════════════════
```

> **Note:** The API has a rate limiter (100 req / 15 min per IP). Most requests will return `HTTP 429` — this is the system **correctly protecting itself**. To test raw throughput, temporarily increase `max` in `backend/src/app.js` and restart the server.


## 📁 Project Structure

```text
SaaS_Dashboard/
├── backend/
│   ├── src/
│   │   ├── config/      # Database & Environment configs
│   │   ├── controllers/ # Request handlers
│   │   ├── middleware/  # Protected routes & RBAC guards
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoint definitions
│   │   └── services/    # Business logic (Logs, Notifications)
│   └── .env             # Environment variables
└── frontend/
    ├── src/
    │   ├── components/  # Atomic UI components
    │   ├── layouts/     # Dashboard & Layout wrappers
    │   ├── pages/       # Page views
    │   ├── store/       # Redux slices and store config
    │   └── services/    # API calling utilities
```

---

## 🛠️ Security Measurements
- **JWT**: Stateless authentication with short-lived access tokens.
- **RBAC**: Middleware-enforced permissions at the route and controller level.
- **Validation**: Strict request body validation.
- **Helmet**: Securing HTTP headers.
- **Rate Limiting**: Protection against brute-force attacks.

---

## 📄 License
This project is for demonstration purposes. Feel free to use and modify!
