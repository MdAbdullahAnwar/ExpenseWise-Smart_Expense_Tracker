const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/user");
const Order = require("../models/order");
const sequelize = require("../config/database");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (userId) => {
  const transaction = await sequelize.transaction();
  try {
    const amount = 499;
    const currency = "INR";

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    await Order.create({
      id: razorpayOrder.id,
      amount,
      currency,
      status: "PENDING",
      razorpay_order_id: razorpayOrder.id,
      UserId: userId,
    }, { transaction });

    await transaction.commit();
    return {
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
      amount,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.verifyPayment = async (userId, paymentData) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    await this.updateOrderStatus(razorpay_order_id, "FAILED");
    throw new Error("Invalid signature");
  }

  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findOne({ where: { razorpay_order_id }, transaction });
    if (!order) throw new Error("Order not found");

    order.status = "SUCCESSFUL";
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    await order.save({ transaction });

    const user = await User.findByPk(userId, { transaction });
    user.isPremium = true;
    await user.save({ transaction });

    await transaction.commit();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isPremium: true,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.updateOrderStatus = async (razorpay_order_id, status) => {
  const transaction = await sequelize.transaction();
  try {
    const order = await Order.findOne({ where: { razorpay_order_id }, transaction });
    if (order) {
      order.status = status;
      await order.save({ transaction });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
