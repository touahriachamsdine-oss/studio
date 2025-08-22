

'use client';

import * as React from 'react';
import { AdminDashboard } from '@/components/admin-dashboard';
import { AdminLogin } from '@/components/admin-login';
import { PageHeader } from '@/components/page-header';

const ADMIN_CODE = 'IEATASS';
const STORAGE_KEY = 'admin-authenticated';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const storedAuth = localStorage.getItem(STORAGE_KEY);
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (code: string) => {
    if (code === ADMIN_CODE) {
      localStorage.setItem(STORAGE_KEY, 'true');
      setIsAuthenticated(true);
    } else {
      alert('Incorrect access code.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Panel"
        description="Manage events, venues, and other application content."
      />
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  );
}
