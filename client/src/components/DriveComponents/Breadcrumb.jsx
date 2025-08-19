import React from 'react';

const Breadcrumb = ({ breadcrumbs, onNavigate }) => {
    return (
        <nav className="flex items-center space-x-2 px-4 py-3 bg-white/10 dark:bg-black/10 backdrop-blur-md rounded-lg border border-white/20 dark:border-white/10">
            {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={breadcrumb.id || 'root'}>
                    {index > 0 && (
                        <svg className="w-4 h-4 text-text-light/50 dark:text-text-dark/50" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 6l6 6-6 6"/>
                        </svg>
                    )}
                    <button
                        onClick={() => onNavigate(breadcrumb)}
                        disabled={index === breadcrumbs.length - 1}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-300 ${
                            index === breadcrumbs.length - 1
                                ? 'text-primary cursor-default'
                                : 'text-text-light/70 dark:text-text-dark/70 hover:text-primary hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                    >
                        {breadcrumb.name}
                    </button>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
