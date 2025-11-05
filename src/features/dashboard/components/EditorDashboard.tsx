import { DashboardLayout } from '@/features/dashboard/pages/DashboardLayout';
import { Home, Newspaper, FilePlus } from 'lucide-react';
import { HomePage } from '@/shared/components/HomePage';
import { NewPostPage } from '@/features/post/pages/NewPostPage';
import { ManagePostPage } from '@/features/post/pages/ManagePostPage';

export const EditorDashboard = ({ user }: any) => {
  const sidebarItems = [
    { name: 'Home', key: 'home', icon: Home },
    { name: 'My Posts', key: 'posts', icon: Newspaper },
    { name: 'Create post', key: 'new', icon: FilePlus },
  ];

  const renderSection = (key: string) => {
    switch (key) {
      case 'home': return <HomePage user={user} />;
      case 'posts': return <ManagePostPage userId={user.id} />;
      case 'new': return <NewPostPage userId={user.id}  />;
      default: return <div className="p-4 text-gray-500">Select a section.</div>;
    }
  };

  return <DashboardLayout sidebarItems={sidebarItems} renderSection={renderSection} />;
};
