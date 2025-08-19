import React, { useState, useEffect } from 'react';

const CreateFolderModal = ({ isOpen, onClose, onCreateFolder }) => {
    const [folderName, setFolderName] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setFolderName('');
            setError('');
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!folderName.trim()) {
            setError('Folder name is required');
            return;
        }

        if (folderName.trim().length < 1) {
            setError('Folder name must be at least 1 character');
            return;
        }

        if (!/^[a-zA-Z0-9\s._-]+$/.test(folderName.trim())) {
            setError('Folder name contains invalid characters');
            return;
        }

        onCreateFolder(folderName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="relative bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
                <h2 className="text-xl font-semibold text-text-light dark:text-text-dark mb-4">
                    Create New Folder
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="folderName" className="block text-sm font-medium text-text-light dark:text-text-dark mb-2">
                            Folder Name
                        </label>
                        <input
                            type="text"
                            id="folderName"
                            value={folderName}
                            onChange={(e) => {
                                setFolderName(e.target.value);
                                setError('');
                            }}
                            placeholder="Enter folder name..."
                            className="w-full px-4 py-3 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-lg text-text-light dark:text-text-dark placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark transition-colors duration-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-primary/80 hover:bg-primary text-white rounded-lg transition-all duration-300 hover:scale-105 font-medium"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateFolderModal;
