# TeamFlow — Team Task Manager

A full-stack team task management platform with role-based access control, real-time dashboards, and a sleek dark UI.

![TeamFlow](https://img.shields.io/badge/TeamFlow-v1.0.0-10b981?style=flat-square)
![Node](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)

---

## ✨ Features

- **JWT Authentication** — Secure signup/login with access + refresh tokens
- **Role-Based Access Control** — Admin and Member roles with granular permissions
- **Project Management** — Create projects, set colors, due dates, and manage teams
- **Kanban Board** — Drag-free task board with 4 status columns (To Do → Done)
- **Task Tracking** — Priority levels, due dates, tags, assignees, and comments
- **Dashboard** — Live stats, task overview chart, upcoming deadlines, recent activity
- **Team Management** — View all members, promote/demote roles (Admin only)
- **Notifications** — In-app notifications for task assignments and project invites
- **Demo Accounts** — Pre-seeded admin + member accounts with sample data

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Zustand, Recharts |
| Backend | Node.js, Express.js |
| Database | PostgreSQL via `pg` (node-postgres, raw SQL) |
| Auth | JWT (access + refresh tokens) |
| Deployment | Railway |

---

## 🚀 Deploy to Railway

### Prerequisites
- [Railway account](https://railway.app)
- [Railway CLI](https://docs.railway.app/develop/cli) (optional but helpful)

### Step 1 — Create a new Railway project

1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Empty Project**

### Step 2 — Add PostgreSQL

1. In your project, click **+ New** → **Database** → **Add PostgreSQL**
2. Railway will provision a Postgres instance automatically

### Step 3 — Deploy the Backend

1. Click **+ New** → **GitHub Repo** → select your repo
2. Set the **Root Directory** to `team-task-manager/backend`
3. Add these **Environment Variables**:

```
DATABASE_URL          = (copy from PostgreSQL service → Variables → DATABASE_URL)
JWT_SECRET            = your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET    = your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN        = 15m
JWT_REFRESH_EXPIRES_IN = 7d
NODE_ENV              = production
FRONTEND_URL          = https://your-frontend.up.railway.app
PORT                  = 5000
```

4. Railway will auto-detect `railway.toml` and run:
   - `node src/db/migrate.js` (creates all tables + indexes)
   - `node src/db/seed.js` (seeds demo data)
   - `node src/index.js` (starts server)

### Step 4 — Deploy the Frontend

1. Click **+ New** → **GitHub Repo** → same repo
2. Set the **Root Directory** to `team-task-manager/frontend`
3. Add this **Environment Variable**:

```
VITE_API_URL = https://your-backend.up.railway.app/api
```

4. Railway will build with `npm run build` and serve the `dist/` folder

### Step 5 — Update CORS

Once both services are deployed, update the backend's `FRONTEND_URL` env var to your actual frontend Railway URL.

---

## 💻 Local Development

### Backend

```bash
cd team-task-manager/backend

# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env

# Run migrations (creates all tables)
npm run db:migrate

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

### Frontend

```bash
cd team-task-manager/frontend

# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api

# Start dev server
npm run dev
```

---

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Demo@1234 |
| Member | jordan@demo.com | Demo@1234 |
| Member | sam@demo.com | Demo@1234 |
| Member | taylor@demo.com | Demo@1234 |

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh access token |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Create project |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/projects/:id/members` | Add member |
| DELETE | `/api/projects/:id/members/:userId` | Remove member |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | List tasks (filterable) |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id/status` | Update status only |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/comments` | Add comment |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard` | Get dashboard stats |

---

## 🔐 Role Permissions

| Action | Admin | Member |
|--------|-------|--------|
| View all projects | ✅ | ❌ (own only) |
| Create project | ✅ | ✅ |
| Delete project | ✅ (owner/admin) | ❌ |
| Add/remove members | ✅ | ❌ |
| Create tasks | ✅ | ✅ (in own projects) |
| Delete tasks | ✅ | ✅ (own tasks) |
| Change user roles | ✅ | ❌ |

---

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── pool.js         # pg connection pool
│   │   │   ├── migrate.js      # SQL schema (CREATE TABLE)
│   │   │   └── seed.js         # Demo data seeder
│   │   ├── controllers/        # Route handlers (raw SQL)
│   │   ├── middleware/         # Auth, validation
│   │   ├── routes/             # Express routers
│   │   ├── utils/              # JWT helpers
│   │   └── index.js            # App entry point
│   ├── .env.example
│   ├── package.json
│   └── railway.toml
│
└── frontend/
    ├── src/
    │   ├── api/                # Axios API clients
    │   ├── components/         # Reusable UI components
    │   ├── context/            # Zustand stores
    │   ├── pages/              # Route pages
    │   └── main.jsx            # App entry point
    ├── .env.example
    ├── package.json
    └── railway.toml
```

---

## 🛡️ Security

- Passwords hashed with bcrypt (12 rounds)
- JWT access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Rate limiting on all API routes (200 req/15min)
- Stricter rate limiting on auth routes (20 req/15min)
- Helmet.js for HTTP security headers
- CORS restricted to frontend origin
- Input validation on all endpoints

---

Built with ❤️ for placement demo purposes.
