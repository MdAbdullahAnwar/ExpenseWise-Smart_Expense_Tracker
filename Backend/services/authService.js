const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.signup = async (name, email, password) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return {
    token,
    userId: user.id,
    userInfo: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      monthlyBudget: user.monthlyBudget
    }
  };
};

exports.login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

  return {
    token,
    userId: user.id,
    userInfo: {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      monthlyBudget: user.monthlyBudget
    }
  };
};

exports.updateBudget = async (userId, monthlyBudget) => {
  const user = await User.findByPk(userId);
  if (!user) {
    throw new Error("User not found");
  }

  user.monthlyBudget = monthlyBudget;
  await user.save();

  return user.monthlyBudget;
};
