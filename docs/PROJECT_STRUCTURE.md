# PG Host - Project Structure

Complete breakdown of the project organization and component responsibilities.

## Root Level Structure

```
minecraft-server-hosting/
├── frontend/                    # Next.js React frontend
├── backend/                     # NestJS backend API
├── daemon/                      # Server management daemon
├── docker-compose.yml          # Docker orchestration
├── nginx/                       # Nginx configuration
├── kubernetes/                 # Kubernetes manifests
├── monitoring/                 # Prometheus & Grafana configs
├── docs/                       # Project documentation
├── .gitignore
├── .env.example
└── README.md
```

## Backend Structure (NestJS)

```
backend/
├── src/
│   ├── auth/                    # Authentication & Authorization
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── jwt.strategy.ts
│   │   ├── jwt.guard.ts
│   │   ├── auth.module.ts
│   │   └── dtos/
│   │
│   ├── users/                   # User Management
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── entities/
│   │   │   └── user.entity.ts
│   │   └── dtos/
│   │
│   ├── servers/                 # Server Management
│   │   ├── servers.controller.ts
│   │   ├── servers.service.ts
│   │   ├── servers.module.ts
│   │   ├── entities/
│   │   │   └── server.entity.ts
│   │   └── dtos/
│   │
│   ├── console/                 # Live Console
│   │   ├── console.gateway.ts
│   │   ├── console.service.ts
│   │   └── console.module.ts
│   │
│   ├── files/                   # File Management
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   ├── files.module.ts
│   │   ├── entities/
│   │   └── dtos/
│   │
│   ├── plugins/                 # Plugin Management
│   │   ├── plugins.controller.ts
│   │   ├── plugins.service.ts
│   │   ├── plugins.module.ts
│   │   └── dtos/
│   │
│   ├── mods/                    # Mod Management
│   │   ├── mods.controller.ts
│   │   ├── mods.service.ts
│   │   ├── mods.module.ts
│   │   └── dtos/
│   │
│   ├── backups/                 # Backup Management
│   │   ├── backups.controller.ts
│   │   ├── backups.service.ts
│   │   ├── backups.module.ts
│   │   ├── entities/
│   │   └── dtos/
│   │
│   ├── scheduler/               # Task Scheduling
│   │   ├── scheduler.service.ts
│   │   ├── scheduler.module.ts
│   │   └── jobs/
│   │
│   ├── admin/                   # Admin Panel
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── admin.module.ts
│   │   └── dtos/
│   │
│   ├── notifications/           # Notifications
│   │   ├── notifications.service.ts
│   │   ├── notifications.module.ts
│   │   ├── email/
│   │   └── discord/
│   │
│   ├── common/                  # Shared Utilities
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   ├── pipes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── constants/
│   │
│   ├── database/                # Database Configuration
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── config.ts
│   │
│   ├── config/                  # App Configuration
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   └── app.config.ts
│   │
│   ├── app.module.ts           # Root Module
│   └── main.ts                 # Entry Point
│
├── test/                       # Tests
│   ├── auth.spec.ts
│   ├── users.spec.ts
│   └── servers.spec.ts
│
├── Dockerfile
├── .dockerignore
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Frontend Structure (Next.js)

```
frontend/
├── public/                      # Static assets
│   ├── images/
│   ├── icons/
│   └── favicons/
│
├── pages/                       # Page components
│   ├── index.tsx               # Landing page
│   ├── dashboard/
│   │   ├── index.tsx           # Dashboard home
│   │   ├── servers/
│   │   │   ├── index.tsx
│   │   │   ├── [id]/
│   │   │   │   ├── index.tsx   # Server detail
│   │   │   │   ├── console.tsx
│   │   │   │   ├── files.tsx
│   │   │   │   ├── plugins.tsx
│   │   │   │   ├── mods.tsx
│   │   │   │   ├── worlds.tsx
│   │   │   │   ├── players.tsx
│   │   │   │   ├── backups.tsx
│   │   │   │   └── settings.tsx
│   │   │   └── new.tsx
│   │   └── settings/
│   │       └── index.tsx
│   ├── auth/
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── reset-password.tsx
│   ├── admin/
│   │   ├── index.tsx
│   │   ├── users.tsx
│   │   ├── servers.tsx
│   │   ├── logs.tsx
│   │   └── settings.tsx
│   ├── api/                    # API routes
│   │   ├── auth/
│   │   ├── servers/
│   │   └── webhooks/
│   └── _app.tsx
│   └── _document.tsx
│
├── components/                 # Reusable components
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Layout.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── ProtectedRoute.tsx
│   ├── servers/
│   │   ├── ServerCard.tsx
│   │   ├── ServerList.tsx
│   │   ├── ServerStatus.tsx
│   │   └── CreateServerModal.tsx
│   ├── console/
│   │   ├── Console.tsx
│   │   ├── ConsoleLogs.tsx
│   │   └── CommandInput.tsx
│   ├── files/
│   │   ├── FileManager.tsx
│   │   ├── FileList.tsx
│   │   └── FileUploader.tsx
│   ├── plugins/
│   │   ├── PluginList.tsx
│   │   ├── PluginCard.tsx
│   │   └── PluginInstaller.tsx
│   ├── dashboard/
│   │   ├── StatCard.tsx
│   │   ├── ResourceChart.tsx
│   │   └── ActivityFeed.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── Input.tsx
│   │   ├── Loading.tsx
│   │   ├── Error.tsx
│   │   └── Toast.tsx
│   └── admin/
│       ├── UserManagement.tsx
│       ├── SystemStats.tsx
│       └── SettingsPanel.tsx
│
├── styles/                     # Tailwind styles
│   ├── globals.css
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── utils/                      # Utility functions
│   ├── api.ts                  # API client
│   ├── auth.ts                 # Auth helpers
│   ├── formatters.ts           # Data formatters
│   ├── validators.ts           # Form validators
│   └── constants.ts
│
├── hooks/                      # Custom React hooks
│   ├── useAuth.ts
│   ├── useServer.ts
│   ├── useWebSocket.ts
│   └── useFetch.ts
│
├── types/                      # TypeScript types
│   ├── index.ts
│   ├── user.ts
│   ├── server.ts
│   ├── api.ts
│   └── common.ts
│
├── context/                    # React Context
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
│
├── Dockerfile
├── .dockerignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Daemon Structure

