const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const sequelize = require("./config/database");

const User = require("./models/user");  

const authRoutes = require("./routes/authRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/user", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Sync DB
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Database sync error:", err));

module.exports = app;
