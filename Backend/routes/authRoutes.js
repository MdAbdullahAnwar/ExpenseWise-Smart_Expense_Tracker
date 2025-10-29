const express = require("express");
const router = express.Router();
const { signup, login, updateBudget } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/signup", signup);
router.post("/login", login);
router.put("/budget", authMiddleware, updateBudget);

module.exports = router;
