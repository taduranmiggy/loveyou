import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Heart, Calendar, Palette, Moon, Sun, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/api.js';

const Settings = ({ user }) => {
  const [settings, setSettings] = useState({
    nickname: '',
    pillType: '',
    startDate: '',
    themePreference: 'light',
    capybaraName: ''
  });
  const [pillTypes, setPillTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchPillTypes();
  }, []);

  const fetchUserData = async () => {
    try {
      const result = await api.getUser();
      if (result.success && result.user) {
        setSettings({
          nickname: result.user.nickname || '',
          pillType: result.user.pillType || '',
          startDate: result.user.startDate || '',
          themePreference: result.user.themePreference || 'light',
          capybaraName: result.user.capybaraName || ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchPillTypes = async () => {
    try {
      const result = await api.getPillTypes();
      setPillTypes(result.pillTypes || []);
    } catch (error) {
      console.error('Failed to fetch pill types:', error);
      // Set default pill types if backend is not available
      setPillTypes([
        { id: 1, name: 'Diane', description: 'Diane-35: 21 active pills followed by 7-day break' },
        { id: 2, name: 'Althea', description: 'Althea: 21 active pills followed by 7-day break' },
        { id: 3, name: 'Yasmin', description: 'Yasmin: 21 active pills followed by 7-day break' },
        { id: 4, name: 'Marvelon', description: 'Marvelon: 21 active pills followed by 7-day break' },
        { id: 5, name: 'Custom', description: 'Custom cycle defined by user' }
      ]);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await api.updateUser(settings);
      if (result.success) {
        toast.success('Settings updated successfully! 💕');
      } else {
        toast.error(result.error || 'Failed to update settings');
      }
    } catch (error) {
      toast.error('Connection error. Please try again!');
    }

    setLoading(false);
  };

  const capybaraNames = [
    'Cappy', 'Bubbles', 'Sunny', 'Mochi', 'Peanut', 'Biscuit', 
    'Marshmallow', 'Cocoa', 'Honey', 'Caramel', 'Vanilla', 'Cinnamon'
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            🦫
          </motion.div>
          <h1 className="text-3xl font-bold text-pink-800 mb-2">Settings</h1>
          <p className="text-pink-600">Customize your experience just the way you like it! 💕</p>
        </motion.div>

        {/* Settings Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-pink-800 flex items-center">
              <User className="h-5 w-5 mr-2" />
              Personal Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Nickname
              </label>
              <input
                type="text"
                name="nickname"
                value={settings.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                placeholder="Your cute nickname"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Capybara Friend Name
              </label>
              <div className="relative">
                <select
                  name="capybaraName"
                  value={settings.capybaraName}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50 cursor-pointer"
                >
                  {capybaraNames.map((name) => (
                    <option key={name} value={name}>
                      {name} 🦫
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pill Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-pink-800 flex items-center">
              <Heart className="h-5 w-5 mr-2" />
              Pill Information
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Pill Type
              </label>
              <div className="relative">
                <select
                  name="pillType"
                  value={settings.pillType}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50 cursor-pointer"
                >
                  {pillTypes.map((pill) => (
                    <option key={pill.id} value={pill.name}>
                      {pill.name} - {pill.description}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-pink-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  type="date"
                  name="startDate"
                  value={settings.startDate}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                />
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-pink-800 flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Appearance
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-pink-700 mb-3">
                Theme Preference
              </label>
              <div className="grid grid-cols-2 gap-4">
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    settings.themePreference === 'light'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-pink-200 bg-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="themePreference"
                    value="light"
                    checked={settings.themePreference === 'light'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Sun className="h-6 w-6 text-yellow-500 mr-2" />
                  <span className="text-pink-700 font-medium">Light</span>
                </motion.label>
                
                <motion.label
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center justify-center p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    settings.themePreference === 'dark'
                      ? 'border-pink-400 bg-pink-50'
                      : 'border-pink-200 bg-white/30'
                  }`}
                >
                  <input
                    type="radio"
                    name="themePreference"
                    value="dark"
                    checked={settings.themePreference === 'dark'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <Moon className="h-6 w-6 text-purple-500 mr-2" />
                  <span className="text-pink-700 font-medium">Dark</span>
                </motion.label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-white font-medium rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Save Changes
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 glass rounded-2xl p-6"
        >
          <h3 className="text-lg font-semibold text-pink-800 mb-3">Fun Capybara Fact! 🦫</h3>
          <p className="text-pink-700">
            Did you know? Capybaras are excellent swimmers and can stay underwater for up to 5 minutes! 
            Just like how consistent you are with your pill routine! 💕
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
