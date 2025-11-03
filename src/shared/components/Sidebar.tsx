import { X } from 'lucide-react';

export type SidebarItem = {
  name: string;
  key: string;
  icon: React.ElementType;
};

type SidebarProps = {
  activeKey: string;
  items: SidebarItem[];
  onChange: (key: string) => void;
  isOpen: boolean;
  onClose: () => void;
};

export const Sidebar = ({ activeKey, items, onChange, isOpen, onClose }: SidebarProps) => {

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
          {items.map((item) => {
            const isActive = activeKey === item.key;
            const Icon = item.icon;

            return (
              <button
                key={item.key}
                onClick={() => onChange(item.key)}
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
      </div>
    </aside>
  );
};
