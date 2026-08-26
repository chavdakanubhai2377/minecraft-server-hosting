# PG Host - System Architecture

## Overview

PG Host is a microservices-based architecture designed for scalability, reliability, and performance. The system consists of four main components:

1. **Frontend** - React/Next.js web application
2. **Backend API** - NestJS REST API server
3. **Daemon** - Server management daemon
4. **Infrastructure** - Docker, Nginx, PostgreSQL, Redis

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Browser                             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
┌─────────────────────▼────────────────────────────────────────┐
│                   Nginx Reverse Proxy                         │
│        (Load Balancing, SSL/TLS, Rate Limiting)              │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
   ┌────▼──────┐           ┌─────▼──────┐
   │  Frontend  │           │   Backend  │
   │ (Next.js)  │           │  (NestJS)  │
   └────┬───────┘           └─────┬──────┘
        │                         │
        │    WebSocket/HTTP       │
        └────────────┬────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
   ┌────▼──────────┐         ┌─────▼──────────┐
   │  PostgreSQL   │         │     Redis      │
   │   Database    │         │     Cache      │
   └───────────────┘         └────────────────┘

        │
        │ REST API
   ┌────▼──────────┐
   │    Daemon     │
   │ (Server Mgmt) │
   └────┬──────────┘
        │
        │ Docker API
   ┌────▼──────────────────────┐
   │   Docker Containers       │
   │  (Minecraft Servers)      │
   └───────────────────────────┘
```

## Component Details

### Frontend (React/Next.js)
- **Purpose**: User interface and dashboard
- **Key Features**:
  - Server management dashboard
  - Real-time console
  - File manager
  - Admin panel
  - User authentication
- **Technology**: React 18+, Next.js, Tailwind CSS
- **Performance**: SSR, SSG, Image optimization

### Backend API (NestJS)
- **Purpose**: Core business logic and API endpoints
- **Key Features**:
  - User authentication & authorization
  - Server management
  - File operations
  - Plugin/Mod management
  - Backup management
  - Notifications
  - Admin operations
- **Technology**: NestJS, TypeScript, PostgreSQL
- **API Type**: REST with WebSocket support

### Daemon (Server Management)
- **Purpose**: Isolated server management and Docker operations
- **Key Features**:
  - Docker container management
  - Minecraft JAR download & installation
  - Console I/O handling
  - Server resource monitoring
  - Backup operations
- **Technology**: NestJS, Docker API, Node.js
- **Communication**: REST API with Backend

### Infrastructure

#### PostgreSQL Database
- Primary data store
- Schema:
  - Users
  - Servers
  - Plugins/Mods
  - Backups
  - Console Logs
  - Audit Logs

#### Redis Cache
- Session management
- Rate limiting
- Real-time data (console logs)
- Job queue (BullMQ)

#### Nginx
- Reverse proxy
- Load balancing
- SSL/TLS termination
- Rate limiting
- Static file serving

#### Docker
- Container orchestration
- Server isolation
- Resource management

## Data Flow

### Server Creation
```
1. User submits form → Frontend
2. Frontend sends POST /servers → Backend API
3. Backend validates & creates DB record
4. Backend sends request → Daemon
5. Daemon creates Docker container
6. Daemon downloads Minecraft JAR
7. Daemon initializes server
8. Response returns to Frontend
9. User sees new server in dashboard
```

### Server Console
```
1. User opens console → Frontend connects WebSocket
2. Frontend → Backend WebSocket Gateway
3. Backend subscribes to server console stream
4. Backend → Daemon (get console feed)
5. Daemon reads Docker container stdout
6. Daemon streams to Backend
7. Backend broadcasts to Frontend
8. Frontend displays in real-time
```

## Scalability

### Horizontal Scaling
- **Backend**: Deploy multiple API instances behind load balancer
- **Daemon**: Deploy multiple daemons for server distribution
- **Database**: PostgreSQL replication for read scaling
- **Cache**: Redis cluster for high throughput

### Resource Management
- Each Minecraft server runs in isolated Docker container
- Resource limits per container (CPU, RAM, Disk)
- Automatic scaling based on load (optional)

## Security Architecture

### Authentication
- JWT tokens for API authentication
- HTTP-only cookies for session management
- 2FA support

### Authorization
- Role-based access control (RBAC)
- Resource ownership validation
- Admin panel with elevated privileges

### Network Security
- HTTPS/SSL everywhere
- Rate limiting on all endpoints
- CORS properly configured
- Input validation and sanitization
- SQL injection prevention
- XSS protection with Helmet.js

### Data Security
- Encrypted database connections
- Secure password hashing (bcrypt)
- API key management for webhooks
- Audit logging of admin actions

## Performance Optimization

### Caching Strategy
- Redis for session & user data
- Frontend static asset caching
- API response caching
- Database query optimization

### Database Optimization
- Indexed queries
- Connection pooling
- Efficient migrations

### Frontend Optimization
- Code splitting
- Image optimization
- Lazy loading
- Minification

## Deployment Architecture

### Development
- Docker Compose for local development
- Hot module reloading
- Local PostgreSQL & Redis

### Production
- Kubernetes for orchestration
- Docker containers for services
- Managed PostgreSQL (AWS RDS, etc.)
- Managed Redis (AWS ElastiCache, etc.)
- CDN for static assets
- Automated backups

## Monitoring & Logging

### Monitoring
- Prometheus for metrics collection
- Grafana for visualization
- Custom dashboards for:
  - Server health
  - Resource usage
  - API performance
  - Database metrics

### Logging
- Structured logging (JSON)
- ELK Stack for log aggregation
- Application logs
- Audit logs
- System logs

## High Availability

### Redundancy
- Multiple Backend instances
- Multiple Daemon instances
- Database replication
- Redis replication/clustering

### Failover
- Automatic health checks
- Service restart policies
- Database backup & recovery
- Automatic retry mechanisms

### Disaster Recovery
- Daily automated backups
- Server backups to S3 (optional)
- Database snapshots
- Recovery procedures documented
