import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Pagination } from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { Download, Lock, Calendar, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import Toast from "../ui/toast";

const PremiumExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [activeFilter, setActiveFilter] = useState("daily");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const isPremium = useSelector((state) => state.user?.isPremium);
  const monthlyBudget = Number(useSelector((state) => state.user?.monthlyBudget) || 0);
  const token = localStorage.getItem("token");
  
  const pagination = usePagination(filteredExpenses, 5);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      filterExpenses(res.data, activeFilter);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to fetch expenses",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterExpenses = (expenseData, filter) => {
    const now = new Date();
    let filtered = [];

    switch (filter) {
      case "daily":
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        filtered = expenseData.filter(exp => {
          const expDate = new Date(exp.createdAt);
          return expDate >= today;
        });
        break;
      case "weekly":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        filtered = expenseData.filter(exp => {
          const expDate = new Date(exp.createdAt);
          return expDate >= weekStart;
        });
        break;
      case "monthly":
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = expenseData.filter(exp => {
          const expDate = new Date(exp.createdAt);
          return expDate >= monthStart;
        });
        break;
      default:
        filtered = expenseData;
    }

    setFilteredExpenses(filtered);
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    filterExpenses(expenses, filter);
  };

  const downloadExpenses = () => {
    if (!isPremium) {
      setToast({ message: "Premium feature: Upgrade to download expenses", type: "error" });
      return;
    }

    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <html>
        <head>
          <title>Expense Report - ${getFilterTitle()}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #f59e0b; text-align: center; }
            .summary { display: flex; justify-content: space-around; margin: 20px 0; }
            .summary-card { text-align: center; padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f59e0b; color: white; }
            .income { color: #10b981; }
            .expense { color: #ef4444; }
          </style>
        </head>
        <body>
          <h1>Premium Expense Report - ${getFilterTitle()}</h1>
          <div class="summary">
            <div class="summary-card">
              <h3>Monthly Budget</h3>
              <p>₹${monthlyBudget.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Remaining Budget</h3>
              <p>₹${(monthlyBudget - monthlyExpenses).toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>${getFilterTitle()} Expenses</h3>
              <p>₹${totalExpenses.toFixed(2)}</p>
            </div>
            <div class="summary-card">
              <h3>Transactions</h3>
              <p>${filteredExpenses.length}</p>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Category</th>
              </tr>
            </thead>
            <tbody>
              ${filteredExpenses.map(exp => `
                <tr>
                  <td>${new Date(exp.createdAt).toLocaleDateString()}</td>
                  <td class="${exp.category === 'Salary' ? 'income' : 'expense'}">
                    ${exp.category === 'Salary' ? '+' : '-'}₹${parseFloat(exp.amount).toFixed(2)}
                  </td>
                  <td>${exp.description}</td>
                  <td>${exp.category}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
    setToast({ message: "PDF download initiated!", type: "success" });
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalAmount = filteredExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const incomeExpenses = filteredExpenses.filter(exp => exp.category === "Salary");
  const totalIncome = incomeExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const actualExpenses = filteredExpenses.filter(exp => exp.category !== "Salary");
  const totalExpenses = actualExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  
  // Calculate monthly expenses for remaining budget
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.createdAt);
    return expDate >= monthStart && exp.category !== "Salary";
  }).reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);

  const categoryBreakdown = filteredExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || 0);
    return acc;
  }, {});

  const getFilterTitle = () => {
    switch (activeFilter) {
      case "daily": return "Today's";
      case "weekly": return "This Week's";
      case "monthly": return "This Month's";
      default: return "All";
    }
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-6">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-gray-600 mb-4">
              Upgrade to Premium to access detailed expense tracking with daily, weekly, and monthly views.
            </p>
            <Button className="bg-gradient-to-r from-amber-500 to-orange-600">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 md:p-8 pb-12 min-h-screen">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-card animate-fade-in border-border shadow-xl">
          <CardHeader className="bg-gradient-to-r from-amber-500/10 to-orange-500/10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                    Premium Expense Tracker
                  </CardTitle>
                </div>
                <p className="text-base ml-14 text-muted-foreground">
                  Advanced expense tracking with detailed insights
                </p>
              </div>
              <Button
                onClick={downloadExpenses}
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 cursor-pointer"
              >
                <Download className="w-4 h-4 mr-2" />
                Download {getFilterTitle()} Report
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Filter Buttons */}
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: "daily", label: "Daily", icon: Calendar },
                { key: "weekly", label: "Weekly", icon: TrendingUp },
                { key: "monthly", label: "Monthly", icon: BarChart3 }
              ].map(({ key, label, icon: Icon }) => (
                <Button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  variant={activeFilter === key ? "default" : "outline"}
                  className={`cursor-pointer ${
                    activeFilter === key 
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700" 
                      : ""
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
            <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-all"></div>
            <CardContent className="pt-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                ₹{monthlyBudget.toFixed(2)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Monthly Budget</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
            <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-all"></div>
            <CardContent className="pt-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <DollarSign className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                ₹{(monthlyBudget - monthlyExpenses).toFixed(2)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">Remaining Budget this Month</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-all"></div>
            <CardContent className="pt-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <TrendingDown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-1">
                ₹{totalExpenses.toFixed(2)}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{getFilterTitle()} Expenses</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
            <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-all"></div>
            <CardContent className="pt-6 relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-1">
                {filteredExpenses.length}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{getFilterTitle()} Transactions</p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="bg-card border-border shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {getFilterTitle()} Transactions ({filteredExpenses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b-2 border-border">
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">Date</th>
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">Amount</th>
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">Description</th>
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">Category</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pagination.currentItems.map((exp) => (
                      <tr key={exp.id} className="group hover:bg-accent transition-all duration-200">
                        <td className="py-4 px-6 text-sm text-muted-foreground">
                          {new Date(exp.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`text-lg font-bold ${
                            exp.category === "Salary" 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {exp.category === "Salary" ? "+" : "-"}₹{parseFloat(exp.amount).toFixed(2)}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium">{exp.description}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            exp.category === "Salary"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}>
                            {exp.category}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination {...pagination} />
              </div>
            ) : (
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-muted-foreground mb-2">
                  No transactions found
                </h3>
                <p className="text-muted-foreground">
                  No transactions found for the selected {activeFilter} period.
                </p>
              </div>
            )}
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
};

export default PremiumExpenseTracker;