```
daemon/
├── src/
│   ├── server/                 # Server operations
│   │   ├── server.controller.ts
│   │   ├── server.service.ts
│   │   └── server.module.ts
│   │
│   ├── docker/                 # Docker integration
│   │   ├── docker.service.ts
│   │   ├── docker.module.ts
│   │   └── types.ts
│   │
│   ├── minecraft/              # Minecraft-specific
│   │   ├── minecraft.service.ts
│   │   ├── minecraft.module.ts
│   │   ├── versions.ts
│   │   └── jar-manager.ts
│   │
│   ├── console/                # Console output
│   │   ├── console.gateway.ts
│   │   └── console.module.ts
│   │
│   ├── backups/                # Backup operations
│   │   ├── backup.service.ts
│   │   └── backup.module.ts
│   │
│   ├── monitoring/             # Performance monitoring
│   │   ├── monitor.service.ts
│   │   └── monitor.module.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── Dockerfile
├── package.json
└── tsconfig.json
```

## Documentation Structure

```
docs/
├── PROJECT_STRUCTURE.md        # This file
├── ARCHITECTURE.md             # System architecture
├── BACKEND_SETUP.md           # Backend setup guide
├── FRONTEND_SETUP.md          # Frontend setup guide
├── API.md                     # API documentation
├── DATABASE.md                # Database schema
├── DEPLOYMENT.md              # Deployment guide
├── SECURITY.md                # Security guidelines
├── MONITORING.md              # Monitoring setup
└── CONTRIBUTING.md            # Contributing guidelines
```

## Key Directory Functions

| Directory | Purpose |
|-----------|--------|
| `frontend` | React/Next.js user interface |
| `backend` | NestJS API server |
| `daemon` | Server management operations |
| `docs` | Project documentation |
| `monitoring` | Prometheus & Grafana configs |

## Database Schema

Key tables:
- `users` - User accounts
- `servers` - Minecraft servers
- `plugins` - Installed plugins
- `mods` - Installed mods
- `backups` - Server backups
- `console_logs` - Console output logs
- `audit_logs` - Admin actions

See `docs/DATABASE.md` for full schema.
