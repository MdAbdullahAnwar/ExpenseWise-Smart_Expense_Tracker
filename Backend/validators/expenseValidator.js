const { z } = require("zod");

const addExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
  category: z.string().min(1, "Please select a category"),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
  expenseDate: z.string().optional(),
  BankAccountId: z.coerce.number().int().positive().optional().nullable(),
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Type must be either income or expense" }) }).optional(),
  isRecurring: z.coerce.boolean().optional(),
  recurringDay: z.coerce.number().int().min(1, "Recurring day must be between 1 and 31").max(31, "Recurring day must be between 1 and 31").optional().nullable()
});

const updateExpenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than zero").optional(),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters").optional(),
  category: z.string().min(1, "Please select a category").optional(),
  note: z.string().max(500, "Note must be less than 500 characters").optional(),
  expenseDate: z.string().optional(),
  BankAccountId: z.coerce.number().int().positive().optional().nullable(),
  type: z.enum(["income", "expense"], { errorMap: () => ({ message: "Type must be either income or expense" }) }).optional(),
  isRecurring: z.coerce.boolean().optional(),
  recurringDay: z.coerce.number().int().min(1, "Recurring day must be between 1 and 31").max(31, "Recurring day must be between 1 and 31").optional().nullable()
});

module.exports = {
  addExpenseSchema,
  updateExpenseSchema
};
