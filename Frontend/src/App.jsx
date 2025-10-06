import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupForm from "./components/forms/SignupForm";
import LoginForm from "./components/forms/LoginForm";
import ExpensePage from "./components/expense/ExpensePage";
import ExpenseListPage from "./components/expense/ExpenseListPage";

function App() {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId"));

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm setUserId={setUserId} />} />

        <Route
          path="/expenses"
          element={
            userId ? <ExpensePage userId={userId} /> : <Navigate to="/login" />
          }
        />

        <Route
          path="/expense-list"
          element={
            userId ? <ExpenseListPage userId={userId} /> : <Navigate to="/login" />
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
