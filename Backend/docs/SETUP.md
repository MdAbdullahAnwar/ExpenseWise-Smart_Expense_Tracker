# Backend Setup Guide

## Prerequisites
- Node.js (v14+)
- MySQL (v8+)
- npm or yarn

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Variables**
Create `.env` file:
```env
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=your_password
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
PORT=5000
```

3. **Database Setup**
```bash
# Create database
mysql -u root -p
CREATE DATABASE expense_tracker;
```

4. **Run Server**
```bash
npm start
```

## Project Structure
```
Backend/
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middlewares/     # Auth middleware
├── models/          # Sequelize models
├── routes/          # API routes
├── services/        # Business logic
├── docs/            # Documentation
├── app.js           # Express app
└── server.js        # Server entry
```

## Key Features
- ✅ JWT Authentication
- ✅ Database Transactions
- ✅ Razorpay Integration
- ✅ RESTful API
- ✅ Error Handling
