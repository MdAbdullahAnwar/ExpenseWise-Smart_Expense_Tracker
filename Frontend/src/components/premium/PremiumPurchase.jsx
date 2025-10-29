import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserInfo as setReduxUserInfo } from "../../store/userSlice";
import { Crown, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PremiumPurchase({ userInfo, setUserInfo }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleBuyPremium = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token");

      // Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Razorpay load failed");

      // Create order (PENDING)
      const orderRes = await axios.post(
        `${API_BASE}/payment/create-order`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { order, key_id } = orderRes.data;

      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "ExpenseWise",
        description: "Premium Membership - ₹499/year",
        order_id: order.id,
        prefill: { name: userInfo.name, email: userInfo.email },
        theme: { color: "#F59E0B" },
        handler: async (response) => {
          try {
            // Verify (updates to SUCCESSFUL, makes premium)
            const verifyRes = await axios.post(
              `${API_BASE}/payment/verify-payment`,
              response,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (verifyRes.data.success) {
              alert("Transaction successful");
              const updatedUser = verifyRes.data.userInfo;
              localStorage.setItem("userInfo", JSON.stringify(updatedUser));
              setUserInfo(updatedUser);
              dispatch(setReduxUserInfo(updatedUser));
            } else {
              alert("TRANSACTION FAILED");
            }
          } catch (err) {
            alert("TRANSACTION FAILED");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            // Update to FAILED on cancel
            axios
              .post(
                `${API_BASE}/payment/payment-failed`,
                { razorpay_order_id: order.id },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              )
              .catch(console.error);
            alert("TRANSACTION FAILED");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        // Update to FAILED
        axios
          .post(
            `${API_BASE}/payment/payment-failed`,
            { razorpay_order_id: order.id },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          )
          .catch(console.error);
        alert("TRANSACTION FAILED");
        setLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error(error);
      alert("TRANSACTION FAILED");
      setLoading(false);
    }
  };

  if (userInfo?.isPremium) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center shadow-xl">
        <Crown className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Premium Member
        </h2>
        <p className="text-gray-600 mb-6">Enjoy all premium features!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
          {[
            "Unlimited tracking",
            "Advanced reports",
            "Data export",
            "Priority support",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2 text-left">
              <Check className="w-5 h-5 text-green-500" />
              <span>{f}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
      <div className="text-center">
        <Crown className="w-16 h-16 text-amber-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Upgrade to Premium
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Unlock unlimited features for ₹499/year
        </p>
        <Button
          onClick={handleBuyPremium}
          disabled={loading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 text-lg rounded-lg shadow-lg cursor-pointer"
        >
          <span className="flex items-center">
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Crown className="w-5 h-5 mr-2" />
            )}
            {loading ? "Processing..." : "Buy Premium Membership"}
          </span>
        </Button>
        <p className="text-xs text-gray-500 mt-4">
          Secure payment via Razorpay
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
          {[
            "Unlimited tracking",
            "Advanced reports",
            "Data export",
            "Priority support",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-amber-500" />
              <span className="text-gray-700 dark:text-gray-300">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
