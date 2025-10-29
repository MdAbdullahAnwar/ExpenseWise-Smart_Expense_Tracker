import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  Home,
  PlusCircle,
  List,
  User,
  Moon,
  Sun,
  Crown,
  LogOut,
  Wallet,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { Button } from "../ui/button";

export default function Header({ isAuthenticated, userInfo, setUserInfo, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const isPremium = useSelector((state) => state.user.isPremium);

  const handleLogout = () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    onLogout();
    navigate("/");
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/expenses", label: "Add Expense", icon: PlusCircle },
    { path: "/expense-list", label: "Expense List", icon: List },
    ...(isPremium ? [{ path: "/analyse", label: "Analyse Expenses", icon: BarChart3 }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ExpenseWise
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 -mt-1">
                Smart Expense Tracker
              </span>
            </div>
          </Link>

          {isAuthenticated ? (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}

              {isPremium && (
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105 transition-all duration-200 cursor-pointer"
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? (
                    <Moon className="w-4 h-4" />
                  ) : (
                    <Sun className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Premium Button - shows status */}
              {userInfo?.isPremium ? (
                <Link to="/premium" className="ml-2 cursor-pointer">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg cursor-pointer">
                    <Crown className="w-4 h-4" />
                    <span>Premium Member</span>
                  </Button>
                </Link>
              ) : (
                <Link to="/premium" className="ml-2 cursor-pointer">
                  <Button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer">
                    <Crown className="w-4 h-4" />
                    <span>Go Premium</span>
                  </Button>
                </Link>
              )}

              <div ref={dropdownRef} className="relative ml-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {userInfo?.name || "User"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/profile"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      View Profile
                    </Link>
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>
          ) : (
            <nav className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" className="border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-all cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
                  Sign Up
                </Button>
              </Link>
            </nav>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all cursor-pointer ${
                        isActive(item.path)
                          ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-blue-400"
                          : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
                
                {isPremium && (
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left transition-colors cursor-pointer"
                  >
                    {theme === "light" ? (
                      <>
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-5 h-5" />
                        <span>Light Mode</span>
                      </>
                    )}
                  </button>
                )}

                {/* Mobile Premium Button - shows status */}
                {userInfo?.isPremium ? (
                  <Link
                    to="/premium"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors cursor-pointer"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Premium Member</span>
                  </Link>
                ) : (
                  <Link
                    to="/premium"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer"
                  >
                    <Crown className="w-5 h-5" />
                    <span>Go Premium</span>
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2 pt-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {userInfo?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{userInfo?.name || "User"}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">View Profile</p>
                  </div>
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors font-medium cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all shadow-lg font-medium cursor-pointer"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
