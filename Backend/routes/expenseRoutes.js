const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, deleteExpense } = require("../controllers/expenseController");

router.post("/add", addExpense);
router.get("/:userId", getExpenses);
router.delete("/:id", deleteExpense);

module.exports = router;
