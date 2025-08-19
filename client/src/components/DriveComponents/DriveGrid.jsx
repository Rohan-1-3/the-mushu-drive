import React from 'react';
import FileItem from './FileItem';

const DriveGrid = ({ items, viewMode, onItemDoubleClick, onItemRightClick, searchTerm }) => {
    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedItems = [...filteredItems].sort((a, b) => {
        // Folders first, then files
        if (a.type === 'folder' && b.type === 'file') return -1;
        if (a.type === 'file' && b.type === 'folder') return 1;
        // Then alphabetically
        return a.name.localeCompare(b.name);
    });

    if (sortedItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-6xl mb-4 opacity-50">📁</div>
                <h3 className="text-lg font-medium text-text-light dark:text-text-dark mb-2">
                    {searchTerm ? 'No results found' : 'This folder is empty'}
                </h3>
                <p className="text-text-light/60 dark:text-text-dark/60 max-w-md">
                    {searchTerm 
                        ? `No files or folders match "${searchTerm}"`
                        : 'Upload files or create folders to get started'
                    }
                </p>
            </div>
        );
    }

    if (viewMode === 'list') {
        return (
            <div className="space-y-1">
                {/* Header */}
                <div className="flex items-center gap-4 px-3 py-2 text-sm font-medium text-text-light/70 dark:text-text-dark/70 border-b border-white/20 dark:border-white/10">
                    <div className="flex items-center gap-3 flex-1">Name</div>
                    <div className="w-20 text-right">Size</div>
                    <div className="w-24 text-right">Modified</div>
                    <div className="w-8"></div>
                </div>

                {/* Items */}
                <div className="space-y-1">
                    {sortedItems.map((item) => (
                        <FileItem
                            key={item.id}
                            item={item}
                            viewMode={viewMode}
                            onDoubleClick={onItemDoubleClick}
                            onRightClick={onItemRightClick}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {sortedItems.map((item) => (
                <FileItem
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    onDoubleClick={onItemDoubleClick}
                    onRightClick={onItemRightClick}
                />
            ))}
        </div>
    );
};

export default DriveGrid;
