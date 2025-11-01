import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { 
  ArrowRight, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  CheckCircle,
  Star,
  ChevronRight,
  Sparkles,
  CreditCard,
  FileText,
  Target,
  Clock,
  Globe,
  Award,
  DollarSign
} from "lucide-react";

const HeroBadge = () => (
  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-8 border border-primary/20">
    <Sparkles className="w-4 h-4 text-primary" />
    <span className="text-sm font-medium text-primary">
      New: Personalized expense breakdowns and intuitive tracking tools
    </span>
    <Award className="w-4 h-4 text-primary" />
  </div>
);

const HeroTitle = () => (
  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8">
    <span className="block text-foreground mb-2">
      Take Control of
    </span>
    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
      Your Finances
    </span>
  </h1>
);

const HeroSubtitle = () => (
  <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
    Track expenses, set budgets, and achieve your financial goals with ExpenseWise - 
    the smart expense tracker that grows with you.
  </p>
);

const CTAButtons = ({ isAuthenticated, navigate }) => (
  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
    <button 
      onClick={() => navigate(isAuthenticated ? '/expenses' : '/login')}
      className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-professional-lg hover:shadow-2xl transition-all duration-300 px-8 py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 group btn-professional hover:scale-105 cursor-pointer">
      {isAuthenticated ? 'Add Expense' : 'Start Free Trial'}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </button>
    {isAuthenticated && (
      <button 
        onClick={() => navigate('/expense-list')}
        className="w-full sm:w-auto border-2 border-border hover:border-primary hover:bg-primary/10 px-8 py-3 rounded-xl font-semibold text-base transition-all duration-300 text-foreground hover:scale-105 flex items-center justify-center gap-2 group cursor-pointer">
        Dashboard
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    )}
  </div>
);

const TrustBadges = () => (
  <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-muted-foreground">
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-500" />
      <span>No credit card required</span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-500" />
      <span>14-day free trial</span>
    </div>
    <div className="flex items-center gap-2">
      <CheckCircle className="w-5 h-5 text-green-500" />
      <span>Cancel anytime</span>
    </div>
  </div>
);

