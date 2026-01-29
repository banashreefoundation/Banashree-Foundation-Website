# 🚀 Banashree Foundation - Quick Start Guide

## For New Developers (Local Development)

### Prerequisites
- Docker & Docker Compose installed
- Git installed
- 5-10 minutes ⏱️

---

## 🏃 Quick Start (Development Mode)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/banashreefoundation/Banashree-Foundation-Website.git
cd Banashree-Foundation-Website
```

### 2️⃣ Start Development Environment
```bash
# Start all services in development mode with hot reload
docker-compose -f docker-compose.dev.yml up -d

# View logs (optional)
docker-compose -f docker-compose.dev.yml logs -f
```

### 3️⃣ Load Sample Data (First Time Only)
```bash
# Restore sample images and data
docker exec banashree-server-dev npm run backup:restore
```

### 4️⃣ Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4001
- **API Docs**: http://localhost:4001/api/v1/api-docs
- **MongoDB**: localhost:27017

### 5️⃣ Stop Development Environment
```bash
docker-compose -f docker-compose.dev.yml down
```

---

## 📝 Development Workflow

### Daily Development
```bash
# Start containers
docker-compose -f docker-compose.dev.yml up -d

# Your code changes will auto-reload! 🔥
# Edit files in client/ or server/ folders

# View logs if needed
docker-compose -f docker-compose.dev.yml logs -f banashree-client-dev
docker-compose -f docker-compose.dev.yml logs -f banashree-server-dev

# Stop when done
docker-compose -f docker-compose.dev.yml down
```

### Making Code Changes
- **Frontend**: Edit files in `client/src/` - changes auto-reload
- **Backend**: Edit files in `server/src/` - nodemon auto-restarts
- **Database**: Data persists in Docker volumes

### Install New Packages
```bash
# Frontend packages
cd client
npm install <package-name>

# Backend packages
cd server
npm install <package-name>

# Rebuild containers
docker-compose -f docker-compose.dev.yml up -d --build
```

---

## 🧪 Local Production Testing

Test the production build locally before deploying:

### 1️⃣ Build and Run Production Mode
```bash
# Stop dev environment first
docker-compose -f docker-compose.dev.yml down

# Start production build (without SSL)
docker-compose up -d --build

# Load sample data (first time only)
docker exec banashree-server npm run backup:restore
```

### 2️⃣ Access Production Build
- **Frontend**: http://localhost
- **Backend API**: http://localhost:4001

### 3️⃣ Stop
```bash
docker-compose down
```

---

## 🌐 Production Deployment

### Prerequisites
- VPS/Server with Docker installed
- Domain name configured
- SSL certificates (Let's Encrypt recommended)

### 1️⃣ Set Up SSL Certificates

#### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot

# Get SSL certificate
sudo certbot certonly --standalone -d banashreefoundation.org -d www.banashreefoundation.org

# Certificates will be in /etc/letsencrypt/live/banashreefoundation.org/
# Copy them to your project
sudo cp -r /etc/letsencrypt/live/banashreefoundation.org client/nginx/certs/live/
sudo cp -r /etc/letsencrypt/renewal client/nginx/certs/
```

See [SSL-CERTIFICATE-SETUP.md](./SSL-CERTIFICATE-SETUP.md) for detailed instructions.

### 2️⃣ Configure Environment Variables

Create a `.env.prod` file:
```bash
# Production Environment Variables
NODE_ENV=production
MONGO_URL=mongodb://mongodb:27017/banashree-foundation-db
JWT_KEY=your-super-secret-production-jwt-key-change-this
JWT_EXPIRES_IN=7d
PORT=4001
```

⚠️ **Important**: Change the JWT_KEY to a strong, unique secret!

### 3️⃣ Deploy to Production
```bash
# Clone on production server
git clone https://github.com/banashreefoundation/Banashree-Foundation-Website.git
cd Banashree-Foundation-Website

# Make sure SSL certs are in place
ls -la client/nginx/certs/live/banashreefoundation.org/

# Start production services
docker-compose -f docker-compose.prod.yml up -d --build

# Restore initial data (first time only)
docker exec banashree-server-prod npm run backup:restore
```

### 4️⃣ Access Production
- **Website**: https://banashreefoundation.org
- **API**: http://your-server-ip:4001

### 5️⃣ Update Production
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 🗂️ Docker Compose Files Explained

| File | Purpose | Use When | URL |
|------|---------|----------|-----|
| `docker-compose.dev.yml` | **Development** with hot reload | Daily development | http://localhost:5173 |
| `docker-compose.yml` | **Local production** testing (no SSL) | Testing builds locally | http://localhost |
| `docker-compose.local.yml` | Same as above (alternative) | Testing builds locally | http://localhost |
| `docker-compose.prod.yml` | **Production** deployment (with SSL) | Deploying to live server | https://yourdomain.com |

---

## 📊 Common Commands Reference

### Development
```bash
# Start dev environment
docker-compose -f docker-compose.dev.yml up -d

# Stop dev environment
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Rebuild after package changes
docker-compose -f docker-compose.dev.yml up -d --build

# Access container shell
docker exec -it banashree-server-dev sh
docker exec -it banashree-client-dev sh
```

