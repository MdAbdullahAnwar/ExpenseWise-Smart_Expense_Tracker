import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PremiumPurchase from "./PremiumPurchase";
import PremiumExpenseTracker from "./PremiumExpenseTracker";
import { Crown, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:5000";

export default function PremiumPage({ userInfo, setUserInfo }) {
  const [isPremium, setIsPremium] = useState(userInfo?.isPremium || false);
  const [searchParams, setSearchParams] = useSearchParams();
  const urlRateLimitMessage = searchParams.get('rateLimitMessage');
  const initialRemainingMinutes = parseInt(searchParams.get('remainingTime')) || 0;
  
  const getInitialSeconds = () => {
    const stored = localStorage.getItem('rateLimitExpiry');
    if (stored) {
      const expiryTime = parseInt(stored);
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
      if (remaining > 0) return remaining;
      localStorage.removeItem('rateLimitExpiry');
      localStorage.removeItem('rateLimitMessage');
    }
    if (initialRemainingMinutes > 0) {
      const expiryTime = Date.now() + (initialRemainingMinutes * 60 * 1000);
      localStorage.setItem('rateLimitExpiry', expiryTime.toString());
      if (urlRateLimitMessage) {
        localStorage.setItem('rateLimitMessage', urlRateLimitMessage);
      }
      return initialRemainingMinutes * 60;
    }
    return 0;
  };
  
  const [remainingSeconds, setRemainingSeconds] = useState(getInitialSeconds());
  const rateLimitMessage = urlRateLimitMessage || localStorage.getItem('rateLimitMessage') || '';

  useEffect(() => {
    setIsPremium(userInfo?.isPremium || false);
  }, [userInfo]);

  useEffect(() => {
    const stored = localStorage.getItem('rateLimitExpiry');
    if (stored) {
      const interval = setInterval(() => {
        const expiryTime = parseInt(stored);
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
        
        if (remaining <= 0) {
          clearInterval(interval);
          localStorage.removeItem('rateLimitExpiry');
          localStorage.removeItem('rateLimitMessage');
          setRemainingSeconds(0);
        } else {
          setRemainingSeconds(remaining);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, []);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

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

  // If user is premium, show the expense tracker
  if (isPremium) {
    return <PremiumExpenseTracker />;
  }

  // If not premium, show the purchase page
  return (
    <div className="min-h-screen bg-background py-12 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-4">
        {rateLimitMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 rounded-xl animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                  Transaction Limit Reached
                </h3>
                <p className="text-red-800 dark:text-red-200">
                  {rateLimitMessage}
                </p>
                {remainingSeconds > 0 && (
                  <p className="text-sm text-red-700 dark:text-red-300 mt-2 font-mono">
                    Time remaining: {minutes.toString().padStart(2, '0')} min {seconds.toString().padStart(2, '0')} sec
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
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
