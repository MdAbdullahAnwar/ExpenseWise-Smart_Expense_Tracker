const sequelize = require("../config/database");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");

async function createTable() {
  try {
    await ForgotPasswordRequest.sync({ force: true });
    console.log("ForgotPasswordRequests table created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error creating table:", error);
    process.exit(1);
  }
}

createTable();