### Production Testing
```bash
# Build and start
docker-compose up -d --build

# Stop
docker-compose down

# View logs
docker logs -f banashree-server
docker logs -f banashree-client
```

### Production Deployment
```bash
# Deploy
docker-compose -f docker-compose.prod.yml up -d --build

# Update
git pull && docker-compose -f docker-compose.prod.yml up -d --build

# Restart
docker-compose -f docker-compose.prod.yml restart

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Database & Backups
```bash
# Restore sample data
docker exec banashree-server npm run backup:restore

# Create backup
docker exec banashree-server npm run backup:create

# Access MongoDB
docker exec -it mongodb mongosh
```

### Cleanup
```bash
# Remove containers only
docker-compose down

# Remove containers and volumes (⚠️ deletes data!)
docker-compose down -v

# Clean up unused Docker resources
docker system prune -a
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5173 (dev frontend)
lsof -i :5173
kill -9 <PID>

# Find process using port 80 (prod frontend)
lsof -i :80
kill -9 <PID>
```

### SSL Certificate Error (Production)
```
nginx: [emerg] cannot load certificate
```
**Solution**: You're missing SSL certificates. Either:
1. Add certificates to `client/nginx/certs/live/`
2. Use `docker-compose.yml` instead of `docker-compose.prod.yml` for local testing

### Images Not Loading
```
404 Not Found - /src/assets/images/logo.png
```
**Solution**: See [IMAGE-LOADING-FIX.md](./IMAGE-LOADING-FIX.md) for details.
Images must be imported as ES modules in production builds.

### JWT Error
```
Error: secretOrPrivateKey must have a value
```
**Solution**: JWT_KEY is missing. It's now added to all docker-compose files.

### Database Connection Failed
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Changes Not Reflecting
**Development**: Should auto-reload. If not, restart containers.
**Production**: Must rebuild: `docker-compose up -d --build`

---

## 📁 Project Structure

```
.
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── assets/           # Images, fonts, icons
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── utils/            # Utilities
│   ├── nginx/
│   │   ├── nginx.conf        # Production (with SSL)
│   │   └── nginx-local.conf  # Local (without SSL)
│   ├── Dockerfile            # Production build
│   ├── Dockerfile.dev        # Development
│   └── Dockerfile.local      # Local production testing
│
├── server/                    # Backend (Node.js + Express)
│   ├── src/
│   │   ├── controllers/      # API controllers
│   │   ├── models/           # MongoDB models
│   │   ├── routes/           # API routes
│   │   └── middleware/       # Auth, etc.
│   ├── uploads/              # User uploaded files
│   ├── backups/              # Database backups
│   ├── Dockerfile            # Production build
│   └── Dockerfile.dev        # Development
│
├── docker-compose.dev.yml     # Development setup
├── docker-compose.yml         # Local production testing
├── docker-compose.local.yml   # Alternative local setup
├── docker-compose.prod.yml    # Production deployment
└── README.md                  # This file
```

---

## 🔐 Security Notes

### For Production:
1. ✅ Change `JWT_KEY` to a strong, unique secret
2. ✅ Use environment variables for sensitive data
3. ✅ Set up SSL certificates
4. ✅ Configure firewall to allow only ports 80, 443, and SSH
5. ✅ Keep Docker images updated
6. ✅ Don't commit `.env` files to git
7. ✅ Use strong MongoDB passwords in production

### Default Credentials:
- Check with your team for admin credentials
- Change default passwords after first login

---

## 📚 Additional Documentation

- [DOCKER-SETUP.md](./DOCKER-SETUP.md) - Detailed Docker configuration
- [IMAGE-LOADING-FIX.md](./IMAGE-LOADING-FIX.md) - Image import guide
- [SSL-CERTIFICATE-SETUP.md](./SSL-CERTIFICATE-SETUP.md) - SSL setup
- [IMAGE-BACKUP-GUIDE.md](./IMAGE-BACKUP-GUIDE.md) - Backup system
- [BACKUP-QUICK-START.md](./BACKUP-QUICK-START.md) - Quick backup reference

---

## 🆘 Getting Help

1. Check the documentation files listed above
2. Review logs: `docker-compose logs -f`
3. Check GitHub Issues
4. Contact the development team

---

## ✅ Quick Checklist

### New Developer Setup:
- [ ] Clone repository
- [ ] Run `docker-compose -f docker-compose.dev.yml up -d`
- [ ] Run `docker exec banashree-server-dev npm run backup:restore`
- [ ] Access http://localhost:5173
- [ ] Start coding!

### Before Deploying to Production:
- [ ] Test with `docker-compose up -d --build`
- [ ] Verify all images load correctly
- [ ] Test all API endpoints
- [ ] Set up SSL certificates
- [ ] Change JWT_KEY to production secret
- [ ] Configure domain DNS
- [ ] Set up automated backups
- [ ] Deploy with `docker-compose -f docker-compose.prod.yml up -d --build`

---

**Happy Coding! 🎉**
