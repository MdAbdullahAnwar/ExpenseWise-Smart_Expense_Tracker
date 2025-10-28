import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { ArrowLeft, Lock, Trophy, Medal, Award, TrendingUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Crown } from "lucide-react";
import Toast from "../ui/toast";

export default function Leaderboard() {
  const navigate = useNavigate();
  const isPremium = useSelector((state) => state.user.isPremium);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (isPremium) {
      fetchLeaderboard();
    }
  }, [isPremium]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/leaderboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaderboard(res.data);
    } catch (err) {
      console.error(err);
      setToast({
        message: err.response?.data?.message || "Failed to fetch leaderboard",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-slate-300" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-400" />;
    return null;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-400 to-yellow-600";
    if (rank === 2) return "from-slate-300 to-slate-400";
    if (rank === 3) return "from-amber-400 to-amber-600";
    return "from-blue-500 to-purple-600";
  };

  // Pagination
  const totalPages = Math.ceil(leaderboard.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = leaderboard.slice(startIndex, endIndex);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  if (!isPremium) {
    return (
      <div className="bg-background flex items-center justify-center p-4 min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
            <p className="text-muted-foreground mb-6">
              Upgrade to Premium to access the leaderboard and compete with other users
            </p>
            <Button onClick={() => navigate("/premium")} size="lg" className="cursor-pointer">
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
        <Button variant="outline" onClick={() => navigate("/analyse")} className="cursor-pointer">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Analysis
        </Button>

        {leaderboard.length > 0 && (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{leaderboard.length}</p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your Rank</p>
                  <p className="text-2xl font-bold text-foreground">
                    #{leaderboard.find(u => u.isCurrentUser)?.rank || "N/A"}
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Your Expenses</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${leaderboard.find(u => u.isCurrentUser)?.totalExpenses || "0.00"}
                  </p>
                </div>
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Top Spender</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${leaderboard[0]?.totalExpenses || "0.00"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-card border-border shadow-xl">
          <CardHeader className="bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl shadow-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent">
                  Premium Leaderboard
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Top spenders among premium members
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-4">Loading leaderboard...</p>
              </div>
            ) : leaderboard.length > 0 ? (
              <>
                <div className="space-y-3">
                  {currentUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        user.isCurrentUser
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                    <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
                      {user.rank <= 3 ? (
                        <div className={`w-12 h-12 bg-gradient-to-br ${getRankColor(user.rank)} rounded-full flex items-center justify-center shadow-lg`}>
                          {getMedalIcon(user.rank)}
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center text-lg font-bold text-foreground shadow-md">
                          {user.rank}
                        </div>
                      )}
                    </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground truncate">
                            {user.name}
                            {user.isPremium && (
                              <Crown className="inline w-4 h-4 ml-1 text-yellow-500" />
                            )}
                            {user.isCurrentUser && (
                              <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ${user.totalExpenses}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {user.totalTransactions} transactions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-border">
                    <Button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      First
                    </Button>
                    <Button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Prev
                    </Button>
                    <div className="px-4 py-2 bg-primary/10 rounded-lg">
                      <span className="text-sm font-medium text-foreground">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>
                    <Button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Next
                    </Button>
                    <Button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      size="sm"
                      className="cursor-pointer"
                    >
                      Last
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground">No leaderboard data available yet</p>
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
}
