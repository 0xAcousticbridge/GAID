import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lightbulb, 
  Home, 
  Search as SearchIcon, 
  User, 
  LogIn, 
  Bell, 
  Plus,
  BarChart2,
  Settings as SettingsIcon,
  Menu,
  X
} from 'lucide-react';
import { useStore } from '../lib/store';
import { NotificationsPanel } from './NotificationsPanel';
import { CreateIdeaModal } from './CreateIdeaModal';
import { SearchBar } from './SearchBar';
import { SkipLink } from './SkipLink';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility } from './AccessibilityProvider';
import { VoiceCommandButton } from './VoiceCommands/VoiceCommandButton';
import { cn } from '../lib/utils';

export function Layout() {
  const { user, notifications } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { reduceMotion } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCreateIdea = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowCreateModal(true);
  };

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/ideas', icon: Lightbulb, label: 'Ideas' },
    { path: '/insights', icon: BarChart2, label: 'Insights' },
  ];

  return (
    <>
      <SkipLink />
      <div className="min-h-screen bg-gray-900 grid-pattern">
        <header className="sticky top-0 z-40 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo and Primary Nav */}
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
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-gray-100"
                          : "text-gray-300 hover:bg-gray-700/30 hover:text-gray-100"
                      )}
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
                <VoiceCommandButton />
                
                <button
                  onClick={handleCreateIdea}
                  className="hidden md:inline-flex items-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Share Idea
                </button>

                {user ? (
                  <>
                    <button
                      onClick={() => setShowNotifications(true)}
                      className="relative p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                    >
                      <Bell className="h-5 w-5" />
                      {notifications.unread > 0 && (
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
                      className="p-2 text-gray-300 hover:text-gray-100 hover:bg-gray-700/50 rounded-lg"
                    >
                      <User className="h-5 w-5" />
                    </Link>
                  </>
                ) : (
                  <Link 
                    to="/login"
                    className="inline-flex items-center px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                )}

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
                      className={cn(
                        "block px-4 py-2 rounded-lg text-base font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-gray-700/50 text-gray-100"
                          : "text-gray-300 hover:bg-gray-700/30 hover:text-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5 inline-block mr-2" />
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleCreateIdea();
                      setShowMobileMenu(false);
                    }}
                    className="w-full px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors"
                  >
                    <Plus className="h-4 w-4 inline-block mr-2" />
                    Share Idea
                  </button>
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
          {showCreateModal && (
            <CreateIdeaModal onClose={() => setShowCreateModal(false)} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}