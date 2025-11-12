const User = require("../models/user");

const transactionTracker = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of transactionTracker.entries()) {
    if (now > data.resetTime) {
      transactionTracker.delete(userId);
    }
  }
}, 60 * 60 * 1000);

exports.rateLimitTransactions = async (req, res, next) => {
  try {
    const userId = req.userId;
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPremium = user.isPremium;
    const limit = isPremium ? 50 : 5;

    let tracker = transactionTracker.get(userId);
    
    if (!tracker || now > tracker.resetTime) {
      tracker = {
        count: 0,
        resetTime: now + oneHour
      };
      transactionTracker.set(userId, tracker);
    }

    if (tracker.count >= limit) {
      const remainingTime = Math.ceil((tracker.resetTime - now) / 60000);
      return res.status(429).json({ 
        message: isPremium 
          ? `Rate limit exceeded. Maximum 50 transactions per hour. Please try again in ${remainingTime} minutes.`
          : `Rate limit exceeded. Free users can add 5 transactions per hour. Upgrade to Premium for unlimited transactions. Try again in ${remainingTime} minutes.`,
        isPremium,
        remainingTime
      });
    }

    tracker.count++;
    transactionTracker.set(userId, tracker);

    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
