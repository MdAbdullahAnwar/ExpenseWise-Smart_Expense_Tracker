const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category, userId } = req.body;
    if (!amount || !description || !category || !userId) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const expense = await Expense.create({ amount, description, category, UserId: userId });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const { userId } = req.params;
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.destroy({ where: { id } });
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
