const Expense = require("../models/expense");

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, category } = req.body;
    const userId = req.userId;

    if (!amount || !description || !category)
      return res.status(400).json({ message: "All fields are required" });

    const expense = await Expense.create({ amount, description, category, UserId: userId });
    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const userId = req.userId;
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    res.status(200).json(expenses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOne({ where: { id: req.params.id } });
    if (!expense) return res.status(404).json({ message: "Expense not found" });

    if (expense.UserId !== req.userId) return res.status(403).json({ message: "Not authorized" });

    await expense.destroy();
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
