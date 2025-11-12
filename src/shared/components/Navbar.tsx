import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/features/auth/provider/AuthProvider';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle('dark', darkMode);
    setIsDarkMode(darkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const renderProfileImage = () => {
    if (!user) return null;

    let imageUrl: string | null = null;
    if (user.profilePicUrl) {
      imageUrl = user.profilePicUrl.startsWith('http')
        ? user.profilePicUrl
        : `${import.meta.env.VITE_API_URL || ''}${user.profilePicUrl}`;
    }

    const placeholderClasses =
      'w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center';

    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-7 h-7 rounded-full object-cover border-2 border-accent dark:border-indigo-400"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              'https://via.placeholder.com/150?text=No+Photo';
          }}
        />
      );
    }

    return (
      <div className={placeholderClasses}>
        <UserIcon className="w-4 h-4" />
      </div>
    );
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-accent dark:text-accent'
        : 'text-gray-700 dark:text-gray-300 hover:text-accent dark:hover:text-accent'
    }`;

  return (
    <header className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="text-xl font-semibold text-gray-800 dark:text-white hover:text-accent dark:hover:text-accent transition-colors"
          >
            Blog
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <NavLink to="/" className={linkClasses}>
                  Home
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-1 ${linkClasses({ isActive })}`
                  }
                  title="My Profile"
                >
                  {renderProfileImage()}
                  <span>Profile</span>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md bg-accent text-dark font-medium hover:opacity-90 transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClasses}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={linkClasses}>
                  Register
                </NavLink>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-accent dark:hover:text-accent transition"
              aria-label="Toggle Menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="mt-2 space-y-1 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 rounded-md shadow-sm py-2">
            {user ? (
              <>
                <NavLink
                  to="/"
                  className={linkClasses}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </NavLink>

                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `flex items-center gap-1 ${linkClasses({ isActive })}`
                  }
                  title="My Profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {renderProfileImage()}
                  <span>Profile</span>
                </NavLink>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-md bg-accent text-dark font-medium hover:opacity-90 transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClasses}>
                  Log in
                </NavLink>
                <NavLink to="/register" className={linkClasses}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
