import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Pagination } from "../ui/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Download, Lock, Edit2, Save, X, Trash2, Target, Search } from "lucide-react";
import Toast from "../ui/toast";

const BudgetCard = ({ totalAmount }) => {
  const monthlyBudget = useSelector((state) => state.user.monthlyBudget);
  const budgetPercentage =
    monthlyBudget > 0 ? (totalAmount / monthlyBudget) * 100 : 0;

  const getBudgetColor = () => {
    if (budgetPercentage >= 100)
      return {
        bg: "bg-red-500",
        gradient: "from-red-500 to-red-600",
        text: "text-red-600",
      };
    if (budgetPercentage >= 80)
      return {
        bg: "bg-orange-500",
        gradient: "from-orange-500 to-red-500",
        text: "text-orange-600",
      };
    if (budgetPercentage >= 60)
      return {
        bg: "bg-yellow-500",
        gradient: "from-yellow-500 to-orange-500",
        text: "text-yellow-600",
      };
    return {
      bg: "bg-green-500",
      gradient: "from-green-500 to-emerald-600",
      text: "text-green-600",
    };
  };

  const budgetColor = getBudgetColor();

  return (
    <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <div
        className={`absolute inset-0 ${budgetColor.bg}/5 group-hover:${budgetColor.bg}/10 transition-all`}
      ></div>
      <CardContent className="pt-6 relative">
        <div
          className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${budgetColor.gradient} rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}
        >
          <Target className="w-8 h-8 text-white" />
        </div>
        <h3
          className={`text-3xl font-bold bg-gradient-to-r ${budgetColor.gradient} bg-clip-text text-transparent mb-1`}
        >
          {monthlyBudget > 0
            ? `${Math.min(budgetPercentage, 999).toFixed(0)}%`
            : "N/A"}
        </h3>
        <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
        {monthlyBudget > 0 && (
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹{totalAmount.toFixed(2)}</span>
              <span>₹{monthlyBudget}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${budgetColor.gradient} rounded-full transition-all duration-500`}
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const navigate = useNavigate();
  const isPremium = useSelector((state) => state.user.isPremium);

  const pagination = usePagination(filteredExpenses, 10, 'expense-list-per-page');

  const token = localStorage.getItem("token");

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Rent",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Salary",
    "Other",
  ];

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      setFilteredExpenses(res.data);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to fetch expenses",
        type: "error",
      });
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredExpenses(expenses);
    } else {
      const filtered = expenses.filter(exp => 
        exp.description.toLowerCase().includes(term.toLowerCase()) ||
        exp.category.toLowerCase().includes(term.toLowerCase()) ||
        exp.amount.toString().includes(term)
      );
      setFilteredExpenses(filtered);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    const previousExpenses = [...expenses];
    const optimisticExpenses = expenses.filter((exp) => exp.id !== id);
    setExpenses(optimisticExpenses);
    handleSearch(searchTerm);

    try {
      await axios.delete(`http://localhost:5000/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: "Expense deleted!", type: "success" });
    } catch (err) {
      console.error(err);
      setExpenses(previousExpenses);
      setToast({
        message:
          err.response?.data?.message ||
          "Transaction failed. Expense not deleted.",
        type: "error",
      });
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setEditForm({
      amount: exp.amount,
      description: exp.description,
      category: exp.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSaveEdit = async (id) => {
    if (!editForm.amount || !editForm.description || !editForm.category) {
      setToast({ message: "All fields are required", type: "error" });
      return;
    }

    const previousExpenses = [...expenses];
    const optimisticExpenses = expenses.map((exp) =>
      exp.id === id ? { ...exp, ...editForm } : exp
    );
    setExpenses(optimisticExpenses);
    handleSearch(searchTerm);

    try {
      await axios.put(`http://localhost:5000/expense/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEditingId(null);
      setEditForm({});
      setToast({ message: "Expense updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setExpenses(previousExpenses);
      setToast({
        message:
          err.response?.data?.message ||
          "Transaction failed. Changes reverted.",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const downloadCSV = () => {
    if (!isPremium) {
      setToast({
        message: "Premium feature: Upgrade to download CSV",
        type: "error",
      });
      return;
    }

    const headers = ["Date", "Amount", "Description", "Category"];
    const csvData = expenses.map((exp) => [
      new Date(exp.createdAt).toLocaleDateString(),
      exp.amount,
      exp.description,
      exp.category,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `expenses_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    setToast({ message: "CSV downloaded successfully!", type: "success" });
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + parseFloat(exp.amount || 0),
    0
  );
  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount || 0);
    return acc;
  }, {});

  return (
    <div className="bg-background p-4 md:p-8 pb-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto space-y-6">
        <Card className="bg-card animate-fade-in border-border shadow-xl">
          <CardHeader className="bg-primary/5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Expense Dashboard
                  </CardTitle>
                </div>
                <CardDescription className="text-base ml-14">
                  Track and manage all your expenses in one place
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  size="lg"
                  className="whitespace-nowrap cursor-pointer w-full sm:w-auto"
                  title={!isPremium ? "Premium feature" : "Download CSV"}
                >
                  {!isPremium && <Lock className="w-4 h-4 mr-2" />}
                  {isPremium && <Download className="w-4 h-4 mr-2" />}
                  Download CSV
                </Button>
                <Button
                  onClick={() => navigate("/expenses")}
                  size="lg"
                  className="whitespace-nowrap bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer w-full sm:w-auto"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add New Expense
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {expenses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
              <div className="absolute inset-0 bg-green-500/5 group-hover:bg-green-500/10 transition-all"></div>
              <CardContent className="pt-6 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  ₹{totalAmount.toFixed(2)}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Expenses
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-all"></div>
              <CardContent className="pt-6 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                  {expenses.length}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Transactions
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border">
              <div className="absolute inset-0 bg-purple-500/5 group-hover:bg-purple-500/10 transition-all"></div>
              <CardContent className="pt-6 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                  {Object.keys(categoryTotals).length}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Categories Used
                </p>
              </CardContent>
            </Card>

            <BudgetCard totalAmount={totalAmount} />
          </div>
        )}

        {/* Search Bar */}
        {expenses.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Search className="w-4 h-4 text-white" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search expenses by description, category, or amount..."
                className="w-full pl-14 md:pl-16 pr-12 py-3 md:py-4 bg-card border-2 border-border 
                         rounded-xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary
                         shadow-lg hover:shadow-xl text-foreground placeholder-muted-foreground font-semibold
                         transition-all duration-300 text-sm md:text-base"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="text-center mt-4">
                <span className="text-sm text-muted-foreground">
                  Found <span className="font-bold text-primary">{filteredExpenses.length}</span> expense{filteredExpenses.length !== 1 ? 's' : ''} matching "{searchTerm}"
                </span>
              </div>
            )}
          </div>
        )}

        <Card className="bg-card animate-fade-in border-border shadow-xl">
          {filteredExpenses.length > 0 ? (
            <div className="overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border">
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recent Transactions
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted border-b-2 border-border">
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">
                        Amount
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">
                        Description
                      </th>
                      <th className="text-left py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">
                        Category
                      </th>
                      <th className="text-center py-4 px-6 font-bold text-foreground uppercase text-xs tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pagination.currentItems.map((exp, index) => (
                      <tr
                        key={exp.id}
                        className="group hover:bg-accent transition-all duration-200"
                      >
                        <td className="py-5 px-6">
                          {editingId === exp.id ? (
                            <Input
                              type="number"
                              value={editForm.amount}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  amount: e.target.value,
                                })
                              }
                              className="w-32"
                              step="0.01"
                              min="0"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                <svg
                                  className="w-5 h-5 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                  />
                                </svg>
                              </div>
                              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ₹{parseFloat(exp.amount).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-5 px-6">
                          {editingId === exp.id ? (
                            <Input
                              value={editForm.description}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  description: e.target.value,
                                })
                              }
                              className="w-full"
                            />
                          ) : (
                            <span className="font-semibold text-foreground">
                              {exp.description}
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6">
                          {editingId === exp.id ? (
                            <select
                              value={editForm.category}
                              onChange={(e) =>
                                setEditForm({
                                  ...editForm,
                                  category: e.target.value,
                                })
                              }
                              className="px-3 py-2 border rounded-lg bg-background border-input text-foreground"
                            >
                              {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-primary/10 text-primary border border-primary/20">
                              {exp.category}
                            </span>
                          )}
                        </td>
                        <td className="py-5 px-6">
                          <div className="flex items-center justify-center gap-2">
                            {editingId === exp.id ? (
                              <>
                                <Button
                                  onClick={() => handleSaveEdit(exp.id)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                >
                                  <Save className="w-4 h-4 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  onClick={handleCancelEdit}
                                  variant="outline"
                                  size="sm"
                                  className="cursor-pointer"
                                >
                                  <X className="w-4 h-4 mr-1" />
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  onClick={() => handleEdit(exp)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                >
                                  <Edit2 className="w-4 h-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => handleDelete(exp.id)}
                                  variant="destructive"
                                  size="sm"
                                  className="cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Delete
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="m-5 p-3">
                  <Pagination {...pagination} />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-3xl mb-6 shadow-xl">
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                No expenses recorded yet
              </h3>
              <p className="text-muted-foreground mb-8 text-lg">
                Start tracking your expenses by adding your first transaction
              </p>
              <Button
                onClick={() => navigate("/expenses")}
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Your First Expense
              </Button>
            </div>
          )}
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
