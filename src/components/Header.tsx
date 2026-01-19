import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, Info, Mail, Activity, LogOut, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useState } from 'react';
import MobileNav from './MobileNav';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [capybaraMessage, setCapybaraMessage] = useState('👋 Hi there!');

  const capybaraMessages = [
    '💕 Take care!',
    '🦫 Let\'s go!',
    '✨ You got this!',
    '💪 Stay strong!',
    '🌸 You\'re amazing!',
    '💖 Love you!',
    '🎉 Let\'s celebrate!',
    '🌟 Shine bright!',
    '💚 Be kind to yourself!',
    '🦫💭 What\'s new?',
  ];

  const handleCapybaraHover = () => {
    setCapybaraMessage(capybaraMessages[Math.floor(Math.random() * capybaraMessages.length)]);
  };

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  // Navigation item with animation
  const NavItem = ({ to, label, icon, emoji }: { to: string; label: string; icon?: any; emoji: string }) => (
    <motion.div
      onMouseEnter={() => setHoveredNav(label)}
      onMouseLeave={() => setHoveredNav(null)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Link
        to={to}
        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
          isActive(to)
            ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-lg'
            : 'text-gray-700 hover:bg-pink-100 hover:text-pink-600'
        }`}
      >
        <span className={`text-xl ${hoveredNav === label ? 'animate-bounce' : ''}`}>{emoji}</span>
        <span className="hidden md:inline">{label}</span>
      </Link>
    </motion.div>
  );

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 bg-gradient-to-r from-pink-50 to-purple-50 shadow-lg z-50 border-b-2 border-pink-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo with animated capybara */}
          <motion.div
            whileHover={{ rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={handleCapybaraHover}
          >
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <motion.div
                className="relative"
                animate={hoveredNav === 'logo' ? { rotate: [0, -10, 10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <img
                  src="/welcomecapybara.png"
                  alt="Capybara mascot"
                  className="w-10 h-10 group-hover:scale-125 transition-transform drop-shadow-sm"
                />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
              <div className="flex flex-col justify-center leading-none">
                <span className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-500 bg-clip-text text-transparent leading-none">
                  Love you
                </span>
                <motion.span
                  className="text-xs text-pink-500 font-semibold leading-none mt-0.5"
                  key={`message-${capybaraMessage}`}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {capybaraMessage}
                </motion.span>
              </div>
            </Link>
          </motion.div>

          {/* Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              // Logged in navigation - more fun!
              <>
                <NavItem to="/" emoji="🏠" label="Home" />
                <NavItem to="/dashboard" emoji="💻" label="Dashboard" />
                <NavItem to="/calendar" emoji="📅" label="Calendar" />
                <NavItem to="/settings" emoji="⚙️" label="Settings" />
              </>
            ) : (
              // Not logged in navigation
              <>
                <NavItem to="/" emoji="🏠" label="Home" />
                <NavItem to="/about" emoji="ℹ️" label="About" />
                <NavItem to="/services" emoji="💝" label="Services" />
                <NavItem to="/contact" emoji="💌" label="Contact" />
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav user={user} onLogout={handleLogout} />

          {/* Right actions with enhanced styling */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* User greeting with emoji */}
                <motion.div
                  className="text-sm text-gray-600 hidden sm:flex items-center gap-2 px-3 py-2 bg-white/50 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span>{user.name || user.email}</span>
                </motion.div>

                {/* Logout button with style */}
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login">
                    <button className="px-4 py-2 text-pink-600 hover:bg-pink-100 rounded-lg font-medium transition-colors">
                      Login
                    </button>
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register">
                    <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Get Started</span>
                    </button>
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Header;
