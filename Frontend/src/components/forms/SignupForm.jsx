import { useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { Form } from "../ui/form";
import Toast from "../ui/toast";
import { validateForm } from "../../utils/validateForm";

export default function SignupForm() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [toast, setToast] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { valid, message } = validateForm(form);
    if (!valid) {
      setToast({ message, type: "error" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/user/signup", form, {
        headers: { "Content-Type": "application/json" },
      });

      setToast({ message: "Signup successful!", type: "success" });
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Signup failed";
      setToast({ message: errorMessage, type: "error" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Card className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white/30 shadow-xl rounded-2xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-slate-900">
          Create Account
        </h2>
        <Form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter Your Name"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="********"
              className="mt-1 shadow-sm focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:scale-105 transition-all mt-4"
          >
            Sign Up
          </Button>
        </Form>
        <p className="text-center text-sm text-slate-500 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
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
