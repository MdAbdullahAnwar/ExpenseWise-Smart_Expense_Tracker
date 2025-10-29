const expenseService = require("../services/expenseService");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;

    if (!amount || !description || !category)
      return res.status(400).json({ message: "All fields are required" });

    const expense = await expenseService.addExpense(req.userId, { amount, description, category });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getExpenses(req.userId);
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const expense = await expenseService.updateExpense(req.userId, req.params.id, { amount, description, category });
    res.status(200).json(expense);
  } catch (err) {
    console.error(err);
    const status = err.message === "Expense not found" ? 404 : err.message === "Not authorized" ? 403 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    await expenseService.deleteExpense(req.userId, req.params.id);
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error(err);
    const status = err.message === "Expense not found" ? 404 : err.message === "Not authorized" ? 403 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};
