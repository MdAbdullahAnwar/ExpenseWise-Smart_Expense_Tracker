const leaderboardService = require("../services/leaderboardService");
const User = require("../models/user");

exports.getLeaderboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user || !user.isPremium) {
      return res.status(403).json({ message: "Premium feature only" });
    }

    const leaderboard = await leaderboardService.getLeaderboard(req.userId);
    res.status(200).json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
