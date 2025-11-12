const express = require("express");
const router = express.Router();
const bankAccountController = require("../controllers/bankAccountController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, bankAccountController.createBankAccount);
router.get("/", authMiddleware, bankAccountController.getBankAccounts);
router.put("/:id", authMiddleware, bankAccountController.updateBankAccount);
router.delete("/:id", authMiddleware, bankAccountController.deleteBankAccount);

module.exports = router;
