import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Sparkles, TrendingUp, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import AIInsightsDashboard from '../components/AIInsightsDashboard';

const AIInsightsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">AI Insights</h1>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-pink-500 to-purple-500 rounded-3xl mb-6"
            >
              <Brain className="w-12 h-12 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Your Personal Health
              <span className="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent"> AI Assistant</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get personalized insights, recommendations, and predictions based on your unique health patterns. 
              Our AI analyzes your data to help you make informed decisions about your wellness journey. ✨
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                icon: <TrendingUp className="w-8 h-8 text-blue-500" />,
                title: 'Pattern Recognition',
                description: 'Identifies trends in your pill adherence and cycle patterns to provide actionable insights.'
              },
              {
                icon: <Heart className="w-8 h-8 text-pink-500" />,
                title: 'Personalized Recommendations',
                description: 'Tailored advice based on your lifestyle, goals, and health data for optimal results.'
              },
              {
                icon: <Sparkles className="w-8 h-8 text-purple-500" />,
                title: 'Predictive Analytics',
                description: 'Smart predictions for your cycle, optimal pill timing, and wellness opportunities.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-2xl p-6 cute-shadow text-center"
              >
                <div className="inline-flex items-center justify-center p-3 bg-gray-50 rounded-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Dashboard */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="pb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AIInsightsDashboard />
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-white border-t border-gray-100 py-8"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              🤖 Powered by advanced AI algorithms designed for women's health
            </p>
            <p className="text-sm text-gray-500">
              Your data is always private and secure. AI insights are generated locally and never shared.
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default AIInsightsPage;
