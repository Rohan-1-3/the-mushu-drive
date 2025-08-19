# The Mushu Drive - File Uploader

A full-stack file sharing and storage application built with React, Express.js, and PostgreSQL.

## 🚀 Quick Deploy

### Deploy to Railway (Recommended with GitHub Student Pack)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/Rohan-1-3/the-mushu-drive)

### Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Rohan-1-3/the-mushu-drive)

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

## 🌐 Deployment

### Method 1: Railway (GitHub Student Pack)

1. **Get Railway access through GitHub Student Pack**
   - Visit [education.github.com](https://education.github.com/pack)
   - Get verified as a student
   - Access Railway with $5/month credit

2. **Deploy with Railway**
   - Connect your GitHub account to Railway
   - Import this repository
   - Railway will automatically detect and deploy

3. **Set environment variables in Railway dashboard**
   - `DATABASE_URL` (Railway provides PostgreSQL)
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `NODE_ENV=production`

### Method 2: GitHub Actions + Railway

1. **Get Railway token**
   - Go to Railway dashboard
   - Generate a deployment token

2. **Add secrets to GitHub repository**
   - Go to repository Settings → Secrets
   - Add `RAILWAY_TOKEN` with your token

3. **Push to main/master branch**
   - GitHub Actions will automatically deploy

### Method 3: Docker Deployment

```bash
# Build and run with Docker
docker build -t mushu-drive .
docker run -p 3000:3000 --env-file .env mushu-drive
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

## 🔗 API Routes

Your file uploader includes these endpoints:

- `POST /upload` - Upload single file
- `POST /upload-multiple` - Upload multiple files
- `GET /m/:id` - Get file details
- `GET /m/:id/download` - Download file
- `PUT /m/:id` - Rename file
- `DELETE /m/:id` - Delete file

## 🎓 Student Benefits

With GitHub Student Pack, you get:
- Railway: $5/month hosting credit
- DigitalOcean: $200 credit
- Heroku: $13/month credit
- Namecheap: Free domain

## 📝 License

ISC License
