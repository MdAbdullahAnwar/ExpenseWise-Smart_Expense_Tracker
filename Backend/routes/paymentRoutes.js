const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment, paymentFailed } = require("../controllers/paymentController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/create-order", authMiddleware, createOrder);
router.post("/verify-payment", authMiddleware, verifyPayment);
router.post("/payment-failed", authMiddleware, paymentFailed);

module.exports = router;
