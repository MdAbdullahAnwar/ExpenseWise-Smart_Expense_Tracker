const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const { arcjetProtection } = require("../middlewares/arcjetMiddleware");

router.post("/add", authMiddleware, arcjetProtection, addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
