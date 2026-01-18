import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Mail, Lock, User, Calendar, Sparkles } from 'lucide-react';
import { LoadingButton, SkeletonForm } from './LoadingComponents';
import { showErrorToast, showSuccessToast, validateForm, handleApiError } from '../utils/errorHandling.jsx';
import api from '../utils/api.js';

const Register = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    nickname: '',
    age: '',
    password: '',
    confirmPassword: '',
    pillType: '',
    startDate: ''
  });
  const [pillTypes, setPillTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loadingPillTypes, setLoadingPillTypes] = useState(true);

  const validationRules = {
    email: {
      required: true,
      email: true,
      label: 'Email'
    },
    nickname: {
      required: true,
      minLength: 2,
      label: 'Nickname'
    },
    age: {
      required: true,
      label: 'Age'
    },
    password: {
      required: true,
      minLength: 6,
      label: 'Password'
    },
    confirmPassword: {
      required: true,
      label: 'Confirm Password'
    },
    pillType: {
      required: true,
      label: 'Pill Type'
    },
    startDate: {
      required: true,
      label: 'Start Date'
    }
  };

  useEffect(() => {
    fetchPillTypes();
  }, []);

  const fetchPillTypes = async () => {
    setLoadingPillTypes(true);
    
    try {
      const result = await api.getPillTypes();
      
      if (result.success) {
        setPillTypes(result.pillTypes || []);
      } else {
        // Fallback pill types if API fails
        setPillTypes([
          { id: 1, name: 'Diane', description: 'Diane-35: 21 active pills followed by 7-day break. Effective for acne treatment and contraception.' },
          { id: 2, name: 'Althea', description: 'Althea: 21 active pills followed by 7-day break. Popular daily contraceptive pill.' },
          { id: 3, name: 'Yasmin', description: 'Yasmin: 21 active pills followed by 7-day break. Low-dose hormonal contraceptive.' },
          { id: 4, name: 'Trust', description: 'Trust Pills: 21 active pills followed by 7-day break. Affordable contraceptive option.' }
        ]);
        showErrorToast(null, 'Using default pill types. Some options may be limited.');
      }
    } catch (error) {
      console.error('Error fetching pill types:', error);
      // Fallback pill types if API fails
      setPillTypes([
        { id: 1, name: 'Diane', description: 'Diane-35: 21 active pills followed by 7-day break. Effective for acne treatment and contraception.' },
        { id: 2, name: 'Althea', description: 'Althea: 21 active pills followed by 7-day break. Popular daily contraceptive pill.' },
        { id: 3, name: 'Yasmin', description: 'Yasmin: 21 active pills followed by 7-day break. Low-dose hormonal contraceptive.' },
        { id: 4, name: 'Trust', description: 'Trust Pills: 21 active pills followed by 7-day break. Affordable contraceptive option.' }
      ]);
      showErrorToast(null, 'Using default pill types. Some options may be limited.');
    }
    
    setLoadingPillTypes(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(formData, validationRules);
    
    // Custom validation for password confirmation
    if (formData.password !== formData.confirmPassword) {
      validation.errors.confirmPassword = 'Passwords do not match';
      validation.isValid = false;
    }
    
    // Custom validation for age
    const age = parseInt(formData.age);
    if (isNaN(age) || age < 13 || age > 100) {
      validation.errors.age = 'Please enter a valid age between 13 and 100';
      validation.isValid = false;
    }
    
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      showErrorToast(null, 'Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const result = await api.register(formData);

      if (result.success) {
        showSuccessToast(`Welcome to Milady, ${formData.nickname}! Your capybara friend is so excited! 🦫💕`);
        onLogin(result.user);
      } else {
        showErrorToast(null, result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      showErrorToast(null, 'Unable to create account. Please try again.');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto h-20 w-20 bg-pink-200 rounded-full flex items-center justify-center mb-4 cursor-pointer"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const registerMessages = [
                "Welcome to our capybara family! 🦫💕",
                "I'm so excited to be your pill companion! ✨",
                "Together we'll never miss a pill! 🌸",
                "You're about to start an amazing health journey! 🌟",
                "I can't wait to celebrate your streaks with you! 🎉"
              ];
              const randomMessage = registerMessages[Math.floor(Math.random() * registerMessages.length)];
              
              toast.success(randomMessage, {
                duration: 3500,
                style: {
                  background: '#fce7f3',
                  color: '#831843',
                  border: '2px solid #f9a8d4',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500'
                },
                icon: '🎊'
              });
            }}
          >
            <img 
              src="/src/assets/welcomecapybara.png" 
              alt="Welcome Capybara" 
              className="w-16 h-16 object-contain"
            />
          </motion.div>
          <h2 className="text-3xl font-bold text-pink-800">Join our lovely community! 💕</h2>
          <p className="mt-2 text-pink-600">Let's get you a cute capybara companion!</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 space-y-6 glass rounded-3xl p-8 shadow-xl"
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="nickname"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  placeholder="Your cute nickname"
                  value={formData.nickname}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Sparkles className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="age"
                  type="number"
                  min="13"
                  max="100"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  placeholder="Your age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Heart className="absolute left-3 top-3 h-5 w-5 text-pink-400 z-10" />
                <select
                  name="pillType"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50 cursor-pointer"
                  value={formData.pillType}
                  onChange={handleChange}
                >
                  <option value="">Choose your pill type</option>
                  {pillTypes.map((pill) => (
                    <option key={pill.id} value={pill.name}>
                      {pill.name} - {pill.description}
                    </option>
                  ))}
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="startDate"
                  type="date"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  placeholder="Choose a secure password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-12 py-3 border border-pink-200 placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white/50"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-white font-medium rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2" />
                  Join the capybara family!
                </>
              )}
            </motion.button>
          </div>

          <div className="text-center">
            <p className="text-pink-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-pink-700 hover:text-pink-800 underline">
                Welcome back! <Heart className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Register;
