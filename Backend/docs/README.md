# Expense Tracker Backend

A robust Node.js/Express backend API for managing personal expenses with user authentication, premium features, and comprehensive expense tracking.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment**: Razorpay Integration
- **Email**: Nodemailer with Brevo SMTP

## Features

- User authentication (signup/login)
- JWT-based authorization
- Expense CRUD operations
- Premium membership with Razorpay
- Password reset via email
- Leaderboard for premium users
- Budget tracking
- Profile management with photo upload
- Transaction-based operations for data consistency

## Project Structure

```
Backend/
├── config/          # Database and app configuration
├── controllers/     # Request handlers
├── services/        # Business logic
├── models/          # Sequelize models
├── routes/          # API routes
├── middlewares/     # Auth and validation middleware
├── migrations/      # Database migrations
├── scripts/         # Utility scripts
└── docs/           # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables (see SETUP.md)

3. Run migrations:
```bash
npx sequelize-cli db:migrate
```

4. Start server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed endpoint information.

## Database Schema

See [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) for table structures and relationships.

## Documentation Index

- [Setup Guide](./SETUP.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [Architecture](./FINAL_STRUCTURE.md)
- [Transaction Implementation](./TRANSACTION_IMPLEMENTATION.md)

## Environment Variables

Required environment variables:
- `JWT_SECRET` - Secret key for JWT tokens
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `DB_HOST` - Database host
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret
- `BREVO_API_KEY` - Email service API key

## License

MIT
