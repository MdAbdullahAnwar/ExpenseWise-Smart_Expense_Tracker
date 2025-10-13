import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import Toast from "../ui/toast";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function LoginForm({ setUserId, setUserInfo }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setToast({ message: "Email and password are required", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/user/login", form, {
        headers: { "Content-Type": "application/json" },
      });

      const { token, userId, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userInfo", JSON.stringify(user || { email: form.email }));
      
      setUserId(userId);
      setUserInfo(user || { email: form.email });

      setToast({ message: "Login successful!", type: "success" });
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Login failed. Please try again.";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md p-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Login to access your expense dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="pl-10 h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
              Password
            </Label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 dark:border-gray-600" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                Remember me
              </span>
            </label>
            <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Login
                <ArrowRight className="ml-2 w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
              Sign up for free
            </Link>
          </p>
        </div>
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
