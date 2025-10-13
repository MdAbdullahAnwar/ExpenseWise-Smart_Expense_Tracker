import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/layout/Layout";
import LandingPage from "./components/landing/LandingPage";
import SignupForm from "./components/forms/SignupForm";
import LoginForm from "./components/forms/LoginForm";
import ExpensePage from "./components/expense/ExpensePage";
import ExpenseListPage from "./components/expense/ExpenseListPage";
import ProfilePage from "./components/profile/ProfilePage";
import PremiumPage from "./components/premium/PremiumPage";

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (userId && !userInfo) {
      // Fetch user info if needed
      const storedInfo = localStorage.getItem("userInfo");
      if (storedInfo) {
        setUserInfo(JSON.parse(storedInfo));
      }
    }
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    setUserId(null);
    setUserInfo(null);
  };

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <Layout
              isAuthenticated={!!userId}
              userInfo={userInfo}
              onLogout={handleLogout}
            />
          }
        >
          <Route index element={<LandingPage />} />
          <Route path="signup" element={<SignupForm />} />
          <Route
            path="login"
            element={
              <LoginForm setUserId={setUserId} setUserInfo={setUserInfo} />
            }
          />

          {/* Protected routes */}
          <Route
            path="dashboard"
            element={
              userId ? (
                <ExpensePage userId={userId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="expenses"
            element={
              userId ? (
                <ExpensePage userId={userId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="expense-list"
            element={
              userId ? (
                <ExpenseListPage userId={userId} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="profile"
            element={
              userId ? (
                <ProfilePage userInfo={userInfo} setUserInfo={setUserInfo} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="premium"
            element={userId ? <PremiumPage /> : <Navigate to="/login" />}
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
