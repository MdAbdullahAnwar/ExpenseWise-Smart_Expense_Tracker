const { z } = require("zod");

const createBankAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100, "Account name must be less than 100 characters"),
  balance: z.coerce.number().min(0, "Negative balance is not possible").optional(),
  isDefault: z.coerce.boolean().optional(),
  isRecurring: z.coerce.boolean().optional(),
  recurringAmount: z.coerce.number().optional().nullable(),
  recurringDay: z.coerce.number().int().min(1, "Recurring day must be between 1 and 31").max(31, "Recurring day must be between 1 and 31").optional().nullable()
});

const updateBankAccountSchema = z.object({
  name: z.string().min(1, "Account name is required").max(100, "Account name must be less than 100 characters"),
  balance: z.coerce.number().min(0, "Negative balance is not possible"),
  isDefault: z.coerce.boolean(),
  isRecurring: z.coerce.boolean(),
  recurringAmount: z.coerce.number().nullable(),
  recurringDay: z.coerce.number().int().min(1, "Recurring day must be between 1 and 31").max(31, "Recurring day must be between 1 and 31").nullable()
}).partial();

module.exports = {
  createBankAccountSchema,
  updateBankAccountSchema
};
