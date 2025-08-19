import React from 'react';

const ContextMenu = ({ isVisible, position, item, onClose, onAction }) => {
    if (!isVisible || !item) return null;

    const menuItems = [
        { label: 'Open', icon: '👁️', action: 'open' },
        { label: 'Download', icon: '⬇️', action: 'download' },
        { label: 'Share', icon: '🔗', action: 'share' },
        { label: 'Rename', icon: '✏️', action: 'rename' },
        { label: 'Move', icon: '📋', action: 'move' },
        { label: 'Copy', icon: '📄', action: 'copy' },
        { type: 'divider' },
        { label: 'Delete', icon: '🗑️', action: 'delete', danger: true }
    ];

    const handleAction = (action) => {
        onAction(action, item);
        onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 z-40"
                onClick={onClose}
            />
            
            {/* Context Menu */}
            <div
                className="fixed z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-lg shadow-2xl py-2 min-w-48"
                style={{
                    left: position.x,
                    top: position.y,
                }}
            >
                {menuItems.map((menuItem, index) => (
                    menuItem.type === 'divider' ? (
                        <div key={index} className="h-px bg-white/20 dark:bg-white/10 my-2 mx-2" />
                    ) : (
                        <button
                            key={index}
                            onClick={() => handleAction(menuItem.action)}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all duration-200 ${
                                menuItem.danger
                                    ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                                    : 'text-text-light dark:text-text-dark hover:bg-white/30 dark:hover:bg-white/10'
                            }`}
                        >
                            <span className="text-base">{menuItem.icon}</span>
                            <span className="font-medium">{menuItem.label}</span>
                        </button>
                    )
                ))}
            </div>
        </>
    );
};

export default ContextMenu;
