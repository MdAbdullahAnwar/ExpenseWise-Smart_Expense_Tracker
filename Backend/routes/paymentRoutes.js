const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/user");
const Order = require("../models/order");
const authMiddleware = require("../middlewares/authMiddleware");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order (PENDING status)
router.post("/create-order", authMiddleware, async (req, res) => {
  try {
    const amount = 499; // ₹499 for premium
    const currency = "INR";

    const options = {
      amount: amount * 100, // paise
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Create order in DB with PENDING
    const order = await Order.create({
      id: razorpayOrder.id,
      amount,
      currency,
      status: "PENDING",
      razorpay_order_id: razorpayOrder.id,
      UserId: req.userId,
    });

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
      amount,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
});

// Verify Payment
router.post("/verify-payment", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      // Update order to SUCCESSFUL
      const order = await Order.findOne({ where: { razorpay_order_id } });
      if (order) {
        order.status = "SUCCESSFUL";
        order.razorpay_payment_id = razorpay_payment_id;
        order.razorpay_signature = razorpay_signature;
        await order.save();

        // Make user premium
        const user = await User.findByPk(req.userId);
        user.isPremium = true;
        await user.save();

        res.status(200).json({
          success: true,
          message: "Transaction successful",
          userInfo: {
            id: user.id,
            name: user.name,
            email: user.email,
            isPremium: true,
          },
        });
      } else {
        res.status(404).json({ success: false, message: "Order not found" });
      }
    } else {
      // Update to FAILED
      const order = await Order.findOne({ where: { razorpay_order_id } });
      if (order) {
        order.status = "FAILED";
        await order.save();
      }
      res.status(400).json({ success: false, message: "TRANSACTION FAILED" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "TRANSACTION FAILED" });
  }
});

// Handle failure/cancellation (update to FAILED)
router.post("/payment-failed", authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const order = await Order.findOne({ where: { razorpay_order_id } });
    if (order) {
      order.status = "FAILED";
      await order.save();
    }
    res.status(200).json({ success: true, message: "Order updated to FAILED" });
  } catch (error) {
    console.error("Failed update error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

module.exports = router;
