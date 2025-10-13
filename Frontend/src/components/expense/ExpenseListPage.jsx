import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useNavigate } from "react-router-dom";
import Toast from "../ui/toast";

export default function ExpenseListPage() {
  const [expenses, setExpenses] = useState([]);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to fetch expenses",
        type: "error",
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expense/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((exp) => exp.id !== id));
      setToast({ message: "Expense deleted!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to delete expense",
        type: "error",
      });
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4 md:p-8">
      <Card className="max-w-5xl mx-auto p-6 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold mb-3 sm:mb-0">
            Your Expense List
          </h2>
          <Button
            onClick={() => navigate("/expenses")}
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white"
          >
            + Add New Expense
          </Button>
        </div>

        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white shadow-md rounded-lg overflow-hidden text-sm md:text-base">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="p-3 text-left">Amount</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((exp) => (
                  <tr key={exp.id} className="border-b hover:bg-blue-50">
                    <td className="p-3">{exp.amount}</td>
                    <td className="p-3">{exp.description}</td>
                    <td className="p-3">{exp.category}</td>
                    <td className="p-3 text-center">
                      <Button
                        onClick={() => handleDelete(exp.id)}
                        className="bg-red-500 text-white hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6">
            No expenses recorded yet.
          </p>
        )}
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
