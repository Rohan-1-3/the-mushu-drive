# The Mushu Drive - File Uploader

A full-stack file sharing and storage application built with React, Express.js, and PostgreSQL.

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- GitHub Student Pack (for free hosting credits)

## 🛠️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rohan-1-3/the-mushu-drive.git
   cd the-mushu-drive
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example server/.env
   # Edit server/.env with your database and other settings
   ```

4. **Setup database**
   ```bash
   cd server
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

## 🔧 Environment Variables

Create these environment variables in your hosting platform:

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-here
SESSION_SECRET=your-session-secret
FRONTEND_URL=https://your-domain.com
```

## 📁 Project Structure

```
├── client/          # React frontend
├── server/          # Express.js backend
├── .github/         # GitHub Actions workflows
├── Dockerfile       # Container configuration
├── railway.yml      # Railway deployment config
└── package.json     # Root package configuration
```
