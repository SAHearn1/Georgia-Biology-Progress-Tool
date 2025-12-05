# Georgia Biology Progress Tool

A comprehensive web application designed to help teachers prepare students for Biology EOC (End of Course) testing and predict individual student performance. Built with the RootWork Framework ecosystem.

## Features

- **Secure Authentication**: Teacher login with credentials using NextAuth.js
- **Class Management**: Create, edit, and manage biology classes with periods
- **Student Tracking**: Add and manage student information and records
- **Enrollment System**: Enroll students in classes and track enrollments
- **Clean UI**: Modern, responsive interface with RootWork branding
- **Database-Backed**: PostgreSQL database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Deployment**: Ready for Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/SAHearn1/Georgia-Biology-Progress-Tool.git
cd Georgia-Biology-Progress-Tool
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret key for NextAuth (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL`: Your application URL (http://localhost:3000 for local development)

4. Generate Prisma client and run migrations:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Register**: Create a new teacher account at `/register`
2. **Login**: Sign in with your credentials at `/login`
3. **Dashboard**: View overview of your classes, students, and enrollments
4. **Classes**: Create and manage your biology classes
5. **Students**: Add and manage student information
6. **Enrollments**: Enroll students in your classes

## Database Schema

- **User**: Teacher accounts with secure password storage
- **Class**: Biology classes owned by teachers
- **Student**: Student records with unique IDs
- **Enrollment**: Many-to-many relationship between students and classes

## Deployment

This application is configured for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

For database hosting, consider:
- Vercel Postgres
- Supabase
- Railway
- Neon

## Security

- Passwords are hashed using bcrypt
- Authentication with NextAuth.js and JWT sessions
- Protected API routes and pages
- SQL injection prevention with Prisma

## License

MIT License - see LICENSE file for details

## Contributing

This is an MVP (Minimum Viable Product). Future enhancements may include:
- LMS/SIS integrations
- Progress tracking and analytics
- EOC test predictions
- Student performance reports
- Parent portal access
