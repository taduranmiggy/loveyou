import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Calendar, Settings, LogOut, Sparkles, Heart } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface MobileNavProps {
  user: any;
  onLogout: () => void;
}

const MobileNav = ({ user, onLogout }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const loggedInNavItems = [
    { path: '/', label: 'Home', emoji: '🏠', icon: Home },
    { path: '/dashboard', label: 'Dashboard', emoji: '💻', icon: Calendar },
    { path: '/calendar', label: 'Calendar', emoji: '📅', icon: Calendar },
    { path: '/settings', label: 'Settings', emoji: '⚙️', icon: Settings },
  ];

  const notLoggedInNavItems = [
    { path: '/', label: 'Home', emoji: '🏠', icon: Home },
    { path: '/about', label: 'About', emoji: 'ℹ️', icon: Heart },
    { path: '/services', label: 'Services', emoji: '💝', icon: Sparkles },
    { path: '/contact', label: 'Contact', emoji: '💌', icon: Heart },
  ];

  const navItems = user ? loggedInNavItems : notLoggedInNavItems;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      {/* Hamburger Menu Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-pink-100 transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-6 h-6 text-pink-600" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <Menu className="w-6 h-6 text-pink-600" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-16 left-0 right-0 bg-gradient-to-b from-pink-50 to-purple-50 border-b-2 border-pink-200 shadow-xl"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
              {/* Navigation Items */}
              {navItems.map((item, index) => (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5, scale: 1.02 }}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-pink-100 hover:text-pink-600'
                  }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}

              {/* Divider */}
              <div className="my-2 border-t border-pink-200" />

              {/* Auth Items */}
              {user ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.05 }}
                    className="px-4 py-3 bg-white/50 rounded-lg flex items-center gap-2 text-gray-700"
                  >
                    <Heart className="w-5 h-5 text-pink-500" />
                    <span className="font-medium">{user.name || user.email}</span>
                  </motion.div>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (navItems.length + 1) * 0.05 }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navItems.length * 0.05 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="w-full px-4 py-3 text-pink-600 hover:bg-pink-100 rounded-lg font-medium transition-all"
                    >
                      Login 💕
                    </motion.button>
                  </Link>
                  <Link
                    to="/register"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + 1) * 0.05 }}
                      whileHover={{ x: 5, scale: 1.02 }}
                      className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                    >
                      <Sparkles className="w-5 h-5" />
                      <span>Get Started</span>
                    </motion.button>
                  </Link>
                </>
              )}

              {/* Cute footer message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="px-4 py-3 text-center text-sm text-pink-600 font-medium"
              >
                ✨ You got this! 💕
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav;
