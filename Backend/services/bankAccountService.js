const BankAccount = require("../models/bankAccount");
const sequelize = require("../config/database");

exports.createBankAccount = async (userId, accountData) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, balance, isDefault, isRecurring, recurringAmount, recurringDay } = accountData;

    if (isDefault) {
      await BankAccount.update(
        { isDefault: false },
        { where: { UserId: userId }, transaction }
      );
    }

    const account = await BankAccount.create(
      { 
        name, 
        balance, 
        isDefault: isDefault || false, 
        isRecurring: isRecurring || false, 
        recurringAmount: isRecurring ? recurringAmount : null, 
        recurringDay: isRecurring ? recurringDay : null, 
        UserId: userId 
      },
      { transaction }
    );

    await transaction.commit();
    return account;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getBankAccounts = async (userId) => {
  return await BankAccount.findAll({ where: { UserId: userId } });
};

exports.updateBankAccount = async (userId, accountId, accountData) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, balance, isDefault, isRecurring, recurringAmount, recurringDay } = accountData;

    const account = await BankAccount.findOne({
      where: { id: accountId, UserId: userId },
      transaction,
    });

    if (!account) throw new Error("Bank account not found");

    if (isDefault && !account.isDefault) {
      await BankAccount.update(
        { isDefault: false },
        { where: { UserId: userId }, transaction }
      );
    }

    account.name = name;
    account.balance = balance;
    account.isDefault = isDefault;
    account.isRecurring = isRecurring || false;
    account.recurringAmount = recurringAmount || 0;
    account.recurringDay = recurringDay || 1;
    await account.save({ transaction });

    await transaction.commit();
    return account;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.deleteBankAccount = async (userId, accountId) => {
  const account = await BankAccount.findOne({
    where: { id: accountId, UserId: userId },
  });

  if (!account) throw new Error("Bank account not found");
  await account.destroy();
};

exports.getDefaultAccount = async (userId) => {
  return await BankAccount.findOne({
    where: { UserId: userId, isDefault: true },
  });
};
