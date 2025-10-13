import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import Toast from "../ui/toast";

export default function ExpensePage() {
  const [form, setForm] = useState({
    amount: "",
    description: "",
    category: "",
    customCategory: "",
  });
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

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

  const token = localStorage.getItem("token");

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

    try {
      await axios.post(
        "http://localhost:5000/expense/add",
        {
          amount: form.amount,
          description: form.description,
          category: finalCategory,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setForm({
        amount: "",
        description: "",
        category: "",
        customCategory: "",
      });
      setToast({ message: "Expense added successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to add expense.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <Card className="max-w-2xl mx-auto p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
          Add Daily Expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Enter amount spent"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your expense"
            />
          </div>

          <div>
            <Label>Category</Label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {form.category === "Other" && (
              <div className="mt-2">
                <Label>Custom Category</Label>
                <Input
                  type="text"
                  name="customCategory"
                  value={form.customCategory}
                  onChange={handleChange}
                  placeholder="Enter your custom category"
                />
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Button
              type="submit"
              className="w-full sm:w-1/2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:scale-105 transition"
            >
              Add Expense
            </Button>
            <Button
              type="button"
              onClick={() => navigate("/expense-list")}
              className="w-full sm:w-1/2 bg-gray-500 text-white hover:bg-gray-600"
            >
              View All Expenses
            </Button>
          </div>
        </form>
      </Card>

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
