import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from '../components/AuthenticationComponents/LoginPage';
import RegisterPage from '../components/AuthenticationComponents/RegisterPage';

function AuthenticationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Determine if we're on register page based on URL
    const isRegisterPage = location.pathname === '/register';
    
    // Default to login if neither
    const [currentView, setCurrentView] = useState(
        isRegisterPage ? 'register' : 'login'
    );

    // Sync component state with URL changes
    useEffect(() => {
        if (location.pathname === '/register') {
            setCurrentView('register');
        } else if (location.pathname === '/login') {
            setCurrentView('login');
        }
    }, [location.pathname]);

    const switchToLogin = () => {
        if (currentView !== 'login') {
            setCurrentView('login');
            navigate('/login');
        }
    };

    const switchToRegister = () => {
        if (currentView !== 'register') {
            setCurrentView('register');
            navigate('/register');
        }
    };

    return (
        <div className="min-h-screen w-full bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">

            {/* Navigation Header */}
            <nav className="relative z-10 w-full px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo */}
                    <div 
                        className="flex items-center space-x-2 cursor-pointer" 
                        onClick={() => navigate('/')}
                    >
                        <div className="w-8 h-8 rotate-45 rounded-sm shadow-lg bg-primary"></div>
                        <span className="font-bold tracking-widest text-xl">MINI DRIVE</span>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex bg-white/10 dark:bg-black/20 backdrop-blur-sm rounded-full p-1 border border-white/20 dark:border-white/10">
                        <button
                            onClick={switchToLogin}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500 ease-out transform ${
                                currentView === 'login'
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:scale-102 scale-100'
                            }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={switchToRegister}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-500 ease-out transform ${
                                currentView === 'register'
                                    ? 'bg-primary text-white shadow-lg scale-105'
                                    : 'text-text-light/70 dark:text-text-dark/70 hover:text-text-light dark:hover:text-text-dark hover:scale-102 scale-100'
                            }`}
                        >
                            Register
                        </button>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="relative z-10 flex justify-center min-h-[calc(100vh-80px)] px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Animated Container */}
                    <div className="relative min-h-[600px]">
                        {/* Login Form */}
                        <div 
                            className={`absolute inset-0 transform transition-all duration-700 ease-in-out ${
                                currentView === 'login' 
                                    ? 'translate-x-0 opacity-100 scale-100' 
                                    : '-translate-x-full opacity-0 scale-95 pointer-events-none'
                            }`}
                        >
                            <LoginPage />
                        </div>
                        
                        {/* Register Form */}
                        <div 
                            className={`absolute inset-0 transform transition-all duration-700 ease-in-out ${
                                currentView === 'register' 
                                    ? 'translate-x-0 opacity-100 scale-100' 
                                    : 'translate-x-full opacity-0 scale-95 pointer-events-none'
                            }`}
                        >
                            <RegisterPage />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default AuthenticationPage;