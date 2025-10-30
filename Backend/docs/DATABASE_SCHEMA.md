# Database Schema

## Users Table
```sql
CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  isPremium BOOLEAN DEFAULT false,
  monthlyBudget DECIMAL(10,2) DEFAULT 0,
  totalExpenses DECIMAL(12,2) DEFAULT 0,
  totalTransactions INT DEFAULT 0,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## Expenses Table
```sql
CREATE TABLE Expenses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amount FLOAT NOT NULL,
  description VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  UserId INT NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);
```

## Orders Table
```sql
CREATE TABLE Orders (
  id VARCHAR(255) PRIMARY KEY,
  amount INT NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status ENUM('PENDING', 'SUCCESSFUL', 'FAILED') DEFAULT 'PENDING',
  razorpay_order_id VARCHAR(255),
  razorpay_payment_id VARCHAR(255),
  razorpay_signature VARCHAR(255),
  UserId INT NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);
```

## Relationships
- User hasMany Expenses (1:N)
- User hasMany Orders (1:N)
- Expense belongsTo User (N:1)
- Order belongsTo User (N:1)
