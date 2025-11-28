const fs = require('fs');
const path = require('path');

// Load .env.local if exists (for local dev), otherwise load .env (for production)
const envLocalPath = path.resolve(__dirname, '.env.local');
const envPath = path.resolve(__dirname, '.env');

if (fs.existsSync(envLocalPath)) {
  require("dotenv").config({ path: envLocalPath });
  console.log('Loaded .env.local for local development');
} else {
  require("dotenv").config({ path: envPath });
  console.log('Loaded .env for production');
}
const app = require("./app");
const resetMonthlyBudgets = require('./scripts/resetMonthlyBudgets');
const cron = require('node-cron');
const emailReportService = require('./services/emailReportService');

const PORT = process.env.PORT;

resetMonthlyBudgets();

setInterval(resetMonthlyBudgets, 60 * 60 * 1000);

cron.schedule('0 9 1 * *', async () => {
  console.log('Running monthly email report job...');
  await emailReportService.sendAllMonthlyReports();
}, {
  timezone: "Asia/Kolkata"
});

console.log('Monthly email report cron job scheduled (1st of every month at 9 AM)');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
