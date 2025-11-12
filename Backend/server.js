require("dotenv").config();
const app = require("./app");
const resetMonthlyBudgets = require('./scripts/resetMonthlyBudgets');

const PORT = process.env.PORT;

resetMonthlyBudgets();

setInterval(resetMonthlyBudgets, 60 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
