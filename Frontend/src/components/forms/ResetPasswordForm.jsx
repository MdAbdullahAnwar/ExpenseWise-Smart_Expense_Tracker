import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import Toast from "../ui/toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function ResetPasswordForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      setToast({ message: "All fields are required", type: "error" });
      return;
    }

    if (password.length < 6) {
      setToast({ message: "Password must be at least 6 characters", type: "error" });
      return;
    }

    if (password !== confirmPassword) {
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/password/resetpassword/${id}`, { password });
      
      if (res.data.success) {
        setSuccess(true);
        setToast({ message: "Password reset successful!", type: "success" });
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password";
      setToast({ message: errorMessage, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <Card className="w-full max-w-md bg-card border-border animate-scale-in relative shadow-xl">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg mx-auto">
            {success ? (
              <CheckCircle className="w-8 h-8 text-white" />
            ) : (
              <Lock className="w-8 h-8 text-white" />
            )}
          </div>
          <CardTitle className="text-3xl gradient-text">
            {success ? "Password Reset!" : "Reset Password"}
          </CardTitle>
          <CardDescription className="text-base">
            {success 
              ? "Redirecting to login..."
              : "Enter your new password"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-12"
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                size="lg"
                className="w-full cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">Success!</p>
              <p className="text-muted-foreground">Your password has been reset successfully.</p>
            </div>
          )}
        </CardContent>
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
