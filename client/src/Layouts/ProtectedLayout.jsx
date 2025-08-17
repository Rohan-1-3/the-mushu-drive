import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/useAuth.js';
import { authApi } from '../lib/api';

export default function ProtectedLayout() {
//   const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authApi.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark text-text-light dark:text-text-dark">
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link to="/app" className="font-bold tracking-wider flex items-center space-x-2">
          <div className="w-6 h-6 rotate-45 rounded-sm bg-primary" />
          <span>MINI DRIVE</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/app" className="hover:underline">Dashboard</Link>
          <button onClick={handleLogout} className="px-3 py-1 rounded bg-primary text-white hover:bg-accent1 transition">Logout</button>
        </nav>
      </header>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
