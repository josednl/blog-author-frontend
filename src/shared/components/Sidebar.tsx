import { Settings, Users, Home, X } from 'lucide-react';

type SidebarSection = 'users' | 'access';

type AdminSidebarProps = {
  active: SidebarSection;
  onChange: (section: SidebarSection) => void;
  isOpen: boolean;
  onClose: () => void;
};
const navItems = [
  {
    name: 'Access and roles',
    section: 'access' as SidebarSection,
    icon: Settings,
  },
  {
    name: 'Users',
    section: 'users' as SidebarSection,
    icon: Users,
  },
];

export const Sidebar = ({ active, onChange, isOpen, onClose }: AdminSidebarProps) => {

  const baseClasses = 'flex items-center p-3 rounded-lg transition-all duration-200 text-sm font-medium';

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full 
        transform transition-transform duration-300 
        w-64 flex-shrink-0 
        z-40  
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800
        
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:relative md:translate-x-0 md:shadow-none
      `}
    >
      <div className="flex flex-col h-full p-4">

        <div className="flex justify-between items-center mb-8 p-2">
          <h2 className="text-2xl font-bold text-accent dark:text-accent">Admin Panel</h2>
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Cerrar menú"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="space-y-2 flex-grow">
          {navItems.map((item) => {
            const isActive = active === item.section;
            const Icon = item.icon;

            return (
              <button
                key={item.section}
                onClick={() => onChange(item.section)}
                className={`${baseClasses} w-full text-left focus:outline-none focus:ring-2 focus:ring-accent focus:ring-opacity-50`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-accent' : 'text-gray-500 dark:text-gray-400'}`} />
                <span className={isActive
                  ? 'text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }>
                  {item.name}
                </span>
                {isActive && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-accent"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
                onClick={() => console.log('Back to Home')}
                className={`${baseClasses} w-full text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800`}
            >
                <Home className="w-5 h-5 mr-3 text-gray-500 dark:text-gray-400" />
                <span>Back to Home</span>
            </button>
        </div> */}

      </div>
    </aside>
  );
};
