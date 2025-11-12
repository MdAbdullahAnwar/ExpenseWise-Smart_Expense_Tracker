const express = require("express");
const router = express.Router();
const { signup, login, updateBudget, updateProfile } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateRequest");
const { signupSchema, loginSchema, updateBudgetSchema, updateProfileSchema } = require("../validators/authValidator");

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.put("/budget", authMiddleware, validate(updateBudgetSchema), updateBudget);
router.put("/profile", authMiddleware, validate(updateProfileSchema), updateProfile);

module.exports = router;
