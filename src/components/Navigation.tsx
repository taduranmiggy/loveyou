import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Heart } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface NavigationProps {
  logo?: React.ReactNode;
  items: NavItem[];
  actions?: React.ReactNode;
  className?: string;
}

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  actions?: React.ReactNode;
}

export interface DropdownMenuProps {
  label: string;
  items: NavItem[];
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({
  logo,
  items,
  actions,
  className = ''
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = 'var(--scrollbar-width, 0px)';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`
          fixed top-0 left-0 right-0 transition-all duration-300 nav-layer
          ${scrolled 
            ? 'nav-scrolled' 
            : 'bg-transparent'
          }
          ${className}
        `.trim()}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 nav-container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex-shrink-0"
            >
              {logo || (
                <Link to="/" className="flex items-center gap-2">
                  <Heart className="w-8 h-8 text-pink-500" />
                  <span className="text-xl font-bold text-gradient-primary">
                    LoveYou
                  </span>
                </Link>
              )}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {items.map((item) => (
                <NavItem key={item.href} item={item} />
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {actions}
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors mobile-nav-button"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        items={items}
        actions={actions}
      />
    </>
  );
};

const NavItem: React.FC<{ item: NavItem }> = ({ item }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;

  if (item.children && item.children.length > 0) {
    return (
      <DropdownMenu 
        label={item.label}
        items={item.children}
      />
    );
  }

  return (
    <Link to={item.href}>
      <motion.div
        whileHover={{ y: -2 }}
        className={`
          relative px-3 py-2 rounded-lg font-medium transition-all duration-200
          ${isActive 
            ? 'text-pink-600 bg-pink-50' 
            : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
          }
        `.trim()}
      >
        <div className="flex items-center gap-2">
          {item.icon}
          {item.label}
        </div>
        
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-500 rounded-full"
          />
        )}
      </motion.div>
    </Link>
  );
};

const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  label, 
  items, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        whileHover={{ y: -2 }}
        className="flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-all duration-200"
      >
        {label}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-pink-100 py-2 z-50"
          >
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  actions 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm mobile-menu-backdrop lg:hidden"
          />

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl mobile-menu-panel lg:hidden"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-pink-100">
                <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                  <Heart className="w-8 h-8 text-pink-500" />
                  <span className="text-xl font-bold text-gradient-primary">
                    LoveYou
                  </span>
                </Link>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 rounded-xl bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-6 py-6 space-y-2">
                {items.map((item, index) => (
                  <MobileNavItem 
                    key={item.href} 
                    item={item} 
                    onClose={onClose}
                    delay={index * 0.1}
                  />
                ))}
              </nav>

              {/* Actions */}
              {actions && (
                <div className="p-6 border-t border-pink-100 space-y-4">
                  {actions}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const MobileNavItem: React.FC<{ 
  item: NavItem; 
  onClose: () => void;
  delay?: number;
}> = ({ item, onClose, delay = 0 }) => {
  const location = useLocation();
  const isActive = location.pathname === item.href;
  const [isExpanded, setIsExpanded] = useState(false);

  if (item.children && item.children.length > 0) {
    return (
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay }}
      >
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
        >
          <div className="flex items-center gap-3">
            {item.icon}
            {item.label}
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="ml-4 overflow-hidden"
            >
              {item.children.map((child) => (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-xl transition-colors"
                >
                  {child.icon}
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay }}
    >
      <Link
        to={item.href}
        onClick={onClose}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
          ${isActive 
            ? 'text-pink-600 bg-pink-50' 
            : 'text-gray-700 hover:text-pink-600 hover:bg-pink-50'
          }
        `.trim()}
      >
        {item.icon}
        {item.label}
        
        {isActive && (
          <motion.div
            layoutId="activeMobileTab"
            className="ml-auto w-2 h-2 bg-pink-500 rounded-full"
          />
        )}
      </Link>
    </motion.div>
  );
};

export default Navigation;
