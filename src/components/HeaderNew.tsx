import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Home, Info, Mail, Activity, LogOut, User } from 'lucide-react';
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
        <Heart className="w-8 h-8 text-pink-500 group-hover:text-pink-600 transition-colors" />
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
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-2 bg-pink-50 rounded-full">
            <User className="w-4 h-4 text-pink-600" />
            <span className="text-sm font-medium text-pink-800">
              {user.name || user.email}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="group"
          >
            <LogOut className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
            Logout
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
