const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) 
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) 
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ 
      message: "Signup successful", 
      token,
      userId: user.id,
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        monthlyBudget: user.monthlyBudget
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ 
      message: "Login successful", 
      token, 
      userId: user.id,
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        isPremium: user.isPremium,
        monthlyBudget: user.monthlyBudget
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

// Update Budget
router.put("/budget", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { monthlyBudget } = req.body;

    if (monthlyBudget === undefined || monthlyBudget < 0) {
      return res.status(400).json({ message: "Invalid budget amount" });
    }

    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.monthlyBudget = monthlyBudget;
    await user.save();

    res.status(200).json({ 
      message: "Budget updated successfully",
      monthlyBudget: user.monthlyBudget
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
