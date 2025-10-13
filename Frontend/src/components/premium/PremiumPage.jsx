import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { CheckCircle, X, Crown, Zap, Shield, Users } from "lucide-react";

export default function PremiumPage() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      current: true,
      features: [
        { text: "50 expenses per month", included: true },
        { text: "Basic categories", included: true },
        { text: "Monthly reports", included: true },
        { text: "Mobile app access", included: true },
        { text: "Custom categories", included: false },
        { text: "Advanced analytics", included: false },
        { text: "Export to CSV/PDF", included: false },
        { text: "Priority support", included: false },
      ]
    },
    {
      name: "Premium",
      price: "$9.99",
      period: "per month",
      recommended: true,
      features: [
        { text: "Unlimited expenses", included: true },
        { text: "Custom categories", included: true },
        { text: "Advanced analytics", included: true },
        { text: "Export to CSV/PDF", included: true },
        { text: "Priority support", included: true },
        { text: "Budget alerts", included: true },
        { text: "API access", included: false },
        { text: "Team collaboration", included: false },
      ]
    },
    {
      name: "Business",
      price: "$29.99",
      period: "per month",
      features: [
        { text: "Everything in Premium", included: true },
        { text: "Team collaboration", included: true },
        { text: "API access", included: true },
        { text: "Custom integrations", included: true },
        { text: "Dedicated support", included: true },
        { text: "Advanced security", included: true },
        { text: "Custom reports", included: true },
        { text: "White labeling", included: true },
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Unlock powerful features to supercharge your expense tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl ${
                plan.recommended ? "ring-2 ring-blue-500 scale-105" : ""
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    RECOMMENDED
                  </span>
                </div>
              )}
              
              {plan.current && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gray-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                    CURRENT PLAN
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {feature.included ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.included
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? "bg-gray-400 cursor-not-allowed"
                    : plan.recommended
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    : "bg-gray-800 hover:bg-gray-900 text-white dark:bg-gray-700 dark:hover:bg-gray-600"
                }`}
                disabled={plan.current}
              >
                {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
              </Button>
            </Card>
          ))}
        </div>

        {/* Features comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why Upgrade?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl">
              <Crown className="w-10 h-10 text-amber-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Unlimited Expenses
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track as many expenses as you need without any limits
              </p>
            </Card>
            
            <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl">
              <Zap className="w-10 h-10 text-blue-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Advanced Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get detailed insights into your spending patterns
              </p>
            </Card>
            
            <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl">
              <Shield className="w-10 h-10 text-green-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Priority Support
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get help when you need it with priority customer support
              </p>
            </Card>
            
            <Card className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl">
              <Users className="w-10 h-10 text-purple-500 mb-4" />
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Team Collaboration
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Share and manage expenses with your team or family
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
