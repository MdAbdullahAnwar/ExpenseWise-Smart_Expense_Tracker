import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Lock } from "lucide-react";

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];

export default function CategoryBreakdown() {
  const navigate = useNavigate();
  const isPremium = useSelector((state) => state.user.isPremium);
  const [expenses, setExpenses] = useState([]);
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    if (isPremium) {
      fetchExpenses();
    }
  }, [isPremium]);

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
      processCategoryData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const processCategoryData = (data) => {
    const categoryTotals = data.reduce((acc, exp) => {
      const category = exp.category || "Other";
      acc[category] = (acc[category] || 0) + parseFloat(exp.amount || 0);
      return acc;
    }, {});

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }));

    setCategoryData(chartData);
  };

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium to access category breakdown
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
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {categoryData.length > 0 ? (
              <div className="space-y-6">
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `$${value}`} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryData.map((item, index) => (
                    <div key={item.name} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <span className="font-bold text-lg">${item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
