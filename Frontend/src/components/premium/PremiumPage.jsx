import { useState, useEffect } from "react";
import PremiumPurchase from "./PremiumPurchase";
import { Crown } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PremiumPage({ userInfo, setUserInfo }) {
  const [isPremium, setIsPremium] = useState(userInfo?.isPremium || false);

  useEffect(() => {
    setIsPremium(userInfo?.isPremium || false);
  }, [userInfo]);

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Please log in to access premium features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
          Premium Membership
        </h1>
        <PremiumPurchase userInfo={userInfo} setUserInfo={setUserInfo} isPremium={isPremium} setIsPremium={setIsPremium} />
      </div>
    </div>
  );
}
