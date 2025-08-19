import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/useAuth.js';
import { authApi } from '../lib/api';
import Sidebar from '../components/ui/Sidebar';

export default function ProtectedLayout() {
  //   const { logout } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getCurrentUser();
        console.log('Current User:', response.user);
        setUser(response.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        // If we can't get user data, redirect to login
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  const getInitials = (firstname, lastname) => {
    if (!firstname || !lastname) return 'U';
    return (firstname.charAt(0) + lastname.charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark flex">
      {/* Sidebar */}
      <Sidebar onLogout={handleLogout} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header/Navbar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
          <Link to="/drive" className="font-bold tracking-wider flex items-center space-x-2">
            <div className="w-6 h-6 rotate-45 rounded-sm bg-primary" />
            <span>MINI DRIVE</span>
          </Link>

          <div className="flex items-center space-x-3 px-3 py-2 rounded-xl  transition-all duration-300">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent1 flex items-center justify-center text-white font-bold text-xs">
              {user ? getInitials(user.firstname, user.lastname) : 'U'}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
