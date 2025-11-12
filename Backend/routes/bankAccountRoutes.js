const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccountController");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validateRequest");
const { createBankAccountSchema, updateBankAccountSchema } = require("../validators/bankAccountValidator");

router.post("/", authMiddleware, validate(createBankAccountSchema), bankAccountController.createBankAccount);
router.get("/", authMiddleware, bankAccountController.getBankAccounts);
router.put("/:id", authMiddleware, validate(updateBankAccountSchema), bankAccountController.updateBankAccount);
router.delete("/:id", authMiddleware, bankAccountController.deleteBankAccount);

module.exports = router;
