import React, { useState } from 'react';
import { sidebarItems } from '../../data';

function Sidebar({ onLogout }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside className={`bg-white/10 dark:bg-black/20 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${isOpen ? 'w-80' : 'w-16'
            }`}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-white/20 dark:border-white/10">
                    <div className="flex items-center space-x-3">
                        {/* Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105"
                            aria-label="Toggle Sidebar"
                        >
                            <div className="w-5 h-5 flex flex-col justify-center items-center">
                                <span className={`block w-4 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                                <span className={`block w-4 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-4 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-2">
                        {sidebarItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="flex items-center space-x-3 px-3 py-3 rounded-xl text-text-light dark:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group"
                                    title={!isOpen ? item.label : undefined}
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                                        {item.icon}
                                    </span>
                                    {isOpen && (
                                        <span className="font-medium group-hover:text-primary dark:group-hover:text-accent2-dark transition-colors duration-300 whitespace-nowrap overflow-hidden">
                                            {item.label}
                                        </span>
                                    )}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* Storage Info Card - Only show when open */}
                {/* {isOpen && (
                    <div className="mx-4 mb-4 p-4 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">Storage Usage</h3>
                        <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2 mb-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-text-light/70 dark:text-text-dark/70">6.5 GB of 10 GB used</p>
                        <button className="mt-3 w-full py-2 px-4 bg-primary/80 hover:bg-primary text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105">
                            Upgrade Storage
                        </button>
                    </div>
                )} */}

                {/* Logout Button */}
                <div className="p-4 border-t border-white/20 dark:border-white/10">
                    <button
                        onClick={onLogout}
                        className={`flex items-center space-x-3 px-3 py-3 rounded-xl text-text-light dark:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group ${
                            !isOpen ? 'justify-center' : 'space-x-3'
                        }`}
                        title={!isOpen ? 'Logout' : undefined}
                    >
                        <span className="text-2xl flex-shrink-0 w-8 h-8 flex items-center justify-center">🚪</span>
                        {isOpen && (
                            <span className="font-medium whitespace-nowrap">
                                Logout
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
