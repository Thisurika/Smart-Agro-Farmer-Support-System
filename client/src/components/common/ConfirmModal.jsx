import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiTrash2, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';

/**
 * ConfirmModal — a premium, animated confirmation dialog.
 *
 * Props:
 *  - isOpen:       boolean  — whether the modal is visible
 *  - onClose:      fn       — called when user cancels / clicks backdrop
 *  - onConfirm:    fn       — called when user confirms action
 *  - title:        string   — modal heading               (default "Are you sure?")
 *  - message:      string   — description text             (default "")
 *  - confirmText:  string   — confirm button label         (default "Confirm")
 *  - cancelText:   string   — cancel button label          (default "Cancel")
 *  - variant:      string   — "danger" | "warning" | "info" | "success"  (default "danger")
 *  - icon:         node     — optional custom icon override
 *  - isLoading:    boolean  — shows spinner on confirm btn (default false)
 */
const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = '',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  icon,
  isLoading = false,
}) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.(); };
    if (isOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const variantConfig = {
    danger: {
      icon: <FiTrash2 className="text-2xl" />,
      iconBg: 'bg-red-100 dark:bg-red-900/40',
      iconColor: 'text-red-600 dark:text-red-400',
      confirmBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      ringGlow: 'shadow-red-500/20',
    },
    warning: {
      icon: <FiAlertTriangle className="text-2xl" />,
      iconBg: 'bg-amber-100 dark:bg-amber-900/40',
      iconColor: 'text-amber-600 dark:text-amber-400',
      confirmBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
      ringGlow: 'shadow-amber-500/20',
    },
    info: {
      icon: <FiInfo className="text-2xl" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
      confirmBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      ringGlow: 'shadow-blue-500/20',
    },
    success: {
      icon: <FiCheckCircle className="text-2xl" />,
      iconBg: 'bg-green-100 dark:bg-green-900/40',
      iconColor: 'text-green-600 dark:text-green-400',
      confirmBg: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
      ringGlow: 'shadow-green-500/20',
    },
  };

  const config = variantConfig[variant] || variantConfig.danger;
  const displayIcon = icon || config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl ${config.ringGlow} border border-gray-200 dark:border-gray-800 overflow-hidden`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <FiX className="text-lg" />
            </button>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
                  className={`w-16 h-16 rounded-full ${config.iconBg} ${config.iconColor} flex items-center justify-center shadow-inner`}
                >
                  {displayIcon}
                </motion.div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold font-heading text-center text-neutral-900 dark:text-white mb-2">
                {title}
              </h3>

              {/* Message */}
              {message && (
                <p className="text-sm text-center text-gray-500 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">
                  {message}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8 flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-neutral-800 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 active:scale-[0.98]"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 px-4 py-3 text-sm font-semibold rounded-xl text-white ${config.confirmBg} transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
