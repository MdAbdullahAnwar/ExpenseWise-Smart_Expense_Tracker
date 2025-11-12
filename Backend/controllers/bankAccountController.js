const bankAccountService = require("../services/bankAccountService");

exports.createBankAccount = async (req, res) => {
  try {
    const account = await bankAccountService.createBankAccount(
      req.userId,
      req.body
    );
    res.status(201).json({ success: true, account });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getBankAccounts = async (req, res) => {
  try {
    const accounts = await bankAccountService.getBankAccounts(req.userId);
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateBankAccount = async (req, res) => {
  try {
    const account = await bankAccountService.updateBankAccount(
      req.userId,
      req.params.id,
      req.body
    );
    res.json({ success: true, account });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteBankAccount = async (req, res) => {
  try {
    await bankAccountService.deleteBankAccount(req.userId, req.params.id);
    res.json({ success: true, message: "Bank account deleted" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
