import React, { useState } from 'react';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarItems = [
        { icon: '🏠', label: 'Home', href: '#' },
        { icon: '📁', label: 'My Files', href: '#' },
        { icon: '☁️', label: 'Cloud Storage', href: '#' },
        { icon: '🔗', label: 'Shared Links', href: '#' },
        { icon: '📊', label: 'Analytics', href: '#' },
        { icon: '⚙️', label: 'Settings', href: '#' },
        { icon: '❓', label: 'Help', href: '#' },
    ];

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="fixed top-4 left-4 z-[60] p-3 rounded-xl bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-white/10 shadow-lg hover:bg-white/30 dark:hover:bg-black/30 transition-all duration-300 transform hover:scale-105"
                aria-label="Toggle Sidebar"
            >
                <div className="w-6 h-6 flex flex-col justify-center items-center">
                    <span className={`block w-5 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
                    <span className={`block w-5 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-5 h-0.5 bg-text-light dark:bg-text-dark transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
                </div>
            </button>

            {/* Backdrop Overlay */}
            <div 
                className={`fixed inset-0 z-[51] bg-black/20 backdrop-blur-sm transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 z-[52] h-full w-80 transform transition-all duration-300 ease-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Glassmorphism Container */}
                <div className="h-full bg-white/10 dark:bg-black/20 backdrop-blur-xl border-r border-white/20 dark:border-white/10 shadow-2xl">
                    {/* Header */}
                    <div className="p-6 border-b border-white/20 dark:border-white/10">
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rotate-45 rounded-sm shadow-lg bg-primary"></div>
                            <h2 className="text-xl font-bold text-text-light dark:text-text-dark">MINI DRIVE</h2>
                        </div>
                    </div>

                    {/* Navigation Items */}
                    <nav className="p-4">
                        <ul className="space-y-2">
                            {sidebarItems.map((item, index) => (
                                <li key={index}>
                                    <a
                                        href={item.href}
                                        className="flex items-center space-x-3 px-4 py-3 rounded-xl text-text-light dark:text-text-dark hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group"
                                    >
                                        <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                            {item.icon}
                                        </span>
                                        <span className="font-medium group-hover:text-primary dark:group-hover:text-accent2-dark transition-colors duration-300">
                                            {item.label}
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Storage Info Card */}
                    <div className="mx-4 mt-8 p-4 rounded-xl bg-white/10 dark:bg-white/5 backdrop-blur-sm border border-white/20 dark:border-white/10">
                        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-2">Storage Usage</h3>
                        <div className="w-full bg-white/20 dark:bg-white/10 rounded-full h-2 mb-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <p className="text-xs text-text-light/70 dark:text-text-dark/70">6.5 GB of 10 GB used</p>
                        <button className="mt-3 w-full py-2 px-4 bg-primary/80 hover:bg-primary text-white text-sm font-medium rounded-lg transition-all duration-300 hover:scale-105">
                            Upgrade Storage
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20 dark:border-white/10">
                        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/10 dark:bg-white/5 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent1 flex items-center justify-center text-white font-bold text-sm">
                                JD
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium text-text-light dark:text-text-dark">John Doe</p>
                                <p className="text-xs text-text-light/60 dark:text-text-dark/60">john@example.com</p>
                            </div>
                            <div className="text-text-light/60 dark:text-text-dark/60">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
