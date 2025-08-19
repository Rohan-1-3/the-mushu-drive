import React from 'react';

const DriveToolbar = ({ 
    viewMode, 
    setViewMode, 
    searchTerm, 
    setSearchTerm, 
    onCreateFolder, 
    onUploadFile 
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white/20 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/30 dark:border-white/10">
            {/* Left side - Create buttons */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={onCreateFolder}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/80 hover:bg-primary text-white rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium"
                >
                    <span>📁</span>
                    New Folder
                </button>
                <button 
                    onClick={onUploadFile}
                    className="flex items-center gap-2 px-4 py-2 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 text-text-light dark:text-text-dark rounded-lg transition-all duration-300 hover:scale-105 text-sm font-medium border border-white/30 dark:border-white/10"
                >
                    <span>⬆️</span>
                    Upload
                </button>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-md w-full">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-text-light/50 dark:text-text-dark/50">🔍</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search files and folders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 rounded-lg text-text-light dark:text-text-dark placeholder-text-light/50 dark:placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                    />
                </div>
            </div>

            {/* Right side - View mode toggle */}
            <div className="flex items-center gap-2 bg-white/10 dark:bg-black/10 rounded-lg p-1">
                <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === 'grid' 
                            ? 'bg-primary text-white shadow-lg' 
                            : 'text-text-light/70 dark:text-text-dark/70 hover:bg-white/20 dark:hover:bg-white/10'
                    }`}
                    title="Grid view"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/>
                    </svg>
                </button>
                <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all duration-300 ${
                        viewMode === 'list' 
                            ? 'bg-primary text-white shadow-lg' 
                            : 'text-text-light/70 dark:text-text-dark/70 hover:bg-white/20 dark:hover:bg-white/10'
                    }`}
                    title="List view"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z"/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default DriveToolbar;
