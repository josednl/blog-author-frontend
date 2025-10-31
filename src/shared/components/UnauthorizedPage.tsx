import { ShieldOff } from 'lucide-react';

export const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="text-center max-w-lg bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl">

        <ShieldOff className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" aria-hidden="true" />

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
          Restricted Access (403)
        </h1>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Your current role does not have permission to access this section of the application.
        </p>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Please log out and log in with a user whose role is permitted (admin, editor).
        </p>
      </div>
    </div>
  );
};
