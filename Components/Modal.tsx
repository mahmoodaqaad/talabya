import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "confirm" | "alert" | "success" | "error";
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "alert",
  onConfirm,
  confirmText = "تأكيد",
  cancelText = "إلغاء",
}: ModalProps) {
  if (!isOpen) return null;

  const getConfirmButtonColor = () => {
    switch (type) {
      case "confirm":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "success":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "error":
        return "bg-red-500 hover:bg-red-600 text-white";
      default:
        return "bg-orange-500 hover:bg-orange-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-right transform transition-all scale-100" dir="rtl">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          {type === "confirm" ? (
            <>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className={`${getConfirmButtonColor()} font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer`}
              >
                {confirmText}
              </button>
              <button
                onClick={onClose}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer"
              >
                {cancelText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className={`${getConfirmButtonColor()} font-bold px-4 py-2 rounded-xl text-xs transition-all cursor-pointer`}
            >
              حسناً
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
