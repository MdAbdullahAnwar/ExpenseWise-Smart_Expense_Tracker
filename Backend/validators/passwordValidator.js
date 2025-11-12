const { z } = require("zod");

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long")
});

module.exports = {
  forgotPasswordSchema,
  resetPasswordSchema
};
