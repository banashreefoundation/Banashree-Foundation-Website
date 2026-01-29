# 🎯 Banashree Foundation - Command Cheat Sheet

## 📋 Quick Reference

### 🟢 For Developers (Most Common)

```bash
# Start development (hot reload)
docker-compose -f docker-compose.dev.yml up -d

# Stop development
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Restart
docker-compose -f docker-compose.dev.yml restart
```

**Access**: http://localhost:5173 (Frontend) | http://localhost:4001 (Backend)

---

### 🔵 For Production Testing (Local)

```bash
# Build and start
docker-compose up -d --build

# Stop
docker-compose down

# View logs
docker logs -f banashree-client
docker logs -f banashree-server
```

**Access**: http://localhost (Frontend) | http://localhost:4001 (Backend)

---

### 🔴 For Production Deployment

```bash
# Deploy to production server
docker-compose -f docker-compose.prod.yml up -d --build

# Update production
git pull && docker-compose -f docker-compose.prod.yml up -d --build

# Stop production
docker-compose -f docker-compose.prod.yml down
```

**Access**: https://banashreefoundation.org

---

## 🗄️ Database & Data

```bash
# Restore sample data (first time)
docker exec banashree-server npm run backup:restore

# OR for dev environment
docker exec banashree-server-dev npm run backup:restore

# Create backup
docker exec banashree-server npm run backup:create

# Access MongoDB shell
docker exec -it mongodb mongosh
```

---

## 🐛 Troubleshooting

```bash
# View all containers
docker ps -a

# View project containers only
docker ps --filter "name=banashree"

# Remove everything and start fresh
docker-compose down -v
docker-compose up -d --build

# Check container logs
docker logs <container-name>

# Access container shell
docker exec -it <container-name> sh

# Kill process on port
lsof -i :<port>
kill -9 <PID>
```

---

## 🔄 Development Workflow

```bash
# 1. Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# 2. Load sample data (first time only)
docker exec banashree-server-dev npm run backup:restore

# 3. Code in your editor - changes auto-reload!

# 4. View logs if needed
docker-compose -f docker-compose.dev.yml logs -f

# 5. Done for the day
docker-compose -f docker-compose.dev.yml down
```

---

## 📦 Package Management

```bash
# Install frontend package
cd client && npm install <package-name>

# Install backend package  
cd server && npm install <package-name>

# Rebuild containers after package changes
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 🎨 Image Issues?

```bash
# If images not loading, rebuild
docker-compose down
docker-compose up -d --build

# Check image loading guide
cat IMAGE-LOADING-FIX.md
```

---

## 📊 Environment Summary

| Environment | File | Port | Hot Reload | SSL | Use For |
|-------------|------|------|------------|-----|---------|
| Development | `docker-compose.dev.yml` | 5173 | ✅ Yes | ❌ No | Daily coding |
| Local Prod | `docker-compose.yml` | 80 | ❌ No | ❌ No | Testing builds |
| Production | `docker-compose.prod.yml` | 80/443 | ❌ No | ✅ Yes | Live deployment |

---

## 🔑 Default Ports

| Service | Dev Port | Prod Port | URL |
|---------|----------|-----------|-----|
| Frontend | 5173 | 80/443 | http://localhost:5173 |
| Backend | 4001 | 4001 | http://localhost:4001 |
| MongoDB | 27017 | 27017 | mongodb://localhost:27017 |
| API Docs | 4001 | 4001 | http://localhost:4001/api/v1/api-docs |

---

## 💾 Docker Volumes

```bash
# List volumes for this project
docker volume ls | grep banashree

# Inspect volume
docker volume inspect <volume-name>

# Remove volumes (⚠️ deletes data!)
docker-compose down -v
```

---

## 🚨 Emergency Commands

```bash
# Stop all containers
docker stop $(docker ps -q)

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Nuclear option - clean everything
docker system prune -a --volumes
```

⚠️ **Warning**: These remove ALL Docker resources, not just this project!

---

## ✅ Health Checks

```bash
# Check if containers are running
docker ps --filter "name=banashree"

# Check logs for errors
docker logs banashree-server 2>&1 | tail -20
docker logs banashree-client 2>&1 | tail -20

# Test API
curl http://localhost:4001/api/v1/health

# Test frontend
curl http://localhost:5173  # dev
curl http://localhost       # prod
```

---

## 📖 Documentation Files

- `README.md` - Main overview
- `DEVELOPER-GUIDE.md` - Complete setup guide ⭐
- `DOCKER-SETUP.md` - Docker configurations
- `IMAGE-LOADING-FIX.md` - Image import fixes
- `SSL-CERTIFICATE-SETUP.md` - SSL setup
- `BACKUP-QUICK-START.md` - Backup commands

---

**Print this and keep it handy! 🖨️**
