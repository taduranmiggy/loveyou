import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Mail, Lock, Sparkles } from 'lucide-react';
import { LoadingButton } from './LoadingComponents';
import { showErrorToast, showSuccessToast, validateForm, handleApiError } from '../utils/errorHandling.jsx';
import api from '../utils/api.js';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validationRules = {
    email: {
      required: true,
      email: true,
      label: 'Email'
    },
    password: {
      required: true,
      minLength: 6,
      label: 'Password'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateForm(formData, validationRules);
    setErrors(validation.errors);
    
    if (!validation.isValid) {
      showErrorToast(null, 'Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const result = await api.login(formData);

      if (result.success) {
        showSuccessToast(`Welcome back! ${result.user.capybaraName} missed you! 🦫💕`);
        onLogin(result.user);
      } else {
        showErrorToast(null, result.error || 'Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      showErrorToast(null, 'Unable to log in. Please check your credentials.');
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto h-20 w-20 bg-pink-200 rounded-full flex items-center justify-center mb-4 cursor-pointer"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              const loginMessages = [
                "Welcome back! I missed you! 🦫💕",
                "Ready to track some pills? Let's go! ✨",
                "Your capybara friend is excited to see you! 🌸",
                "Time to check in on your amazing progress! 📊",
                "Hi there! Let's make today a great pill day! 🌟"
              ];
              const randomMessage = loginMessages[Math.floor(Math.random() * loginMessages.length)];
              
              toast.success(randomMessage, {
                duration: 3000,
                style: {
                  background: '#fce7f3',
                  color: '#831843',
                  border: '2px solid #f9a8d4',
                  borderRadius: '20px',
                  fontSize: '16px',
                  fontWeight: '500'
                },
                icon: '👋'
              });
            }}
          >
            <img 
              src="/src/assets/capybaraHI.png" 
              alt="Hi Capybara" 
              className="w-16 h-16 object-contain"
            />
          </motion.div>
          <h2 className="text-3xl font-bold text-pink-800">Welcome back, lovely! 💕</h2>
          <p className="mt-2 text-pink-600">Your capybara friend is waiting for you!</p>
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
              <label htmlFor="email" className="sr-only">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`appearance-none relative block w-full px-12 py-3 border placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 bg-white/50 ${
                    errors.email ? 'border-red-300 focus:border-red-500' : 'border-pink-200'
                  }`}
                  placeholder="Your email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {errors.email && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 ml-3"
                >
                  {errors.email}
                </motion.p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-pink-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  className={`appearance-none relative block w-full px-12 py-3 border placeholder-pink-400 text-pink-800 rounded-2xl focus:outline-none focus:ring-pink-500 focus:border-pink-500 focus:z-10 bg-white/50 ${
                    errors.password ? 'border-red-300 focus:border-red-500' : 'border-pink-200'
                  }`}
                  placeholder="Your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              {errors.password && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-1 ml-3"
                >
                  {errors.password}
                </motion.p>
              )}
            </div>
          </div>

          <div>
            <LoadingButton
              loading={loading}
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-2xl text-white bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
            >
              Sign in with Milady
            </LoadingButton>
          </div>

          <div className="text-center">
            <p className="text-pink-600">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-pink-700 hover:text-pink-800 underline">
                Join the capybara family! <Sparkles className="inline h-4 w-4" />
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
