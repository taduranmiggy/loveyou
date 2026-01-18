import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Heart } from 'lucide-react';
import {
  MiladyButton,
  MiladyInput,
  MiladySelect,
  MiladyCard,
  MiladyProgress,
  MiladyBadge,
  MiladyCheckbox,
  MiladySwitch,
  MiladySkeleton
} from './MiladyComponents';
import { usePillTracking, useFormValidation, useLoveYouTheme } from '../hooks/useReactBits';
import { Toast } from '../utils/toast';

const MiladyDemo = () => {
  const [showDemo, setShowDemo] = useState('components');
  const [streak, setStreak] = useState(7);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    pillType: ''
  });
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Toast.success(`Welcome ${formData.name}! 🦫💕 Your profile has been saved!`);
    }, 2000);
  };

  const pillOptions = [
    { value: '', label: 'Select your pill type...' },
    { value: 'diane', label: 'Diane-35' },
    { value: 'althea', label: 'Althea' },
    { value: 'yasmin', label: 'Yasmin' },
    { value: 'other', label: 'Other' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-pink-800 mb-4">
            Milady Components Demo 🦫✨
          </h1>
          <p className="text-pink-600 text-lg">
            Enhanced UX components with capybara personality
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2">
            {[
              { key: 'components', label: 'Components' },
              { key: 'forms', label: 'Forms' },
              { key: 'interactive', label: 'Interactive' }
            ].map(({ key, label }) => (
              <MiladyButton
                key={key}
                variant={showDemo === key ? 'primary' : 'ghost'}
                size="small"
                onClick={() => setShowDemo(key)}
              >
                {label}
              </MiladyButton>
            ))}
          </div>
        </div>

        {/* Demo Content */}
        <motion.div
          key={showDemo}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {showDemo === 'components' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Buttons */}
              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Enhanced Buttons</h3>
                <div className="space-y-3">
                  <MiladyButton 
                    variant="primary" 
                    leftIcon={<Heart className="w-4 h-4" />}
                    onClick={() => Toast.success('Pill taken! 🦫💕')}
                  >
                    Take Pill
                  </MiladyButton>
                  <MiladyButton variant="secondary">
                    View Calendar
                  </MiladyButton>
                  <MiladyButton variant="ghost" disabled>
                    Disabled Button
                  </MiladyButton>
                  <MiladyButton 
                    variant="success" 
                    loading={loading}
                    onClick={() => {
                      setLoading(true);
                      setTimeout(() => setLoading(false), 2000);
                    }}
                  >
                    {loading ? 'Saving...' : 'Save Settings'}
                  </MiladyButton>
                </div>
              </MiladyCard>

              {/* Progress & Badges */}
              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Progress Tracking</h3>
                <div className="space-y-4">
                  <MiladyProgress 
                    value={streak} 
                    max={21} 
                    label="Current Streak" 
                    className="mb-4"
                  />
                  <MiladyProgress 
                    value={85} 
                    max={100} 
                    label="Monthly Goal" 
                  />
                  <div className="flex flex-wrap gap-2 mt-4">
                    <MiladyBadge variant="success">7 Day Streak!</MiladyBadge>
                    <MiladyBadge variant="primary">Active</MiladyBadge>
                    <MiladyBadge variant="warning">Reminder</MiladyBadge>
                  </div>
                </div>
              </MiladyCard>

              {/* Skeleton Loading */}
              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Skeleton Loaders</h3>
                <div className="space-y-3">
                  <MiladySkeleton height="20px" />
                  <MiladySkeleton height="40px" width="60%" />
                  <MiladySkeleton height="20px" width="80%" />
                  <MiladySkeleton height="60px" />
                </div>
              </MiladyCard>
            </div>
          )}

          {showDemo === 'forms' && (
            <div className="max-w-2xl mx-auto">
              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-6">Enhanced Form Experience</h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <MiladyInput
                    label="Full Name"
                    placeholder="Enter your name"
                    leftIcon={<User className="w-4 h-4" />}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    success={formData.name.length > 2 ? "Looking good!" : undefined}
                  />
                  
                  <MiladyInput
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email"
                    leftIcon={<Mail className="w-4 h-4" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    error={formData.email && !formData.email.includes('@') ? "Please enter a valid email" : undefined}
                  />
                  
                  <MiladySelect
                    label="Contraceptive Pill"
                    options={pillOptions}
                    value={formData.pillType}
                    onChange={(e) => setFormData({ ...formData, pillType: e.target.value })}
                  />
                  
                  <MiladyButton 
                    type="submit" 
                    variant="primary" 
                    size="large" 
                    loading={loading}
                    className="w-full"
                  >
                    {loading ? 'Saving Profile...' : 'Save Profile 🦫💕'}
                  </MiladyButton>
                </form>
              </MiladyCard>
            </div>
          )}

          {showDemo === 'interactive' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Interactive Controls</h3>
                <div className="space-y-4">
                  <MiladyCheckbox
                    label="Daily reminders"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                  />
                  <MiladyCheckbox
                    label="Share streak with friends"
                    checked={false}
                    onChange={() => {}}
                  />
                  <MiladySwitch
                    label="Dark mode"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                  <MiladySwitch
                    label="Analytics tracking"
                    checked={true}
                    onChange={() => {}}
                  />
                </div>
              </MiladyCard>

              <MiladyCard>
                <h3 className="text-xl font-bold text-pink-800 mb-4">Settings Preview</h3>
                <div className="bg-pink-50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-pink-700">
                    <strong>Notifications:</strong> {notifications ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-pink-700">
                    <strong>Theme:</strong> {darkMode ? 'Dark' : 'Light'}
                  </p>
                  <p className="text-sm text-pink-700">
                    <strong>Current Streak:</strong> {streak} days 🔥
                  </p>
                  <p className="text-sm text-pink-700">
                    <strong>Capybara Mood:</strong> Very Happy! 🦫✨
                  </p>
                </div>
              </MiladyCard>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-pink-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p>Built with 💕 by Milady team • Featuring our capybara mascot 🦫</p>
        </motion.div>
      </div>
    </div>
  );
};

export default MiladyDemo;
