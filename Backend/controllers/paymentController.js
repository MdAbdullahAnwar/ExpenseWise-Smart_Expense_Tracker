const paymentService = require("../services/paymentService");

exports.createOrder = async (req, res) => {
  try {
    const result = await paymentService.createOrder(req.userId);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const userInfo = await paymentService.verifyPayment(req.userId, req.body);
    res.status(200).json({
      success: true,
      message: "Transaction successful",
      userInfo,
    });
  } catch (error) {
    console.error("Verification error:", error);
    res.status(400).json({ success: false, message: "TRANSACTION FAILED" });
  }
};

exports.paymentFailed = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    await paymentService.updateOrderStatus(razorpay_order_id, "FAILED");
    res.status(200).json({ success: true, message: "Order updated to FAILED" });
  } catch (error) {
    console.error("Failed update error:", error);
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
