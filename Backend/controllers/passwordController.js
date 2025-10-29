const passwordService = require("../services/passwordService");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    await passwordService.sendPasswordResetEmail(email);
    res.status(200).json({ 
      success: true, 
      message: "Password reset link sent to your email" 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Failed to send reset email" 
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    await passwordService.resetPassword(id, password);
    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};
