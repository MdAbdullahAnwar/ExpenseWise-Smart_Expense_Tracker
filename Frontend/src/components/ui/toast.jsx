import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const toastConfig = {
    success: {
      icon: CheckCircle,
      bgColor: "bg-gradient-to-r from-green-500 to-emerald-600",
      borderColor: "border-green-400",
      iconColor: "text-white"
    },
    error: {
      icon: XCircle,
      bgColor: "bg-gradient-to-r from-red-500 to-red-600",
      borderColor: "border-red-400",
      iconColor: "text-white"
    },
    warning: {
      icon: AlertCircle,
      bgColor: "bg-gradient-to-r from-amber-500 to-orange-500",
      borderColor: "border-amber-400",
      iconColor: "text-white"
    },
    info: {
      icon: Info,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
      borderColor: "border-blue-400",
      iconColor: "text-white"
    }
  };

  const config = toastConfig[type] || toastConfig.success;
  const Icon = config.icon;

  return (
    <div className="fixed top-5 right-5 z-50 animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-professional-lg text-white border ${config.bgColor} ${config.borderColor} backdrop-blur-sm max-w-sm`}>
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
