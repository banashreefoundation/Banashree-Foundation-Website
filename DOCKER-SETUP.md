# Docker Setup Guide

This project has three different Docker configurations for different environments:

## 📋 Available Configurations

### 1️⃣ **Development Mode** (Hot Reload)
**File**: `docker-compose.dev.yml`  
**Use for**: Active development with live code changes

```bash
docker-compose -f docker-compose.dev.yml up -d
```

**Features**:
- ✅ Hot reload for both client and server
- ✅ Source code mounted as volumes
- ✅ No SSL certificates needed
- ✅ Client runs on port 5173 (Vite dev server)
- ✅ Server runs on port 4001 (nodemon)

**Access**:
- Frontend: http://localhost:5173
- Backend: http://localhost:4001

---

### 2️⃣ **Local Production Testing** (No SSL)
**File**: `docker-compose.yml` OR `docker-compose.local.yml`  
**Use for**: Testing production builds locally without SSL

```bash
docker-compose up -d
# OR
docker-compose -f docker-compose.local.yml up -d
```

**Features**:
- ✅ Production builds (optimized)
- ✅ No SSL certificates needed
- ✅ Uses `nginx-local.conf` (HTTP only)
- ✅ Client runs on port 80
- ✅ Server runs on port 4001

**Access**:
- Frontend: http://localhost
- Backend: http://localhost:4001

**Dockerfiles Used**:
- Client: `Dockerfile.local` → `nginx-local.conf`
- Server: `Dockerfile`

---

### 3️⃣ **Production Deployment** (With SSL)
**File**: `docker-compose.prod.yml`  
**Use for**: Real production deployment with SSL certificates

```bash
docker-compose -f docker-compose.prod.yml up -d
```

**Features**:
- ✅ Production builds (optimized)
- ✅ SSL/HTTPS enabled
- ✅ Uses `nginx.conf` (with SSL)
- ✅ Requires SSL certificates in `client/nginx/certs/`
- ✅ Auto-restart on failure

**Access**:
- Frontend: https://banashreefoundation.org
- Backend: http://localhost:4001

**Dockerfiles Used**:
- Client: `Dockerfile` → `nginx.conf`
- Server: `Dockerfile`

**Prerequisites**:
- SSL certificates must be present in `client/nginx/certs/live/banashreefoundation.org/`
- See [SSL-CERTIFICATE-SETUP.md](./SSL-CERTIFICATE-SETUP.md) for setup instructions

---

## 🗂️ File Structure

```
.
├── docker-compose.yml           # Local production testing (default)
├── docker-compose.dev.yml       # Development with hot reload
├── docker-compose.local.yml     # Local production testing (alternative)
├── docker-compose.prod.yml      # Production deployment
│
├── client/
│   ├── Dockerfile               # Production build WITH SSL
│   ├── Dockerfile.dev           # Development mode
│   ├── Dockerfile.local         # Production build WITHOUT SSL
│   └── nginx/
│       ├── nginx.conf           # Production config (HTTPS/SSL)
│       └── nginx-local.conf     # Local config (HTTP only)
│
└── server/
    ├── Dockerfile               # Production build
    └── Dockerfile.dev           # Development mode
```

---

## 🔄 Quick Commands

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop
docker-compose -f docker-compose.dev.yml down
```

### Local Testing
```bash
# Start local production build
docker-compose up -d

# Rebuild after code changes
docker-compose up -d --build

# Stop
docker-compose down
```

### Production
```bash
# Deploy to production
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

---

## ⚠️ Important Notes

1. **Never use production config without SSL certificates** - nginx will fail to start
2. **Default `docker-compose up`** uses local config (no SSL needed)
3. **For production**, always use `docker-compose.prod.yml`
4. **SSL certificates** should be in `.gitignore` (never commit them)

---

## 🆘 Troubleshooting

### SSL Certificate Error
```
nginx: [emerg] cannot load certificate
```
**Solution**: You're using production config locally. Use `docker-compose.yml` instead of `docker-compose.prod.yml`

### Port Already in Use
```
Error: bind: address already in use
```
**Solution**: Stop other Docker containers or change ports in docker-compose file

### Changes Not Reflecting
**Development**: Should auto-reload (if not, restart containers)  
**Production**: Rebuild with `docker-compose up -d --build`
