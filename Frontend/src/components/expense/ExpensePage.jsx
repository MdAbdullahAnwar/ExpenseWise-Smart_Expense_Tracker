import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setMonthlyBudget } from "../../store/userSlice";
import { Target, Edit2, Save, X } from "lucide-react";
import Toast from "../ui/toast";

export default function ExpensePage() {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "",
    customCategory: "",
    note: "",
    expenseDate: new Date().toISOString().split('T')[0],
    BankAccountId: "",
    type: "expense",
    isRecurring: false,
    recurringDay: 1,
  });
  const [toast, setToast] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const monthlyBudget = useSelector((state) => state.user.monthlyBudget);

  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Rent",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  const incomeCategories = [
    "Salary",
    "Freelance",
    "Business",
    "Investment",
    "Gift",
    "Bonus",
    "Refund",
    "Other",
  ];

  const categories = form.type === 'income' ? incomeCategories : expenseCategories;

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
    fetchBankAccounts();
    setBudgetInput(monthlyBudget || 0);
  }, [monthlyBudget]);

  const fetchBankAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bank-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBankAccounts(res.data.accounts);
      const defaultAccount = res.data.accounts.find(acc => acc.isDefault);
      if (defaultAccount) {
        setForm(prev => ({ ...prev, BankAccountId: defaultAccount.id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const totalAmount = expenses
    .filter(exp => {
      const expDate = new Date(exp.expenseDate || exp.createdAt);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear && exp.type !== 'income';
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  
  const budgetPercentage = monthlyBudget > 0 ? (totalAmount / monthlyBudget) * 100 : 0;
  
  const getBudgetColor = () => {
    if (budgetPercentage >= 100) return { bg: 'bg-red-500', gradient: 'from-red-500 to-red-600', text: 'text-red-600' };
    if (budgetPercentage >= 80) return { bg: 'bg-orange-500', gradient: 'from-orange-500 to-red-500', text: 'text-orange-600' };
    if (budgetPercentage >= 60) return { bg: 'bg-yellow-500', gradient: 'from-yellow-500 to-orange-500', text: 'text-yellow-600' };
    return { bg: 'bg-green-500', gradient: 'from-green-500 to-emerald-600', text: 'text-green-600' };
  };
  
  const budgetColor = getBudgetColor();

  const handleBudgetUpdate = async () => {
    const budget = parseFloat(budgetInput) || 0;
    if (budget < 0) {
      setToast({ message: "Budget cannot be negative", type: "error" });
      return;
    }

    try {
      const budget = parseFloat(budgetInput) || 0;
      await axios.put(
        "http://localhost:5000/user/budget",
        { monthlyBudget: budget },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch(setMonthlyBudget(budget));
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      const updatedUserInfo = { ...userInfo, monthlyBudget: budget };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      setBudgetInput(budget);
      
      setToast({ message: "Budget updated successfully!", type: "success" });
      setIsEditingBudget(false);
    } catch (error) {
      console.error("Budget update error:", error);
      setToast({ 
        message: error.response?.data?.message || "Failed to update budget", 
        type: "error" 
      });
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      form.category === "Other" && form.customCategory
        ? form.customCategory
        : form.category;

    if (!form.amount || !form.description || !finalCategory) {
      setToast({ message: "Please fill all fields!", type: "error" });
      return;
    }

    const previousExpenses = [...expenses];
    try {
      const res = await axios.post(
        "http://localhost:5000/expense/add",
        {
          amount: form.amount,
          description: form.description,
          category: finalCategory,
          note: form.note,
          expenseDate: form.expenseDate,
          BankAccountId: form.BankAccountId || null,
          type: form.type,
          isRecurring: form.isRecurring,
          recurringDay: form.isRecurring ? form.recurringDay : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const defaultAccount = bankAccounts.find(acc => acc.isDefault);
      setForm({
        amount: "",
        description: "",
        category: "",
        customCategory: "",
        note: "",
        expenseDate: new Date().toISOString().split('T')[0],
        BankAccountId: defaultAccount?.id || "",
        type: "expense",
        isRecurring: false,
        recurringDay: 1,
      });
      setToast({ message: `${form.type === 'income' ? 'Income' : 'Expense'} added successfully!`, type: "success" });
      await fetchExpenses();
    } catch (err) {
      console.error(err);
      setExpenses(previousExpenses);
      
      if (err.response?.status === 429) {
        const message = err.response?.data?.message || "Rate limit exceeded";
        const remainingTime = err.response?.data?.remainingTime || 0;
        navigate(`/premium?rateLimitMessage=${encodeURIComponent(message)}&remainingTime=${remainingTime}`);
      } else {
        setToast({
          message: err.response?.data?.message || "Transaction failed. Please try again.",
          type: "error",
        });
      }
    }
  };

  return (
    <div className="bg-background p-4 md:p-8 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-500/5 dark:to-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-purple-500/10 to-pink-500/10 dark:from-purple-500/5 dark:to-pink-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-2xl mx-auto space-y-4 sm:space-y-6 mb-8">
        <Card className="bg-card animate-fade-in border-border shadow-xl">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br ${monthlyBudget > 0 ? budgetColor.gradient : 'from-gray-500 to-gray-600'} rounded-xl shadow-lg flex-shrink-0`}>
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-foreground">Monthly Budget</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{monthlyBudget > 0 ? 'Track your spending progress' : 'Set your budget to start tracking'}</p>
                </div>
              </div>
              {!isEditingBudget ? (
                <div className="flex items-center gap-2 sm:gap-3">
                  {monthlyBudget > 0 && (
                    <div className="text-right">
                      <p className={`text-xl sm:text-2xl font-bold bg-gradient-to-r ${budgetColor.gradient} bg-clip-text text-transparent`}>
                        {Math.min(budgetPercentage, 999).toFixed(0)}%
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">₹{totalAmount.toFixed(2)} / ₹{monthlyBudget}</p>
                    </div>
                  )}
                  <Button
                    onClick={() => setIsEditingBudget(true)}
                    size="sm"
                    variant="outline"
                    className="cursor-pointer flex-shrink-0"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Input
                    type="text"
                    value={budgetInput}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '' || /^\d*\.?\d*$/.test(val)) {
                        setBudgetInput(val === '' ? '' : val);
                      }
                    }}
                    onBlur={(e) => {
                      const val = e.target.value;
                      setBudgetInput(val === '' ? 0 : parseFloat(val) || 0);
                    }}
                    placeholder="0.00"
                    className="w-24 sm:w-32 flex-shrink-0"
                  />
                  <Button
                    onClick={handleBudgetUpdate}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 cursor-pointer flex-shrink-0"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditingBudget(false);
                      setBudgetInput(monthlyBudget || 0);
                    }}
                    size="sm"
                    variant="outline"
                    className="cursor-pointer flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
            {monthlyBudget > 0 && (
              <>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${budgetColor.gradient} rounded-full transition-all duration-500`}
                    style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                  />
                </div>
                {budgetPercentage >= 80 && (
                  <p className={`text-xs ${budgetColor.text} mt-2 font-medium`}>
                    {budgetPercentage >= 100 ? '⚠️ You have exceeded your budget!' : '⚠️ You are approaching your budget limit!'}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card animate-scale-in border-border shadow-xl">
          <CardHeader className="text-center bg-primary/5">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Add New Transaction
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Track your expenses and income
            </CardDescription>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label>Transaction Type</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'expense' })}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${
                      form.type === 'expense'
                        ? 'bg-red-500 text-white shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: 'income' })}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all cursor-pointer ${
                      form.type === 'income'
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">₹</span>
                  <Input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="pl-8"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="What did you spend on?"
                />
              </div>

              <div className="space-y-2">
                <Label>Category</Label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Choose a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {form.category === "Other" && (
                  <div className="mt-3 animate-fade-in">
                    <Label>Custom Category</Label>
                    <Input
                      type="text"
                      name="customCategory"
                      value={form.customCategory}
                      onChange={handleChange}
                      placeholder="Enter your custom category"
                      className="mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input
                  type="date"
                  name="expenseDate"
                  value={form.expenseDate}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {bankAccounts.length > 0 && (
                <div className="space-y-2">
                  <Label>Bank Account</Label>
                  <select
                    name="BankAccountId"
                    value={form.BankAccountId}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select account (optional)</option>
                    {bankAccounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - ₹{parseFloat(acc.balance).toFixed(2)}
                        {acc.isDefault ? " (Default)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Note (Optional)</Label>
                <Input
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  placeholder="Add a note or comment"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                <div className="space-y-0.5">
                  <Label htmlFor="isRecurring" className="text-base font-medium cursor-pointer">
                    Recurring Transaction
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Auto-add this {form.type} monthly
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={form.isRecurring}
                  onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
                  className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    form.isRecurring ? 'bg-blue-600' : 'bg-muted'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                      form.isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {form.isRecurring && (
                <div className="space-y-2 p-4 rounded-lg border border-border bg-accent/50 animate-fade-in">
                  <Label className="text-sm font-semibold">Repeat on Day of Month</Label>
                  <Input
                    type="number"
                    value={form.recurringDay}
                    onChange={(e) => setForm({ ...form, recurringDay: parseInt(e.target.value) || 1 })}
                    min="1"
                    max="28"
                    placeholder="1"
                    className="h-11"
                  />
                  <p className="text-xs text-muted-foreground font-medium">Day 1-28 of each month</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add {form.type === 'income' ? 'Income' : 'Expense'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/expense-list")}
                  className="flex-1 border-2 hover:bg-primary/10 transition-all duration-300 cursor-pointer"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View All Transactions
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
