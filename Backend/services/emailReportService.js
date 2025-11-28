const SibApiV3Sdk = require("@getbrevo/brevo");
const User = require("../models/user");
const Expense = require("../models/expense");
const geminiService = require("./geminiService");
const { Op } = require("sequelize");

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

exports.sendMonthlyReport = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (!user || !user.isPremium) return;

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const expenses = await Expense.findAll({
      where: {
        UserId: userId,
        expenseDate: {
          [Op.between]: [lastMonth, lastMonthEnd],
        },
      },
    });

    const income = expenses
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const expenseTotal = expenses
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + parseFloat(e.amount), 0);

    const categoryMap = {};
    expenses.filter(e => e.type === 'expense').forEach(e => {
      categoryMap[e.category] = (categoryMap[e.category] || 0) + parseFloat(e.amount);
    });

    const categoryBreakdown = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
      percentage: ((amount / expenseTotal) * 100).toFixed(1),
    }));

    const insights = await geminiService.generateFinancialInsights({
      income,
      expenses: expenseTotal,
      categoryBreakdown,
    });

    const monthName = lastMonth.toLocaleString('default', { month: 'long', year: 'numeric' });

    const htmlContent = `
      <h2>Monthly Financial Report - ${monthName}</h2>
      <h3>1. Monthly Income</h3>
      <p><strong>Total Income: ₹${income.toFixed(2)}</strong></p>
      
      <h3>2. Category-wise Spending</h3>
      <table border="1" cellpadding="10" style="border-collapse: collapse;">
        <tr><th>Category</th><th>Amount (₹)</th><th>Percentage</th></tr>
        ${categoryBreakdown.map(cat => 
          `<tr><td>${cat.category}</td><td>₹${cat.amount.toFixed(2)}</td><td>${cat.percentage}%</td>`
        ).join('')}
        <tr><td><strong>Total</strong></td><td><strong>₹${expenseTotal.toFixed(2)}</strong></td><td><strong>100%</strong></td></tr>
      </table>
      
      <h3>3. Financial Insights & Recommendations</h3>
      <p>${insights.replace(/\n/g, '<br>')}</p>
      
      <hr>
      <p><strong>Net Savings: ₹${(income - expenseTotal).toFixed(2)}</strong></p>
    `;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { email: process.env.BREVO_SENDER_EMAIL, name: "Expense Tracker" };
    sendSmtpEmail.to = [{ email: user.email, name: user.name }];
    sendSmtpEmail.subject = `Your Monthly Financial Report - ${monthName}`;
    sendSmtpEmail.htmlContent = htmlContent;

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Monthly report sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send report to user ${userId}:`, error);
  }
};

exports.sendAllMonthlyReports = async () => {
  try {
    const premiumUsers = await User.findAll({ where: { isPremium: true } });
    console.log(`Sending monthly reports to ${premiumUsers.length} premium users`);

    for (const user of premiumUsers) {
      await this.sendMonthlyReport(user.id);
    }
  } catch (error) {
    console.error("Failed to send monthly reports:", error);
  }
};
