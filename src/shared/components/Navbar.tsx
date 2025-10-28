import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    document.documentElement.classList.toggle('dark', shouldUseDark);
    setIsDarkMode(shouldUseDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `block px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-[#fca311] dark:text-[#fca311]'
        : 'text-gray-700 dark:text-gray-300 hover:text-[#fca311] dark:hover:text-[#fca311]'
    }`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <NavLink
            to="/"
            className="text-xl font-semibold text-gray-800 dark:text-white hover:text-[#fca311] dark:hover:text-[#fca311] transition-colors"
          >
            Blog
          </NavLink>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink to="/" className={linkClasses}>
              Home
            </NavLink>
            <NavLink to="/2" className={linkClasses}>
              Blog
            </NavLink>
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
              className="p-2 rounded-md text-[#e5e5e5] dark:text-[#e5e5e5] hover:text-[#fca311] dark:hover:text-[#fca311] transition"
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
            <NavLink to="/" className={linkClasses} onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
