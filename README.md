# Course Marketplace

A scalable course marketplace application like Udemy where instructors can create and sell courses, and students can purchase, enroll, and consume content.

## Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (with Prisma ORM)
- **Queue:** Redis + BullMQ
- **Payment:** Stripe
- **Storage:** Cloudinary (Images, Videos, Documents)
- **Email:** Resend
- **Deployment:** Vercel (Frontend) + Railway (Backend)

## Project Structure

```
course_marketplace/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── shared/            # Shared utilities and types
├── docker-compose.yml # Development environment setup
└── README.md
```

## Getting Started

### Development
1. Clone the repository
2. Run `./setup.sh` to check prerequisites and install dependencies
3. Run `docker-compose up -d` to start PostgreSQL and Redis
4. Set up environment variables (see `.env.example` files)
5. Run database migrations: `cd backend && npx prisma migrate dev`
6. Start development servers:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

### Quick Deployment
- **Frontend**: Vercel (auto-deploys from GitHub)
- **Backend**: Railway (auto-deploys from GitHub)
- **Database**: PostgreSQL on Railway
- **Cache**: Redis on Railway

📖 See [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) for step-by-step deployment guide
📚 See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment information

## Features

- 🔐 Authentication & Authorization (Student, Instructor, Admin roles)
- 🎓 Course Management (Create, Edit, Delete courses)
- 🎥 Video Handling (Upload, Stream, Watermarking)
- 💳 Stripe Payments (Individual courses, Instructor payouts)
- 🛒 Enrollment & Progress Tracking
- 💬 Reviews, Q&A, Comments
- 🔎 Search & Filtering
- 📊 Admin Dashboard
- 📨 Background Jobs (Email, Certificates)
- 🔒 Security Best Practices

## Development

See individual README files in frontend and backend directories for specific setup instructions.
