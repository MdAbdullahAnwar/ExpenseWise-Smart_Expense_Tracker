const authService = require("../services/authService");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) 
    return res.status(400).json({ message: "All fields are required" });

  try {
    const result = await authService.signup(name, email, password);
    res.status(201).json({ message: "Signup successful", ...result });
  } catch (err) {
    console.error(err);
    const status = err.message === "User already exists" ? 400 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password are required" });

  try {
    const result = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (err) {
    console.error(err);
    const status = err.message === "User not found" ? 404 : err.message === "Invalid password" ? 401 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.updateBudget = async (req, res) => {
  const { monthlyBudget } = req.body;

  if (monthlyBudget === undefined || monthlyBudget < 0) {
    return res.status(400).json({ message: "Invalid budget amount" });
  }

  try {
    const updatedBudget = await authService.updateBudget(req.userId, monthlyBudget);
    res.status(200).json({ 
      message: "Budget updated successfully",
      monthlyBudget: updatedBudget
    });
  } catch (err) {
    console.error(err);
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  const { name, email, phone, profilePhoto } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const updatedUser = await authService.updateProfile(req.userId, { name, email, phone, profilePhoto });
    res.status(200).json({ 
      message: "Profile updated successfully",
      userInfo: updatedUser
    });
  } catch (err) {
    console.error(err);
    const status = err.message === "User not found" ? 404 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};
