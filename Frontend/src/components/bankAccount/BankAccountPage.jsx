import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Wallet, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import Toast from "../ui/toast";

export default function BankAccountPage() {
  const [accounts, setAccounts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", balance: "", isDefault: false, isRecurring: false, recurringAmount: "", recurringDay: 1 });
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/bank-account", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data.accounts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.balance) {
      setToast({ message: "Please fill all fields!", type: "error" });
      return;
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/bank-account/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setToast({ message: "Account updated!", type: "success" });
      } else {
        await axios.post("http://localhost:5000/bank-account", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setToast({ message: "Account added!", type: "success" });
      }
      setForm({ name: "", balance: "", isDefault: false, isRecurring: false, recurringAmount: "", recurringDay: 1 });
      setShowForm(false);
      setEditingId(null);
      fetchAccounts();
    } catch (err) {
      setToast({ message: err.response?.data?.message || "Error!", type: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this account?")) return;
    try {
      await axios.delete(`http://localhost:5000/bank-account/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setToast({ message: "Account deleted!", type: "success" });
      fetchAccounts();
    } catch (err) {
      setToast({ message: "Error deleting account!", type: "error" });
    }
  };

  const handleEdit = (account) => {
    setForm({ 
      name: account.name, 
      balance: account.balance, 
      isDefault: account.isDefault,
      isRecurring: account.isRecurring || false,
      recurringAmount: account.recurringAmount || "",
      recurringDay: account.recurringDay || 1
    });
    setEditingId(account.id);
    setShowForm(true);
  };

  return (
    <div className="bg-background p-4 md:p-8 pb-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bank Accounts
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your accounts and recurring transactions</p>
          </div>
          <Button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setForm({ name: "", balance: "", isDefault: false, isRecurring: false, recurringAmount: "", recurringDay: 1 });
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Account
          </Button>
        </div>

        {showForm && (
          <Card className="animate-fade-in shadow-lg border-border bg-card">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{editingId ? "Edit Account" : "Add New Account"}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Account Name</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g., Main Account, Savings"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Balance</Label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                    <Input
                      type="number"
                      value={form.balance}
                      onChange={(e) => setForm({ ...form, balance: e.target.value })}
                      placeholder="0.00"
                      className="pl-8 h-11"
                      step="0.01"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="isDefault" className="text-base font-medium cursor-pointer">
                      Default Account
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Use this account for expenses by default
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isDefault}
                    onClick={() => setForm({ ...form, isDefault: !form.isDefault })}
                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      form.isDefault ? 'bg-green-600' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        form.isDefault ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/50">
                  <div className="space-y-0.5">
                    <Label htmlFor="isRecurring" className="text-base font-medium cursor-pointer">
                      Recurring Credit
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Auto-credit amount monthly (e.g., salary)
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={form.isRecurring}
                    onClick={() => setForm({ ...form, isRecurring: !form.isRecurring })}
                    className={`cursor-pointer relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                      form.isRecurring ? 'bg-blue-600' : 'bg-muted'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                        form.isRecurring ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {form.isRecurring && (
                  <div className="space-y-4 p-5 rounded-lg border border-border bg-accent/50 animate-fade-in shadow-sm">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Monthly Credit Amount</Label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                        <Input
                          type="number"
                          value={form.recurringAmount}
                          onChange={(e) => setForm({ ...form, recurringAmount: e.target.value })}
                          placeholder="0.00"
                          className="pl-8 h-11"
                          step="0.01"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-foreground">Credit on Day of Month</Label>
                      <Input
                        type="number"
                        value={form.recurringDay}
                        onChange={(e) => setForm({ ...form, recurringDay: parseInt(e.target.value) || 1 })}
                        min="1"
                        max="28"
                        placeholder="1"
                        className="h-11"
                      />
                      <p className="text-xs text-muted-foreground font-medium">Day 1-28 of each month</p>
                    </div>
                  </div>
                )}
                <div className="flex gap-3 pt-2">
                  <Button type="submit" className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 cursor-pointer">
                    <Check className="w-4 h-4 mr-2" />
                    {editingId ? "Update" : "Add"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-11 cursor-pointer"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setForm({ name: "", balance: "", isDefault: false, isRecurring: false, recurringAmount: "", recurringDay: 1 });
                    }}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <Card key={account.id} className="relative overflow-hidden shadow-lg hover:shadow-xl transition-shadow border-border bg-card">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              {account.isDefault && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Default
                </div>
              )}
              {account.isRecurring && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                  Recurring
                </div>
              )}
              <CardContent className="pt-8 pb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-1 text-foreground">{account.name}</h3>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{parseFloat(account.balance).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(account)}
                      className="cursor-pointer text-blue-600 hover:bg-blue-50 hover:border-blue-400"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(account.id)}
                      className="cursor-pointer text-red-600 hover:bg-red-50 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {account.isRecurring && (
                  <div className="mt-2 p-3 bg-accent/50 rounded-lg border border-border">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">Auto-adds:</span> +₹{parseFloat(account.recurringAmount).toFixed(2)} every month on day {account.recurringDay}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {accounts.length === 0 && !showForm && (
          <Card className="text-center py-12 bg-card border-border">
            <CardContent>
              <Wallet className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No Bank Accounts</h3>
              <p className="text-muted-foreground mb-4">
                Add your first bank account to start tracking expenses
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Account
              </Button>
            </CardContent>
          </Card>
        )}
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
