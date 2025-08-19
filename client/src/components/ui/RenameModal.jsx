import React, { useState, useEffect } from 'react';

const RenameModal = ({ 
  isOpen, 
  onClose, 
  onRename, 
  currentName = "", 
  title = "Rename Item",
  placeholder = "Enter new name"
}) => {
  const [newName, setNewName] = useState(currentName);

  useEffect(() => {
    if (isOpen) {
      setNewName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim() && newName.trim() !== currentName) {
      onRename(newName.trim());
      onClose();
    }
  };

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
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <span className="text-2xl">✏️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                {title}
              </h3>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-light/80 dark:text-text-dark/80 mb-2">
              New name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 bg-white/20 dark:bg-black/20 border border-white/30 dark:border-white/20 rounded-lg text-text-light dark:text-text-dark placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              autoFocus
            />
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim() || newName.trim() === currentName}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              Rename
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RenameModal;
