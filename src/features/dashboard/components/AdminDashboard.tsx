import { DashboardLayout } from '@/features/dashboard/pages/DashboardLayout';
import { Home, Users, Settings } from 'lucide-react';
import { HomePage } from '@/shared/components/HomePage';
import { UsersPage } from '@/features/user/pages/UserPage';
import { AccessPage } from '@/features/access/pages/AccessPage';

export const AdminDashboard = ({ user }: any) => {
  const sidebarItems = [
    { name: 'Home', key: 'home', icon: Home },
    { name: 'Access & Roles', key: 'access', icon: Settings },
    { name: 'Users', key: 'users', icon: Users },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case 'home': return <HomePage user={user} />;
      case 'access': return <AccessPage />;
      case 'users': return <UsersPage />;
      default: return <div className="p-4 text-gray-500">Select a section.</div>;
    }
  };

  return <DashboardLayout sidebarItems={sidebarItems} renderSection={renderSection} />;
};
