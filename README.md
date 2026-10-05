# 🏆 Sports Tournament Management System

A full-stack modern web application built using the **MERN stack** (MongoDB, Express.js, React, Node.js) with Vite to streamline sports tournament organization, team registrations, match schedules, live updates, and results tracking.

---

## 🚀 Features

- **🔐 Authentication & Role-Based Access Control**:
  - Secure JWT authentication with bcrypt password hashing.
  - Distinct permissions and workflows for **Admin** and **Team Captain / User** roles.
  - Seamless fallback demo accounts seeded automatically.

- **🏟️ Tournament Management**:
  - Create, view, search, and filter tournaments across various sports (Football, Cricket, Basketball, Badminton, E-Sports, etc.).
  - Track tournament statuses: `Upcoming`, `Ongoing`, and `Completed`.
  - Detailed tournament dashboard displaying registered teams, venues, and match brackets.

- **👥 Team Registration & Roster Management**:
  - Captains can create and manage sports teams.
  - One-click registration for available tournaments.
  - Admin approval workflow for incoming team registrations.

- **📅 Match Scheduling & Brackets**:
  - Schedule fixtures with dates, times, court/venue details, and round numbers.
  - Attach live stream links (YouTube, Twitch, etc.) directly to scheduled matches.

- **📊 Live Scores & Results**:
  - Record and update match scores in real time.
  - Automatically declare match winners and showcase tournament leaderboards.

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18** (Vite-powered single page application)
- **React Router v6** (Protected and role-based client-side routing)
- **Axios** (API requests with automatic JWT interceptors)
- **Lucide React** (Modern clean icons)
- **Custom Modern CSS** (Dark-themed glassmorphism UI)

### **Backend**
- **Node.js & Express.js** (RESTful API architecture)
- **MongoDB & Mongoose** (Data modeling and persistence)
- **MongoMemoryServer** (Zero-setup embedded in-memory MongoDB fallback)
- **JSON Web Tokens (JWT) & bcryptjs** (Secure authentication)
- **CORS & Dotenv**

---

## 📂 Project Structure

```text
├── client/                     # Frontend (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components (Navbar, Modals, etc.)
│   │   ├── context/            # AuthContext and state management
│   │   ├── pages/              # Dashboard, Tournaments, Teams, Matches, Results, etc.
│   │   ├── App.jsx             # Route definitions & guards
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend (Node.js + Express)
│   ├── config/                 # DB connection (MongoDB / MongoMemoryServer fallback)
│   ├── middleware/             # Auth and role verification middleware
│   ├── models/                 # Mongoose models (User, Tournament, Team, Match, Registration)
│   ├── routes/                 # API endpoints
│   ├── utils/                  # Database seed script
│   ├── package.json
│   └── server.js               # Express server entry point
│
├── package.json                # Root package with helper scripts
└── README.md                   # Project documentation
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- *(Optional)* [MongoDB Community Server](https://www.mongodb.com/try/download/community) — If a local MongoDB instance is not detected, the app automatically starts an embedded in-memory MongoDB server for zero-configuration setup!

### 1. Clone the Repository
```bash
git clone https://github.com/akilesh2330/Sports-tournament-manage.git
cd Sports-tournament-manage
```

### 2. Install Dependencies
You can install dependencies for both server and client at once from the root directory:
```bash
npm run install:all
```
*Or install separately:*
```bash
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### 3. Environment Configuration (Optional)
The server uses sensible defaults out-of-the-box. You can create a `.env` file in the `server/` directory if you wish to customize settings:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tournament_manager
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### 4. Running the Application

**Option A: Run from Root Directory**
- Open a terminal for the server:
  ```bash
  npm run server
  ```
- Open a second terminal for the frontend:
  ```bash
  npm run client
  ```

**Option B: Run from individual folders**
- **Start Backend**:
  ```bash
  cd server
  npm start
  # Server will run on http://localhost:5000
  ```
- **Start Frontend**:
  ```bash
  cd client
  npm run dev
  # Frontend will run on http://localhost:5173
  ```

---

## 🔑 Demo Credentials

When the server starts for the first time, it automatically seeds sample data and default user accounts:

| Role | Email | Password | Access |
|---|---|---|---|
| **Admin** | `admin@tournament.com` | `admin123` | Full access (Create tournaments, approve registrations, schedule matches, update scores) |
| **Team Captain / User** | `user@tournament.com` | `user123` | Register teams, browse tournaments, apply for competitions |

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Authenticate user & get token | Public |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Protected |
| `GET` | `/api/tournaments` | List all tournaments (with filters) | Protected |
| `POST` | `/api/tournaments` | Create a new tournament | Admin |
| `GET` | `/api/tournaments/:id` | Get tournament details | Protected |
| `GET` | `/api/teams` | List user teams | Protected |
| `POST` | `/api/teams` | Create a new team | Protected |
| `POST` | `/api/registrations` | Register team for a tournament | Protected |
| `GET` | `/api/registrations` | View all registrations | Admin |
| `PUT` | `/api/registrations/:id` | Approve/Reject registration | Admin |
| `GET` | `/api/matches` | Get matches list | Protected |
| `POST` | `/api/matches` | Schedule a new match | Admin |
| `PUT` | `/api/matches/:id` | Update scores & match winner | Admin |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
