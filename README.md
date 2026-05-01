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

