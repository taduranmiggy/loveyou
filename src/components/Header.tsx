import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Home, Info, Mail, Activity, LogOut, User, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navigation from './Navigation';
import Button from './Button';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { 
      label: 'Home', 
      href: '/', 
      icon: <Home className="w-4 h-4" /> 
    },
    ...(user ? [
      { 
        label: 'Dashboard', 
        href: '/dashboard', 
        icon: <Activity className="w-4 h-4" /> 
      },
      { 
        label: 'Calendar', 
        href: '/calendar', 
        icon: <Calendar className="w-4 h-4" /> 
      },
    ] : []),
    { 
      label: 'Services', 
      href: '/services', 
      icon: <Heart className="w-4 h-4" /> 
    },
    { 
      label: 'About', 
      href: '/about', 
      icon: <Info className="w-4 h-4" /> 
    },
    { 
      label: 'Contact', 
      href: '/contact', 
      icon: <Mail className="w-4 h-4" /> 
    },
  ];

  const logo = (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="relative">
        <img 
          src="/welcomecapybara.png" 
          alt="Lady Diane's capybara" 
          className="w-8 h-8 group-hover:scale-110 transition-transform" 
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
      </div>
      <span className="text-xl font-bold text-gradient-primary">
        LoveYou
      </span>

    </Link>
  );

  const actions = (
    <>
      {user ? (
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-pink-50 rounded-full max-w-48">
            <User className="w-4 h-4 text-pink-600 flex-shrink-0" />
            <span className="text-sm font-medium text-pink-800 truncate">
              {user.name || user.email}
            </span>
          </div>
          
          {/* Mobile: Show only user icon */}
          <div className="sm:hidden flex items-center justify-center w-10 h-10 bg-pink-50 rounded-full">
            <User className="w-4 h-4 text-pink-600" />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="group"
          >
            <LogOut className="w-4 h-4 mr-0 sm:mr-2 group-hover:translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          
          <Link to="/register">
            <Button variant="primary" size="sm">
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </>
  );

  return (
    <Navigation
      logo={logo}
      items={navigationItems}
      actions={actions}
    />
  );
};

export default Header;
