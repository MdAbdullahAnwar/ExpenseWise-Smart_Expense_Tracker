const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, paymentFailed } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateRequest");
const { verifyPaymentSchema, paymentFailedSchema } = require("../validators/paymentValidator");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, validate(verifyPaymentSchema), verifyPayment);
router.post("/payment-failed", authMiddleware, validate(paymentFailedSchema), paymentFailed);

module.exports = router;
