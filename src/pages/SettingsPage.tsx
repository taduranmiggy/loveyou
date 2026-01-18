import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bell, 
  User, 
  Shield, 
  Palette, 
  Heart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotificationIntegration } from '../hooks/useNotificationIntegration';
import Button from '../components/Button';
import NotificationSettings from '../components/NotificationSettings';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { testNotification } = useNotificationIntegration();
  const [activeSection, setActiveSection] = useState('notifications');

  const sections = [
    {
      id: 'notifications',
      title: 'Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Manage your pill reminders and alerts'
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: <User className="w-5 h-5" />,
      description: 'Update your personal information'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: <Shield className="w-5 h-5" />,
      description: 'Control your data and privacy settings'
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: <Palette className="w-5 h-5" />,
      description: 'Customize the look and feel'
    }
  ];

  const handleTestNotification = () => {
    testNotification();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-sm border-b border-pink-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="glass"
                size="md"
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Settings
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⚙️
                  </motion.div>
                </h1>
                <p className="text-gray-600">Customize your LoveYou experience</p>
              </div>
            </div>
            
            <motion.img
              src="/flowercapybara.png"
              alt="Capybara companion"
              className="w-12 h-12 rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all ${
                      activeSection === section.id
                        ? 'bg-pink-50 border-2 border-pink-200 text-pink-700'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activeSection === section.id ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        {section.icon}
                      </div>
                      <div>
                        <div className="font-medium">{section.title}</div>
                        <div className="text-sm text-gray-500">{section.description}</div>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </nav>

              {/* Quick Test */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleTestNotification}
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  icon={<Bell className="w-4 h-4" />}
                >
                  Test Notification
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {activeSection === 'notifications' && (
              <NotificationSettings />
            )}

            {activeSection === 'profile' && (
              <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center text-white">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Profile Settings</h2>
                    <p className="text-gray-600">Manage your personal information</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.nickname || user?.name || ''}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="How should we address you?"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ''}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pill Time
                    </label>
                    <input
                      type="time"
                      defaultValue={user?.onboardingData?.pillTime || '08:00'}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      This sets when you'll receive daily pill reminders
                    </p>
                  </div>

                  <Button variant="primary" className="w-full md:w-auto">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'privacy' && (
              <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center text-white">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
                    <p className="text-gray-600">Control your data and privacy</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900 mb-1">Your Data is Safe</h3>
                        <p className="text-sm text-green-700">
                          All your health data is encrypted and stored securely. We never share 
                          your personal information with third parties.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Data Export</h4>
                        <p className="text-sm text-gray-600">Download all your data</p>
                      </div>
                      <Button variant="secondary" size="sm">
                        Export Data
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">Delete Account</h4>
                        <p className="text-sm text-gray-600">Permanently remove your account</p>
                      </div>
                      <Button variant="secondary" size="sm" className="text-red-600 hover:bg-red-50">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="bg-white rounded-3xl shadow-lg border border-pink-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white">
                    <Palette className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Appearance</h2>
                    <p className="text-gray-600">Customize the look and feel</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 border-2 border-pink-400 bg-pink-50 rounded-xl cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full"></div>
                          <span className="font-medium">Pink Dreams (Current)</span>
                        </div>
                      </div>
                      <div className="p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-purple-300">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
                          <span>Lavender Calm</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Animation Style</h3>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                        <input type="radio" name="animations" defaultChecked className="text-pink-500" />
                        <div>
                          <div className="font-medium">Playful & Bouncy</div>
                          <div className="text-sm text-gray-600">Full animations with cute bounces</div>
                        </div>
                      </label>
                      <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer">
                        <input type="radio" name="animations" className="text-pink-500" />
                        <div>
                          <div className="font-medium">Gentle & Smooth</div>
                          <div className="text-sm text-gray-600">Reduced motion for sensitivity</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Capybara Wisdom Footer */}
      <motion.footer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-16 mb-8"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-100">
            <div className="flex items-start gap-4">
              <motion.img
                src="/flowercapybara.png"
                alt="Capybara wisdom"
                className="w-16 h-16 rounded-full"
                animate={{ rotate: [0, -3, 3, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div>
                <h3 className="font-semibold text-pink-800 mb-2 flex items-center gap-2">
                  Capybara Settings Wisdom <Heart className="w-4 h-4" />
                </h3>
                <p className="text-pink-700">
                  "The best app is one that adapts to you, not the other way around. 
                  Take time to customize these settings so LoveYou feels like your personal wellness sanctuary. 
                  Remember, every notification should feel like a gentle friend, not a demanding alarm. 🌸"
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default SettingsPage;
