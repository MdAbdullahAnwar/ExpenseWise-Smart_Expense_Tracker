const express = require("express");
const router = express.Router();
const { addExpense, getExpenses, updateExpense, deleteExpense } = require("../controllers/expenseController");
const authMiddleware = require("../middlewares/authMiddleware");
const { arcjetProtection } = require("../middlewares/arcjetMiddleware");
const validate = require("../middlewares/validateRequest");
const { addExpenseSchema, updateExpenseSchema } = require("../validators/expenseValidator");

router.post("/add", authMiddleware, arcjetProtection, validate(addExpenseSchema), addExpense);
router.get("/", authMiddleware, getExpenses);
router.put("/:id", authMiddleware, validate(updateExpenseSchema), updateExpense);
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
