const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/passwordController");
const validate = require("../middlewares/validateRequest");
const { forgotPasswordSchema, resetPasswordSchema } = require("../validators/passwordValidator");

router.post("/forgotpassword", validate(forgotPasswordSchema), passwordController.forgotPassword);
router.post("/resetpassword/:id", validate(resetPasswordSchema), passwordController.resetPassword);

module.exports = router;
