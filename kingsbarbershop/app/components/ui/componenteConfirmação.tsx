import Button from "./Button";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "info" | "warning" | "error";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  type = "info"
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    info: "border-blue-500",
    warning: "border-yellow-500",
    error: "border-red-500"
  };

  const typeIcons = {
    info: "💡",
    warning: "⚠️",
    error: "❌"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-gradient-to-br from-[#1A1A1A] to-[#2A2A2A] border-2 ${typeStyles[type]} rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full mx-auto shadow-2xl backdrop-blur-sm`}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">{typeIcons[type]}</div>
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
        </div>

        {/* Message */}
        <p className="text-gray-300 text-sm sm:text-base mb-6 leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onCancel}
            variant="secondary"
            className="flex-1 justify-center px-4 py-3 text-sm sm:text-base"
          >
            <span className="mr-2">↩️</span>
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="primary"
            className={`flex-1 justify-center px-4 py-3 text-sm sm:text-base ${
              type === 'error' ? 'bg-red-600 hover:bg-red-700' : ''
            }`}
          >
            <span className="mr-2">✅</span>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};