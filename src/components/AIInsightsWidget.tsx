import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AIInsightsWidgetProps {
  className?: string;
  compact?: boolean;
}

const AIInsightsWidget: React.FC<AIInsightsWidgetProps> = ({ 
  className = '', 
  compact = false 
}) => {
  // Sample insights for demo
  const quickInsights = [
    {
      emoji: '🌟',
      title: compact ? 'Great streak!' : 'Excellent consistency!',
      message: compact ? '87% this month' : 'You\'ve maintained 87% pill adherence this month',
      color: 'from-green-50 to-emerald-50 border-green-100',
      textColor: 'text-green-700'
    },
    {
      emoji: '🗓️',
      title: compact ? 'Period coming' : 'Period prediction',
      message: compact ? 'In ~6 days' : 'Expected in approximately 6 days',
      color: 'from-pink-50 to-rose-50 border-pink-100',
      textColor: 'text-pink-700'
    },
    {
      emoji: '💤',
      title: compact ? 'Sleep tip' : 'Better sleep needed',
      message: compact ? 'Try 7+ hours' : 'More sleep could improve your energy',
      color: 'from-blue-50 to-indigo-50 border-blue-100',
      textColor: 'text-blue-700'
    }
  ];

  const displayInsights = compact ? quickInsights.slice(0, 2) : quickInsights;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between ${compact ? 'p-4 pb-2' : 'p-6 pb-4'}`}>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg">
            <Brain className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
          </div>
          <div>
            <h3 className={`${compact ? 'text-sm' : 'text-lg'} font-semibold text-gray-800`}>
              AI Insights
            </h3>
            {!compact && (
              <p className="text-xs text-gray-500">Personalized for you</p>
            )}
          </div>
        </div>
        <Sparkles className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-pink-400`} />
      </div>

      {/* Insights */}
      <div className={`${compact ? 'px-4 pb-2' : 'px-6 pb-4'} space-y-2`}>
        {displayInsights.map((insight, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-3 bg-gradient-to-r ${insight.color} rounded-xl`}
          >
            <div className="flex items-start space-x-2">
              <span className={`${compact ? 'text-sm' : 'text-base'} mt-0.5`}>
                {insight.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <p className={`${compact ? 'text-xs' : 'text-sm'} font-medium ${insight.textColor} mb-1`}>
                  {insight.title}
                </p>
                <p className={`${compact ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  {insight.message}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className={`${compact ? 'px-4 pb-4' : 'px-6 pb-6'}`}>
        <Link to="/ai-insights">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-center space-x-2 ${
              compact 
                ? 'px-3 py-2 text-xs' 
                : 'px-4 py-3 text-sm'
            } bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium rounded-xl transition-all`}
          >
            <span>{compact ? 'More' : 'View All Insights'}</span>
            <ArrowRight className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};

export default AIInsightsWidget;
