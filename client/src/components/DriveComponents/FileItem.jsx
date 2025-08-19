import React from 'react';

const FileItem = ({ item, viewMode, onDoubleClick, onRightClick }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleDoubleClick = () => {
        onDoubleClick(item);
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        onRightClick && onRightClick(e, item);
    };

    if (viewMode === 'list') {
        return (
            <div
                className="flex items-center gap-4 p-3 hover:bg-white/20 dark:hover:bg-white/10 rounded-lg transition-all duration-300 cursor-pointer group border border-transparent hover:border-white/30 dark:hover:border-white/10"
                onDoubleClick={handleDoubleClick}
                onContextMenu={handleContextMenu}
            >
                {/* Icon and Name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-text-light dark:text-text-dark truncate group-hover:text-primary transition-colors duration-300">
                            {item.name}
                        </p>
                        {item.shared && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className="text-xs text-primary">🔗</span>
                                <span className="text-xs text-text-light/60 dark:text-text-dark/60">Shared</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Size */}
                <div className="w-20 text-right">
                    <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                        {item.size || '—'}
                    </p>
                </div>

                {/* Date Modified */}
                <div className="w-24 text-right">
                    <p className="text-sm text-text-light/70 dark:text-text-dark/70">
                        {formatDate(item.dateModified)}
                    </p>
                </div>

                {/* Actions */}
                <div className="w-8 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={handleContextMenu} className="p-1 hover:bg-white/30 dark:hover:bg-white/20 rounded text-text-light/70 dark:text-text-dark/70 hover:text-primary transition-all duration-300">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div
            className="group relative bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-xl border border-white/20 dark:border-white/10 hover:border-white/40 dark:hover:border-white/20 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
            onDoubleClick={handleDoubleClick}
            onContextMenu={handleContextMenu}
        >
            <div className="p-4 text-center">
                {/* Icon */}
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                </div>

                {/* Name */}
                <h3 className="text-sm font-medium text-text-light dark:text-text-dark mb-1 truncate group-hover:text-primary transition-colors duration-300">
                    {item.name}
                </h3>

                {/* Size and Date */}
                <div className="text-xs text-text-light/60 dark:text-text-dark/60 space-y-1">
                    {item.size && <p>{item.size}</p>}
                    <p>{formatDate(item.dateModified)}</p>
                </div>

                {/* Shared indicator */}
                {item.shared && (
                    <div className="absolute top-2 right-2 bg-primary/20 backdrop-blur-sm rounded-full p-1">
                        <span className="text-xs">🔗</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileItem;
