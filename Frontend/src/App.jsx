import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { store } from "./store/store";
import { setUserInfo as setReduxUserInfo } from "./store/userSlice";
import Layout from "./components/layout/Layout";
import LandingPage from "./components/landing/LandingPage";
import SignupForm from "./components/forms/SignupForm";
import LoginForm from "./components/forms/LoginForm";
import ForgotPasswordForm from "./components/forms/ForgotPasswordForm";
import ResetPasswordForm from "./components/forms/ResetPasswordForm";
import ExpensePage from "./components/expense/ExpensePage";
import ExpenseListPage from "./components/expense/ExpenseListPage";
import ProfilePage from "./components/profile/ProfilePage";
import PremiumPage from "./components/premium/PremiumPage";
import AnalysePage from "./components/analyse/AnalysePage";
import CategoryBreakdown from "./components/analyse/CategoryBreakdown";
import ExpenseTrends from "./components/analyse/ExpenseTrends";
import Leaderboard from "./components/analyse/Leaderboard";

function AppContent() {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));
  const [userInfo, setUserInfo] = useState(() => {
    const stored = localStorage.getItem("userInfo");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (userId && !userInfo) {
      const storedInfo = localStorage.getItem("userInfo");
      if (storedInfo) {
        const info = JSON.parse(storedInfo);
        setUserInfo(info);
        dispatch(setReduxUserInfo(info));
      }
    } else if (userInfo) {
      dispatch(setReduxUserInfo(userInfo));
    }
  }, [userId, userInfo, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userInfo");
    localStorage.setItem("theme", "light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
    setUserId(null);
    setUserInfo(null);
    dispatch(setReduxUserInfo(null));
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              isAuthenticated={!!userId}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
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
          <Route path="forgot-password" element={<ForgotPasswordForm />} />
          <Route path="reset-password/:token" element={<ResetPasswordForm />} />

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
            element={
              userId ? (
                <PremiumPage userInfo={userInfo} setUserInfo={setUserInfo} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="analyse"
            element={
              userId ? (
                <AnalysePage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="analyse/category-breakdown"
            element={
              userId ? (
                <CategoryBreakdown />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="analyse/expense-trends"
            element={
              userId ? (
                <ExpenseTrends />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="analyse/leaderboard"
            element={
              userId ? (
                <Leaderboard />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
