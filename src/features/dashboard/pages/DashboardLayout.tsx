import { useState, ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar, SidebarItem } from '@/shared/components/Sidebar';

type DashboardLayoutProps = {
  sidebarItems: SidebarItem[];
  renderSection: (activeKey: string) => ReactNode;
  initialSection?: string;
};

export const DashboardLayout = ({ sidebarItems, renderSection, initialSection }: DashboardLayoutProps) => {
  const [activeKey, setActiveKey] = useState(initialSection || sidebarItems[0].key);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar
        items={sidebarItems}
        activeKey={activeKey}
        onChange={(key) => {
          setActiveKey(key);
          setIsSidebarOpen(false);
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 p-6 overflow-auto">
        <div className="flex items-center mb-6 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className='p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition'
            aria-label='Open navigation menu'
          >
            <Menu className='w-6 h-6' />
          </button>
          <h1 className="text-xl font-semibold ml-4 capitalize text-gray-900 dark:text-white">{activeKey}</h1>
        </div>

        <h1 className="text-2xl font-semibold mb-6 capitalize hidden md:block">{activeKey}</h1>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-h-[calc(100vh-120px)]">
          {renderSection(activeKey)}
        </div>
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
