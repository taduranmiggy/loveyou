import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, User, Calendar, Sparkles } from 'lucide-react';

const Setup = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    pillType: '',
    startDate: '',
    reminderTime: '09:00'
  });

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            animate={{ bounce: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4 flex justify-center"
          >
            <img 
              src="/src/assets/bookscapybara.png" 
              alt="Books Capybara" 
              className="w-20 h-20 object-contain"
            />
          </motion.div>
          <h1 className="text-3xl font-bold text-pink-800">Welcome, {user?.nickname}!</h1>
          <p className="text-pink-600 mt-2">Let's set up your pill tracking! 💕</p>
        </motion.div>

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass rounded-3xl p-8"
        >
          {step === 1 && (
            <div className="text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-pink-800 mb-4">Choose Your Pill</h2>
              <select
                name="pillType"
                value={formData.pillType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50 mb-6"
              >
                <option value="">Select your pill type</option>
                <option value="Diane">Diane-35</option>
                <option value="Althea">Althea</option>
                <option value="Yasmin">Yasmin</option>
                <option value="Marvelon">Marvelon</option>
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="text-center">
              <Calendar className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-pink-800 mb-4">When did you start?</h2>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50 mb-6"
              />
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-pink-800 mb-4">All set!</h2>
              <p className="text-pink-600 mb-6">
                Your capybara friend is excited to help you track your pills! 🦫💕
              </p>
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-pink-700 transition-colors"
          >
            {step === 3 ? "Let's go! 🚀" : 'Next'}
          </motion.button>
        </motion.div>

        {/* Step indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-colors ${
                i === step ? 'bg-pink-500' : 'bg-pink-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Setup;
