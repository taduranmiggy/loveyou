import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Settings, LogOut, Heart } from 'lucide-react';

const Navigation = ({ user, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Home' },
    { to: '/calendar', icon: Calendar, label: 'Calendar' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-pink-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex-shrink-0"
            >
              <span className="text-2xl">🦫</span>
            </motion.div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-pink-800">Love you</h1>
              <p className="text-sm text-pink-600">Hey {user?.nickname}! 💕</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              
              return (
                <motion.div key={item.to} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={item.to}
                    className={`flex items-center px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-pink-200 text-pink-800'
                        : 'text-pink-600 hover:text-pink-800 hover:bg-pink-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="flex items-center px-3 py-2 rounded-full text-sm font-medium text-pink-600 hover:text-pink-800 hover:bg-pink-100 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </motion.button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
