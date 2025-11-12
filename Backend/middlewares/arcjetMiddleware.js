const arcjet = require("@arcjet/node").default;
const { detectBot, tokenBucket } = require("@arcjet/node");
const User = require("../models/user");

exports.arcjetProtection = async (req, res, next) => {
  try {
    const userId = req.userId.toString();
    
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPremium = user.isPremium;
    
    const aj = arcjet({
      key: process.env.ARCJET_KEY,
      rules: [
        detectBot({
          mode: "LIVE",
          deny: ["AUTOMATED"]
        }),
        tokenBucket({
          mode: "LIVE",
          refillRate: isPremium ? 50 : 5,
          interval: "1h",
          capacity: isPremium ? 50 : 5
        })
      ]
    });
    
    const decision = await aj.protect(req, { 
      requested: 1,
      userId,
      ip: req.ip || req.connection.remoteAddress || "127.0.0.1"
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const resetTime = decision.reason.resetTime;
        const remainingTime = resetTime ? Math.ceil((new Date(resetTime) - Date.now()) / 60000) : 60;
        
        return res.status(429).json({
          message: isPremium
            ? `Rate limit exceeded. Maximum 50 transactions per hour. Please try again in ${remainingTime} minutes.`
            : `Rate limit exceeded. Free users can add 5 transactions per hour. Upgrade to Premium for unlimited transactions. Try again in ${remainingTime} minutes.`,
          isPremium,
          remainingTime
        });
      }

      if (decision.reason.isBot()) {
        return res.status(403).json({
          message: "Bot detected. Access denied.",
          reason: "security"
        });
      }

      return res.status(403).json({
        message: "Access denied",
        reason: decision.reason
      });
    }

    next();
  } catch (error) {
    console.error("Arcjet protection error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
