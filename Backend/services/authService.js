const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sequelize = require("../config/database");

exports.signup = async (name, email, password) => {
  const transaction = await sequelize.transaction();
  try {
    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword }, { transaction });

    await transaction.commit();
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return {
      token,
      userId: user.id,
      userInfo: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePhoto: user.profilePhoto,
        isPremium: user.isPremium,
        monthlyBudget: user.monthlyBudget
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
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
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      isPremium: user.isPremium,
      monthlyBudget: user.monthlyBudget
    }
  };
};

exports.updateBudget = async (userId, monthlyBudget) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error("User not found");
    }

    user.monthlyBudget = monthlyBudget;
    await user.save({ transaction });

    await transaction.commit();
    return user.monthlyBudget;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.updateProfile = async (userId, profileData) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      throw new Error("User not found");
    }

    user.name = profileData.name;
    user.email = profileData.email;
    if (profileData.phone !== undefined) user.phone = profileData.phone;
    if (profileData.profilePhoto !== undefined) user.profilePhoto = profileData.profilePhoto;
    
    await user.save({ transaction });
    await transaction.commit();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profilePhoto: user.profilePhoto,
      isPremium: user.isPremium,
      monthlyBudget: user.monthlyBudget
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
