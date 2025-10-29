import { useState, useEffect } from "react";
import axios from "axios";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Toast from "../ui/toast";
import {
  User,
  Mail,
  Calendar,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Download,
  Camera,
  Save,
  Edit2,
  Phone,
  Globe
} from "lucide-react";

export default function ProfilePage({ userInfo, setUserInfo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    currency: userInfo?.currency || "INR",
    timezone: userInfo?.timezone || "UTC"
  });

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        currency: userInfo.currency || "INR",
        timezone: userInfo.timezone || "UTC"
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      setToast({ message: "Name and email are required", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:5000/user/profile",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      const updatedUserInfo = { ...userInfo, ...formData };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
      
      if (setUserInfo) {
        setUserInfo(updatedUserInfo);
      }

      setToast({ message: "Profile updated successfully!", type: "success" });
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      setToast({ 
        message: error.response?.data?.message || "Failed to update profile", 
        type: "error" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: userInfo?.name || "",
      email: userInfo?.email || "",
      phone: userInfo?.phone || "",
      currency: userInfo?.currency || "INR",
      timezone: userInfo?.timezone || "UTC"
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-background p-4 md:p-8 pb-12">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-6xl mx-auto animate-fade-in mb-8">
        <Card className="bg-card border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-xl">
                {formData.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {formData.name || "User"}
              </h1>
              <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
                <Mail className="w-4 h-4" />
                {formData.email}
              </p>
              <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center md:justify-start gap-2">
                <Calendar className="w-4 h-4" />
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-card border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Full Name
                    </Label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      Email Address
                    </Label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      Phone Number
                    </Label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+1 (555) 000-0000"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      Currency
                    </Label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full mt-1 px-3 py-2 border rounded-lg bg-background border-input disabled:bg-muted disabled:cursor-not-allowed text-foreground"
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                      <option value="CAD">CAD ($)</option>
                      <option value="AUD">AUD ($)</option>
                    </select>
                  </div>
                </div>
              </form>
            </Card>

            <Card className="bg-card border-border p-6 mt-8">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start hover:bg-primary/10">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="justify-start hover:bg-primary/10">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" className="justify-start hover:bg-primary/10">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="justify-start hover:bg-primary/10">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Billing
                </Button>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-card border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-6">
                Account Stats
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-2xl font-bold text-foreground">245</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formData.currency === "USD" && "$"}
                    {formData.currency === "EUR" && "€"}
                    {formData.currency === "GBP" && "£"}
                    {formData.currency === "INR" && "₹"}
                    {formData.currency === "JPY" && "¥"}
                    {formData.currency === "CAD" && "C$"}
                    {formData.currency === "AUD" && "A$"}
                    3,420
                  </p>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground">Saved</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formData.currency === "USD" && "$"}
                    {formData.currency === "EUR" && "€"}
                    {formData.currency === "GBP" && "£"}
                    {formData.currency === "INR" && "₹"}
                    {formData.currency === "JPY" && "¥"}
                    {formData.currency === "CAD" && "C$"}
                    {formData.currency === "AUD" && "A$"}
                    580
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
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
