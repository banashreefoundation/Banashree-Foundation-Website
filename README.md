# Banashree Foundation Digital Platform

## 🎯 Quick Start

### For Developers (Recommended)
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up -d

# Load sample data (first time only)
docker exec banashree-server-dev npm run backup:restore

# Access the app
# Frontend: http://localhost:5173
# Backend: http://localhost:4001
```

### For Production Testing
```bash
# Start production build locally
docker-compose up -d --build

# Load sample data (first time only)
docker exec banashree-server npm run backup:restore

# Access the app
# Frontend: http://localhost
# Backend: http://localhost:4001
```

---

## 📚 Complete Documentation

### Getting Started
- **[DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)** - 🔥 **START HERE** - Complete setup for developers and production
- **[NEW-DEVELOPER-START.md](./NEW-DEVELOPER-START.md)** - 30-second quick start

### Configuration & Setup
- **[DOCKER-SETUP.md](./DOCKER-SETUP.md)** - Docker environments explained (dev/local/prod)
- **[SSL-CERTIFICATE-SETUP.md](./SSL-CERTIFICATE-SETUP.md)** - Production SSL setup

### Troubleshooting
- **[IMAGE-LOADING-FIX.md](./IMAGE-LOADING-FIX.md)** - Fix image loading issues
- **[BACKUP-QUICK-START.md](./BACKUP-QUICK-START.md)** - Backup system reference
- **[IMAGE-BACKUP-GUIDE.md](./IMAGE-BACKUP-GUIDE.md)** - Complete backup documentation

---

## 🚀 Different Ways to Run

| Mode | Command | URL | Use Case |
|------|---------|-----|----------|
| **Development** | `docker-compose -f docker-compose.dev.yml up -d` | http://localhost:5173 | Daily development (hot reload) |
| **Local Testing** | `docker-compose up -d` | http://localhost | Test production builds locally |
| **Production** | `docker-compose -f docker-compose.prod.yml up -d` | https://yourdomain.com | Live deployment |

---

## 📖 API Documentation

Access Swagger API docs at: **http://localhost:4001/api/v1/api-docs**

---

## 🏗️ Project Structure

```
client/          # Frontend (React + Vite + TypeScript)
server/          # Backend (Node.js + Express + MongoDB)
docker-compose.dev.yml   # Development setup
docker-compose.yml       # Local production testing
docker-compose.prod.yml  # Production deployment
```

---

## 🆘 Common Issues

### Images Not Loading?
See [IMAGE-LOADING-FIX.md](./IMAGE-LOADING-FIX.md)

### SSL Certificate Error?
You're trying to use production config locally. Use:
```bash
docker-compose up -d  # instead of docker-compose.prod.yml
```

### Port Already in Use?
```bash
docker-compose down
# Or kill the process using the port
lsof -i :5173  # or :80, :4001
```

### Need Sample Data?
```bash
docker exec banashree-server npm run backup:restore
```

---

## 📞 Support

For detailed instructions, see **[DEVELOPER-GUIDE.md](./DEVELOPER-GUIDE.md)**
