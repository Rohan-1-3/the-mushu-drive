import React from 'react';
import Sidebar from '../components/ui/Sidebar';

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <Sidebar />
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="text-text-light/70 dark:text-text-dark/70">You are authenticated. Build your file drive here.</p>
    </div>
  );
}
