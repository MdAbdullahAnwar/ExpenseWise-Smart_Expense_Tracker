const authService = require("../services/authService");

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.signup(name, email, password);
    res.status(201).json({ message: "Signup successful", ...result });
  } catch (err) {
    console.error(err);
    const status = err.message === "User already exists" ? 400 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json({ message: "Login successful", ...result });
  } catch (err) {
    console.error(err);
    const status = err.message === "User not found" ? 404 : err.message === "Invalid password" ? 401 : 500;
    res.status(status).json({ message: err.message || "Server error" });
  }
};

exports.updateBudget = async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
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
  try {
    const { name, email, phone, profilePhoto } = req.body;
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
