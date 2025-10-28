import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { PieChart, BarChart3, Lock } from "lucide-react";

export default function AnalysePage() {
  const navigate = useNavigate();
  const isPremium = useSelector((state) => state.user.isPremium);

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium to access expense analysis and insights
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-indigo-500/5 to-pink-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto space-y-6 mb-8">
        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Expense Analysis
              </CardTitle>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            onClick={() => navigate("/analyse/category-breakdown")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
                  <PieChart className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Category Breakdown</h3>
                <p className="text-muted-foreground">
                  View expenses distribution across categories with interactive pie chart
                </p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            onClick={() => navigate("/analyse/expense-trends")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Expense Trends</h3>
                <p className="text-muted-foreground">
                  Analyze spending patterns with weekly, monthly, and yearly charts
                </p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-card border-border"
            onClick={() => navigate("/analyse/leaderboard")}
          >
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">User Leaderboard</h3>
                <p className="text-muted-foreground">
                  See how you rank among premium users and compete for the top spot
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
