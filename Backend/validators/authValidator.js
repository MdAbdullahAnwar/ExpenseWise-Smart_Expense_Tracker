const { z } = require("zod");

const signupSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

const updateBudgetSchema = z.object({
  monthlyBudget: z.coerce.number().min(0, "Budget cannot be negative")
});

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(20, "Phone number must be less than 20 characters").optional(),
  profilePhoto: z.string().optional()
});

module.exports = {
  signupSchema,
  loginSchema,
  updateBudgetSchema,
  updateProfileSchema
};
