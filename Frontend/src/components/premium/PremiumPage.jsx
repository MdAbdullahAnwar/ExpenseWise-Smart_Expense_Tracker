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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Please log in to access premium features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-professional-lg">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Premium Membership
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Unlock advanced features and take your expense tracking to the next level
          </p>
        </div>
        <PremiumPurchase userInfo={userInfo} setUserInfo={setUserInfo} isPremium={isPremium} setIsPremium={setIsPremium} />
      </div>
    </div>
  );
}
