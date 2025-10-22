import { useEffect } from "react";

interface NotificationProps {
  isOpen: boolean;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  onClose: () => void;
  duration?: number;
}

export const Notification: React.FC<NotificationProps> = ({
  isOpen,
  message,
  type = "info",
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    info: "border-blue-500 bg-blue-500/10",
    success: "border-green-500 bg-green-500/10",
    warning: "border-yellow-500 bg-yellow-500/10",
    error: "border-red-500 bg-red-500/10"
  };

  const typeIcons = {
    info: "💡",
    success: "✅",
    warning: "⚠️",
    error: "❌"
  };

  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-50 max-w-sm mx-auto sm:mx-0">
      <div className={`border rounded-xl p-4 backdrop-blur-sm ${typeStyles[type]} shadow-lg`}>
        <div className="flex items-center gap-3">
          <div className="text-lg">{typeIcons[type]}</div>
          <p className="text-white text-sm flex-1">{message}</p>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-lg"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};