const DashboardCard = ({ icon: Icon, value, label, color, progress }) => (
  <div className="bg-card border-border p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 ${color} rounded-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-2xl font-bold text-foreground">{value}</span>
    </div>
    <p className="text-sm text-muted-foreground">{label}</p>
    <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${progress.gradient} rounded-full`} style={{ width: progress.width }} />
    </div>
  </div>
);

const DashboardPreview = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const monthlyBudget = useSelector((state) => state.user.monthlyBudget);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetchExpenses();
    }
  }, [token]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/expense", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const totalAmount = expenses
    .filter(exp => {
      const expDate = new Date(exp.expenseDate || exp.createdAt);
      return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
    })
    .reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const transactionCount = expenses.length;
  const budgetPercentage = monthlyBudget > 0 ? (totalAmount / monthlyBudget) * 100 : 0;
  
  // Use real data if logged in, otherwise demo data
  const totalExpenseValue = token ? `₹${totalAmount.toFixed(2)}` : "₹49,999";
  const totalExpenseWidth = token ? `${Math.min((totalAmount / 5000) * 100, 100)}%` : "75%";
  const transactionValue = token ? transactionCount.toString() : "142";
  const transactionWidth = token ? `${Math.min((transactionCount / 200) * 100, 100)}%` : "50%";
  const budgetValue = token && monthlyBudget > 0 ? `${Math.min(budgetPercentage, 999).toFixed(0)}%` : token ? "Not Set" : "85%";
  const budgetWidth = token && monthlyBudget > 0 ? `${Math.min(budgetPercentage, 100)}%` : token ? "0%" : "85%";
  
  const getBudgetGradient = () => {
    if (!token) return "from-pink-500 to-red-500";
    if (!monthlyBudget) return "from-gray-500 to-gray-600";
    if (budgetPercentage >= 100) return "from-red-500 to-red-600";
    if (budgetPercentage >= 80) return "from-orange-500 to-red-500";
    if (budgetPercentage >= 60) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-600";
  };

  return (
  <div className="mt-20 relative">
    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none h-32 bottom-0 top-auto" />
    <div className="relative bg-card rounded-2xl shadow-2xl p-2 border border-border">
      <div className="bg-primary/5 rounded-xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard 
            icon={CreditCard}
            value={totalExpenseValue}
            label="Total Expenses"
            color="bg-primary/10 text-primary"
            progress={{ width: totalExpenseWidth, gradient: "from-blue-500 to-purple-500" }}
          />
          <DashboardCard 
            icon={FileText}
            value={transactionValue}
            label="Transactions"
            color="bg-primary/10 text-primary"
            progress={{ width: transactionWidth, gradient: "from-purple-500 to-pink-500" }}
          />
          <DashboardCard 
            icon={Target}
            value={budgetValue}
            label="Budget Used"
            color="bg-primary/10 text-primary"
            progress={{ width: budgetWidth, gradient: getBudgetGradient() }}
          />
        </div>
      </div>
    </div>
  </div>
  );
};

const StatCard = ({ icon: Icon, value, label }) => (
  <div className="text-center group">
    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-3 group-hover:scale-110 transition-transform">
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-3xl font-bold text-foreground mb-1">
      {value}
    </div>
    <div className="text-sm text-muted-foreground">
      {label}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <div className="group p-6 bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-border cursor-pointer">
    <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
      <Icon className="w-7 h-7 text-white" />
    </div>
    <h3 className="text-xl font-semibold text-foreground mb-2">
      {title}
    </h3>
    <p className="text-muted-foreground">
      {description}
    </p>
  </div>
);

const TestimonialCard = ({ testimonial, isActive }) => (
  <div className={`bg-card p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer ${
    isActive 
      ? 'border-primary scale-105' 
      : 'border-border hover:border-primary/50'
  }`}>
    <div className="flex mb-4">
      {[...Array(testimonial.rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
    <p className="text-muted-foreground mb-6 italic">
      "{testimonial.content}"
    </p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
        {testimonial.avatar}
      </div>
      <div>
        <p className="font-semibold text-foreground">
          {testimonial.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {testimonial.role}
        </p>
      </div>
    </div>
  </div>
);

const PricingCard = ({ plan, isAuthenticated, isPremium }) => {
  const navigate = useNavigate();
  const isCurrentPlan = isPremium && plan.highlighted;
  const isDisabled = (!plan.highlighted && isAuthenticated) || isCurrentPlan;
  
  return (
  <div className={`relative p-8 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer flex flex-col ${
    plan.highlighted
      ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl"
      : "bg-card border-2 border-border hover:border-primary shadow-lg"
  }`}>
    {plan.highlighted && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
          {isCurrentPlan ? "CURRENT PLAN" : "MOST POPULAR"}
        </span>
      </div>
    )}
    
    <div className="text-center mb-6">
      <h3 className={`text-2xl font-bold mb-4 ${
        plan.highlighted ? "text-white" : "text-foreground"
      }`}>
        {plan.name}
      </h3>
      
      <div className="flex items-baseline justify-center gap-1">
        <span className={`text-4xl font-bold ${
          plan.highlighted ? "text-white" : "text-foreground"
        }`}>
          {plan.price}
        </span>
        <span className={`text-sm ${
          plan.highlighted ? "text-white/80" : "text-muted-foreground"
        }`}>
          {plan.period}
        </span>
      </div>
    </div>

    <ul className="space-y-3 mb-8 flex-grow">
      {plan.features.map((feature, i) => (
        <li key={i} className="flex items-start gap-2">
          <CheckCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
            plan.highlighted ? "text-white" : "text-green-500"
          }`} />
          <span className={`text-sm ${
            plan.highlighted ? "text-white" : "text-muted-foreground"
          }`}>
            {feature}
          </span>
        </li>
      ))}
    </ul>

    <button 
      onClick={() => !isDisabled && navigate(plan.link)}
      disabled={isDisabled}
      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center group ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${
        plan.highlighted
          ? "bg-white text-blue-600 hover:bg-gray-100"
          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
      }`}>
      {isCurrentPlan ? "Active" : plan.cta}
      {!isCurrentPlan && <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
    </button>
  </div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const isAuthenticated = !!localStorage.getItem('token');
  const isPremium = useSelector((state) => state.user.isPremium);

  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track your spending patterns with interactive charts and insights",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: PieChart,
      title: "Category Breakdown",
      description: "Visualize where your money goes with detailed category analysis",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: TrendingUp,
      title: "Budget Planning",
      description: "Set budgets and get alerts when you're close to limits",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and never shared with third parties",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant expense tracking with real-time synchronization",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Users,
      title: "Multi-user Support",
      description: "Share expenses with family or roommates effortlessly",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Freelancer",
      content: "ExpenseWise has transformed how I manage my business expenses. The insights are invaluable!",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Small Business Owner",
      content: "Finally, an expense tracker that's both powerful and easy to use. Highly recommended!",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Davis",
      role: "Student",
      content: "Perfect for tracking my college budget. The category breakdown helps me save money!",
      rating: 5,
      avatar: "ED"
    }
  ];

  const pricingPlans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "Up to 50 expenses/month",
        "Basic categories",
        "Monthly reports",
        "Mobile app access",
        "Email support"
      ],
      cta: "Get Started",
      highlighted: false,
      link: "/signup"
    },
    {
      name: "Premium",
      price: "₹499",
      period: "per year",
      features: [
        "Unlimited expenses",
        "Custom categories",
        "Advanced analytics",
        "Export to CSV/PDF",
        "Dark/Light theme toggle",
        "Priority support",
        "Cloud backup"
      ],
      cta: "Go Premium",
      highlighted: true,
      link: "/premium"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Expenses Tracked", value: "₹10Cr+", icon: DollarSign },
    { label: "Time Saved", value: "1000+ hrs", icon: Clock },
    { label: "Countries", value: "120+", icon: Globe }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative overflow-hidden bg-background">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.05),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <HeroBadge />
            <HeroTitle />
            <HeroSubtitle />
            <CTAButtons isAuthenticated={isAuthenticated} navigate={navigate} />
            <TrustBadges />
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="relative py-16 bg-muted/30">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      </section>

      <section className="py-20 bg-muted/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Manage Money
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to make expense tracking effortless
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.03),transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our users have to say about ExpenseWise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                isActive={index === activeTestimonial}
              />
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 hover:bg-primary ${
                  index === activeTestimonial 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-primary/30'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 relative">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/5 to-transparent dark:from-purple-500/5 dark:to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground">
              Choose the plan that's right for you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.slice(0, 2).map((plan, index) => (
              <PricingCard key={index} plan={plan} isAuthenticated={isAuthenticated} isPremium={isPremium} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-700 dark:via-purple-700 dark:to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.08),transparent_50%)]" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">
            Ready to Take Control?
          </h2>
          <p className="text-xl text-white/95 mb-8 drop-shadow">
            Join thousands of users who are already managing their expenses smarter
          </p>
          <button 
            onClick={() => navigate(isAuthenticated ? '/expenses' : '/login')}
            className="bg-white text-blue-700 hover:bg-gray-50 shadow-2xl px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 group cursor-pointer">
            {isAuthenticated ? 'Add Expense' : 'Start Your Free Trial'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
