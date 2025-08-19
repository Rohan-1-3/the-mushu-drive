import React from 'react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message, 
  confirmText = "Confirm", 
  cancelText = "Cancel",
  type = "danger" // 'danger', 'warning', 'info'
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          button: 'bg-red-500 hover:bg-red-600 text-white',
          icon: '⚠️',
          iconBg: 'bg-red-100 dark:bg-red-900/30'
        };
      case 'warning':
        return {
          button: 'bg-yellow-500 hover:bg-yellow-600 text-white',
          icon: '⚠️',
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/30'
        };
      default:
        return {
          button: 'bg-blue-500 hover:bg-blue-600 text-white',
          icon: 'ℹ️',
          iconBg: 'bg-blue-100 dark:bg-blue-900/30'
        };
    }
  };

  const styles = getTypeStyles();

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
              <span className="text-2xl">{styles.icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                {title}
              </h3>
            </div>
          </div>
          
          <p className="text-text-light/80 dark:text-text-dark/80 mb-6">
            {message}
          </p>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
