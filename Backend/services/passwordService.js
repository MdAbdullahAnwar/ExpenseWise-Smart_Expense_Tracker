const brevo = require("@getbrevo/brevo");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotPasswordRequest");
const sequelize = require("../config/database");

exports.sendPasswordResetEmail = async (email) => {
  const transaction = await sequelize.transaction();
  try {
    const user = await User.findOne({ where: { email }, transaction });
    
    if (!user) {
      throw new Error("User not found with this email");
    }

    const forgotPasswordRequest = await ForgotPasswordRequest.create(
      { UserId: user.id },
      { transaction }
    );

    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/password/resetpassword/${forgotPasswordRequest.id}`;

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Password Reset Request - ExpenseWise";
    sendSmtpEmail.to = [{ email: user.email }];
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for your ExpenseWise account.</p>
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(to right, #4F46E5, #7C3AED); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">Reset Password</a>
            </div>
            <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
            <p style="color: #4F46E5; word-break: break-all; font-size: 14px;">${resetUrl}</p>
            <p style="color: #666; font-size: 14px; margin-top: 30px;">This link can only be used once.</p>
            <p style="color: #666; font-size: 14px;">If you didn't make this request, you can safely ignore this email.</p>
            <p style="margin-top: 30px;">Best regards,<br/>ExpenseWise Team</p>
          </div>
        </body>
      </html>
    `;
    sendSmtpEmail.sender = { 
      name: "ExpenseWise", 
      email: process.env.BREVO_SENDER_EMAIL || "noreply@expensewise.com"
    };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.resetPassword = async (requestId, newPassword) => {
  const transaction = await sequelize.transaction();
  try {
    const forgotPasswordRequest = await ForgotPasswordRequest.findOne({
      where: { id: requestId },
      include: [User],
      transaction,
    });

    if (!forgotPasswordRequest) {
      throw new Error("Invalid reset link");
    }

    if (!forgotPasswordRequest.isActive) {
      throw new Error("This reset link has already been used");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    forgotPasswordRequest.User.password = hashedPassword;
    await forgotPasswordRequest.User.save({ transaction });

    forgotPasswordRequest.isActive = false;
    await forgotPasswordRequest.save({ transaction });

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
