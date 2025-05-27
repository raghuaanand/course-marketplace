# Course Marketplace

A scalable course marketplace application like Udemy where instructors can create and sell courses, and students can purchase, enroll, and consume content.

## Tech Stack

- **Frontend:** Next.js (App Router)
- **Backend:** Express.js (Node.js)
- **Database:** PostgreSQL (with Prisma ORM)
- **Queue:** Redis + BullMQ
- **Payment:** Stripe
- **Storage:** S3/Supabase/Cloudinary
- **Email:** Resend or NodeMailer

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

1. Clone the repository
2. Run `docker-compose up -d` to start PostgreSQL and Redis
3. Install dependencies in both frontend and backend directories
4. Set up environment variables
5. Run database migrations
6. Start development servers

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
