import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lightbulb, 
  Home, 
  LogIn, 
  Bell, 
  Settings as SettingsIcon,
  Menu,
  X,
  UserPlus,
  LogOut
} from 'lucide-react';
import { useStore } from '../lib/store';
import { NotificationsPanel } from './NotificationsPanel';
import { SearchBar } from './SearchBar';
import { SkipLink } from './SkipLink';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from './AccessibilityProvider';
import toast from 'react-hot-toast';

export function Layout() {
  const { user, notifications, logout } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { reduceMotion } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
  ];

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await logout();
      setShowMobileMenu(false);
      navigate('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gray-900 grid-pattern">
        <header className="sticky top-0 z-40 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <Lightbulb className="h-8 w-8 text-yellow-500" />
                  <span className="ml-2 text-xl font-bold text-gray-100">GoodAIdeas</span>
                </Link>
                <div className="hidden md:flex ml-8 space-x-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-gray-100"
                          : "text-gray-300 hover:bg-gray-700/30 hover:text-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5 inline-block mr-2" />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Search and Actions */}
              <div className="flex items-center space-x-4">
                <SearchBar />
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-2">
                  {user ? (
                    <>
                      <button
                        onClick={() => setShowNotifications(true)}
                        className="relative p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                      >
                        <Bell className="h-5 w-5" />
                        {notifications?.unread > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                            {notifications.unread}
                          </span>
                        )}
                      </button>
                      <Link
                        to="/settings"
                        className="p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                      >
                        <SettingsIcon className="h-5 w-5" />
                      </Link>
                      <Link
                        to="/profile"
                        className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                      >
                        {user.email?.split('@')[0] || 'Profile'}
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loggingOut ? (
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <LogOut className="h-4 w-4 mr-2" />
                        )}
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link 
                        to="/login"
                        className="inline-flex items-center px-4 py-2 text-gray-300 hover:text-gray-100 transition-colors"
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                      <Link 
                        to="/login?signup=true"
                        className="inline-flex items-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="md:hidden p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                >
                  {showMobileMenu ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
              {showMobileMenu && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden py-4 space-y-2"
                >
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-4 py-2 rounded-lg text-base font-medium transition-colors ${
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-gray-100"
                          : "text-gray-300 hover:bg-gray-700/30 hover:text-gray-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5 inline-block mr-2" />
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-300 hover:text-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-gray-300 hover:text-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="block w-full text-left px-4 py-2 text-gray-300 hover:text-gray-100 disabled:opacity-50"
                      >
                        {loggingOut ? (
                          <div className="h-4 w-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mr-2 inline-block" />
                        ) : (
                          <LogOut className="h-4 w-4 mr-2 inline-block" />
                        )}
                        Logout
                      </button>
                    </>
                  ) : (
                    <div className="px-4 py-2 space-y-2">
                      <Link
                        to="/login"
                        className="block w-full text-center px-4 py-2 text-gray-300 hover:text-gray-100"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <LogIn className="h-4 w-4 mr-2 inline-block" />
                        Login
                      </Link>
                      <Link
                        to="/login?signup=true"
                        className="block w-full text-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <UserPlus className="h-4 w-4 mr-2 inline-block" />
                        Sign Up
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </nav>
        </header>

        <main 
          id="main-content"
          role="main"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
          tabIndex={-1}
        >
          <Outlet />
        </main>

        <footer 
          role="contentinfo"
          className="mt-auto border-t border-gray-800 bg-gray-900"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-gray-400">
              © 2025 GoodAIdeas. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Modals and overlays */}
        <AnimatePresence>
          {showNotifications && (
            <NotificationsPanel onClose={() => setShowNotifications(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}