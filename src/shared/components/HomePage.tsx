import { LayoutDashboard, Users, Zap, ShieldOff } from 'lucide-react';

export const HomePage = ({ user }: any) => {
  const displayName = user?.email || 'Guest';
  const roleName = (user?.roleName || 'User').charAt(0).toUpperCase() + (user?.roleName || 'User').slice(1);
  const isAdmin = user?.roleName === 'admin';

  const cards = isAdmin ? [
    {
      title: 'Full Access Control',
      description: 'Manage users, roles, and permissions across the entire system.',
      icon: Users,
      color: 'bg-indigo-50 dark:bg-indigo-900/30 border-indigo-500 text-indigo-600 dark:text-indigo-400',
    },
    {
      title: 'Global Administration',
      description: 'Access all configuration and moderation tools.',
      icon: Zap,
      color: 'bg-green-50 dark:bg-green-900/30 border-green-500 text-green-600 dark:text-green-400',
    },
  ] : [
    {
      title: 'Content Management',
      description: 'Access tools for creating, editing, and publishing content.',
      icon: LayoutDashboard,
      color: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Review Status',
      description: 'Track the status of your submissions and publications.',
      icon: ShieldOff,
      color: 'bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-400',
    }
  ];

  return (
    <div className="p-4 sm:p-8 bg-white dark:bg-gray-900 rounded-xl border-gray-100 dark:border-gray-700">
      
      <div className="max-w-4xl mx-auto text-center">
        
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
          ¡Welcome, {displayName.split('@')[0]}!
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          You are logged in with the role **{roleName}**.
          Use the side menu to access the features.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`p-6 rounded-lg shadow-md flex flex-col items-center border-t-4 transition-shadow hover:shadow-xl ${card.color.split(' ').filter(c => !c.includes('text-')).join(' ')}`}>
                <Icon className={`w-8 h-8 mb-3 ${card.color.split(' ').filter(c => c.includes('text-')).join(' ')}`} />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};
