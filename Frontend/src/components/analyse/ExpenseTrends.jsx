import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Lock } from "lucide-react";

export default function ExpenseTrends() {
  const navigate = useNavigate();
  const isPremium = useSelector((state) => state.user.isPremium);
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState("week");
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (isPremium) {
      fetchExpenses();
    }
  }, [isPremium]);

  useEffect(() => {
    if (expenses.length > 0) {
      processChartData(expenses, filter);
    }
  }, [expenses, filter]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const processChartData = (data, filterType) => {
    const now = new Date();
    let processed = [];

    if (filterType === "week") {
      // Last 7 days with day names
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayExpenses = data.filter((exp) => {
          const expDate = new Date(exp.createdAt);
          return expDate.toDateString() === date.toDateString();
        });
        processed.push({
          name: days[date.getDay()],
          amount: dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0),
        });
      }
    } else if (filterType === "month") {
      // Last 30 days
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dayExpenses = data.filter((exp) => {
          const expDate = new Date(exp.createdAt);
          return expDate.toDateString() === date.toDateString();
        });
        processed.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: dayExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0),
        });
      }
    } else if (filterType === "year") {
      // Last 12 months
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      processed = months.map((month, index) => {
        const monthExpenses = data.filter((exp) => {
          const expDate = new Date(exp.createdAt);
          return expDate.getMonth() === index && expDate.getFullYear() === now.getFullYear();
        });
        return {
          name: month,
          amount: monthExpenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0),
        };
      });
    }

    setChartData(processed);
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium to access expense trends
            </p>
            <Button onClick={() => navigate("/premium")} size="lg">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background p-4 md:p-8 pb-12">
      <div className="relative max-w-4xl mx-auto space-y-6 mb-8">
        <Button variant="outline" onClick={() => navigate("/analyse")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>

        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="bg-primary/5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Expense Trends
              </CardTitle>
              <div className="flex gap-2">
                <Button
                  variant={filter === "week" ? "default" : "outline"}
                  onClick={() => setFilter("week")}
                  size="sm"
                >
                  Week
                </Button>
                <Button
                  variant={filter === "month" ? "default" : "outline"}
                  onClick={() => setFilter("month")}
                  size="sm"
                >
                  Month
                </Button>
                <Button
                  variant={filter === "year" ? "default" : "outline"}
                  onClick={() => setFilter("year")}
                  size="sm"
                >
                  Year
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {chartData.length > 0 ? (
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Bar dataKey="amount" fill="#10b981" name="Expenses ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No expense data available for this period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
