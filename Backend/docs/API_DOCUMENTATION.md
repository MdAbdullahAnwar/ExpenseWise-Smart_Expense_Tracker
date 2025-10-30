# Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Routes

### POST /auth/signup
Create new user account
- **Body**: `{ name, email, password }`
- **Response**: `{ token, userId, userInfo }`

### POST /auth/login
Login existing user
- **Body**: `{ email, password }`
- **Response**: `{ token, userId, userInfo }`

### PUT /user/budget
Update monthly budget (Protected)
- **Body**: `{ monthlyBudget }`
- **Response**: `{ monthlyBudget }`

---

## Expense Routes

### POST /expense/add
Add new expense (Protected)
- **Body**: `{ amount, description, category }`
- **Response**: Expense object
- **Transaction**: Atomic with user totals update

### GET /expense
Get all user expenses (Protected)
- **Response**: Array of expenses

### PUT /expense/:id
Update expense (Protected)
- **Body**: `{ amount, description, category }`
- **Response**: Updated expense
- **Transaction**: Atomic with user totals recalculation

### DELETE /expense/:id
Delete expense (Protected)
- **Response**: `{ message: "Expense deleted" }`
- **Transaction**: Atomic with user totals update

---

## Payment Routes

### POST /payment/create-order
Create Razorpay order (Protected)
- **Response**: `{ order, key_id, amount }`
- **Transaction**: Creates order record atomically

### POST /payment/verify-payment
Verify payment and upgrade to premium (Protected)
- **Body**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- **Response**: `{ success, userInfo }`
- **Transaction**: Updates order and user premium status atomically

### POST /payment/payment-failed
Mark payment as failed (Protected)
- **Body**: `{ razorpay_order_id }`
- **Response**: `{ success, message }`

---

## Leaderboard Routes

### GET /leaderboard
Get expense leaderboard (Protected, Premium Only)
- **Response**: Array of users with rankings
