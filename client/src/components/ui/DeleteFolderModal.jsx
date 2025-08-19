import React, { useState, useEffect, useCallback } from 'react';
import { folderApi } from '../../lib/api';

const DeleteFolderModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  folder
}) => {
  const [loading, setLoading] = useState(false);
  const [folderContents, setFolderContents] = useState(null);
  const [forceDelete, setForceDelete] = useState(false);
  const [error, setError] = useState(null);

  const loadFolderContents = useCallback(async () => {
    if (!folder) return;
    
    setLoading(true);
    setError(null);
    try {
      const contents = await folderApi.getFolderContents(folder.id);
      setFolderContents(contents);
    } catch (error) {
      console.error('Failed to load folder contents:', error);
      setError('Failed to load folder contents');
    } finally {
      setLoading(false);
    }
  }, [folder]);

  useEffect(() => {
    if (isOpen && folder) {
      loadFolderContents();
    }
  }, [isOpen, folder, loadFolderContents]);

  const handleConfirm = () => {
    onConfirm(forceDelete);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getTotalItems = () => {
    if (!folderContents) return 0;
    return (folderContents.files?.length || 0) + (folderContents.subfolders?.length || 0);
  };

  const hasContents = getTotalItems() > 0;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 shadow-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="text-2xl">🗑️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">
                Delete Folder
              </h3>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-text-light/80 dark:text-text-dark/80 mb-4">
              Are you sure you want to delete <strong>"{folder?.name}"</strong>?
            </p>

            {loading && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="ml-2 text-sm text-text-light/60 dark:text-text-dark/60">
                  Checking folder contents...
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {!loading && !error && folderContents && hasContents && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg">⚠️</span>
                  <div>
                    <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium mb-2">
                      This folder is not empty!
                    </p>
                    <div className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
                      {folderContents.files?.length > 0 && (
                        <p>• {folderContents.files.length} file{folderContents.files.length !== 1 ? 's' : ''}</p>
                      )}
                      {folderContents.subfolders?.length > 0 && (
                        <p>• {folderContents.subfolders.length} subfolder{folderContents.subfolders.length !== 1 ? 's' : ''}</p>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={forceDelete}
                          onChange={(e) => setForceDelete(e.target.checked)}
                          className="w-4 h-4 text-red-600 bg-white border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                        />
                        <span className="text-sm text-yellow-800 dark:text-yellow-200">
                          Force delete (permanently delete all contents)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !error && folderContents && !hasContents && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                <p className="text-green-700 dark:text-green-300 text-sm">
                  ✓ This folder is empty and can be safely deleted.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || (hasContents && !forceDelete)}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200"
            >
              {hasContents && forceDelete ? 'Force Delete' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteFolderModal;
