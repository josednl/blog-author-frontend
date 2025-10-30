import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/shared/components/Sidebar';
// import { UsersPage } from './UserPage';
import { AccessPage } from '@/features/access/pages/AccessPage';

type SidebarSection = 'access' | 'users';

export const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('access');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'access':
        return <AccessPage />;
      case 'users':
        return '<UsersPage />';     
      default:
        return <div className="p-4 text-gray-500">Select a section from the side menu.</div>;
    }
  };

  const handleSidebarChange = (section: SidebarSection) => {
      setActiveSection(section);
      if (isSidebarOpen) {
          setIsSidebarOpen(false); 
      }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
      
      <Sidebar 
        active={activeSection} 
        onChange={handleSidebarChange} 
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
            <h1 className="text-xl font-semibold ml-4 capitalize text-gray-900 dark:text-white">
                {activeSection}
            </h1>
        </div>
        
        <h1 className="text-2xl font-semibold mb-6 capitalize hidden md:block">
            {activeSection}
        </h1>

        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow min-h-[calc(100vh-120px)]">
          {renderSection()}
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
