const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const { rateLimitTransactions } = require("../middlewares/rateLimiter");

router.post("/add", authMiddleware, rateLimitTransactions, addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
