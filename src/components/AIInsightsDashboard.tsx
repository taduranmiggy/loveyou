import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Heart, 
  Sparkles, 
  Calendar, 
  Target,
  ChevronRight,
  RefreshCw,
  Star,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react';
import { AIInsightsService } from '../services/AIInsightsService';
import type { AIInsight } from '../services/AIInsightsService';

interface AIInsightsDashboardProps {
  className?: string;
}

interface AIMessage {
  id: string;
  message: string;
  type: 'greeting' | 'motivation' | 'tip' | 'celebration';
  timestamp: Date;
  mood: 'cheerful' | 'supportive' | 'encouraging' | 'caring';
}

const AIInsightsDashboard: React.FC<AIInsightsDashboardProps> = ({ className = '' }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentMessage, setCurrentMessage] = useState<AIMessage | null>(null);
  const [messageLoading, setMessageLoading] = useState(true);

  const aiService = AIInsightsService.getInstance();

  const generateAIMessage = (): AIMessage => {
    const messages = {
      greeting: [
        "Good morning, beautiful! ✨ Remember, you're taking amazing care of yourself today! 💕",
        "Hey lovely! 🌸 Your health journey is something to be proud of! 🌟",
        "Hello gorgeous! 💖 Just a reminder that you're doing great! 🦄",
        "Hi sunshine! ☀️ Your commitment to your health is inspiring! 💪",
        "Hey beautiful soul! 🌺 You're making wonderful choices for your wellbeing! 🌈"
      ],
      motivation: [
        "You've got this! 💪 Every pill you take is an act of self-love! 💕",
        "Your consistency is amazing! 🌟 Keep up the fantastic work! 🎉",
        "Remember: small daily actions create big results! ✨ You're proof of that! 💖",
        "Your future self is thanking you for the care you're taking today! 🙏💕",
        "You're not just taking a pill, you're taking control of your life! 👑✨"
      ],
      tip: [
        "💡 Pro tip: Set a fun alarm tone to make your pill reminder more delightful! 🎵",
        "🌸 Try pairing your pill with a morning gratitude practice! It's a beautiful combo! ✨",
        "💖 Remember to drink plenty of water with your pill - your body will thank you! 💧",
        "🌟 Consider tracking how you feel each day - patterns can reveal amazing insights! 📊",
        "💕 A consistent routine makes everything easier - you're building such healthy habits! 🌱"
      ],
      celebration: [
        "🎉 You're officially amazing at this whole self-care thing! Keep celebrating yourself! 💕",
        "🌟 Your dedication to your health is absolutely inspiring! You should be so proud! 👑",
        "💖 Look at you being consistent and fabulous! This is worth celebrating! 🎊",
        "✨ Every day you choose yourself is a victory! You're winning at life! 🏆",
        "🦄 Your commitment to your wellbeing is pure magic! Keep shining! 🌈"
      ]
    };

    const types: (keyof typeof messages)[] = ['greeting', 'motivation', 'tip', 'celebration'];
    const moods: AIMessage['mood'][] = ['cheerful', 'supportive', 'encouraging', 'caring'];
    
    const type = types[Math.floor(Math.random() * types.length)];
    const mood = moods[Math.floor(Math.random() * moods.length)];
    const messageArray = messages[type];
    const message = messageArray[Math.floor(Math.random() * messageArray.length)];

    return {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      mood
    };
  };

  useEffect(() => {
    loadInsights();
    // Generate new AI message on component mount
    const aiMessage = generateAIMessage();
    setCurrentMessage(aiMessage);
    
    // Simulate message generation delay for smooth UX
    setTimeout(() => {
      setMessageLoading(false);
    }, 1000);
  }, []);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // In a real app, this would fetch actual user data
      const userData = aiService.getSampleUserData();
      const generatedInsights = aiService.generateInsights(userData);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
  };

  const generateNewMessage = () => {
    setMessageLoading(true);
    const newMessage = generateAIMessage();
    setCurrentMessage(newMessage);
    
    // Simulate generation delay for smooth UX
    setTimeout(() => {
      setMessageLoading(false);
    }, 800);
  };

  const getInsightIcon = (insight: AIInsight) => {
    switch (insight.type) {
      case 'celebration':
        return <Star className="w-5 h-5 text-yellow-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'recommendation':
        return <Target className="w-5 h-5 text-blue-500" />;
      case 'tip':
        return <Lightbulb className="w-5 h-5 text-green-500" />;
      default:
        return <CheckCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInsightBorderColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500';
      case 'high':
        return 'border-l-orange-500';
      case 'medium':
        return 'border-l-blue-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const categories = [
    { id: 'all', label: 'All Insights', icon: <Brain className="w-4 h-4" /> },
    { id: 'pill', label: 'Pill Tracking', icon: <Calendar className="w-4 h-4" /> },
    { id: 'cycle', label: 'Cycle Health', icon: <Heart className="w-4 h-4" /> },
    { id: 'lifestyle', label: 'Lifestyle', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'wellness', label: 'Wellness', icon: <Sparkles className="w-4 h-4" /> }
  ];

  const filteredInsights = selectedCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.category === selectedCategory);

  const handleInsightAction = (action: string) => {
    // In a real app, this would handle the specific action
    console.log('Handling action:', action);
    // For demo purposes, just show an alert
    alert(`Action "${action}" would be handled here! 💖`);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-3xl p-6 cute-shadow ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-12 h-12 text-pink-500" />
            </motion.div>
            <p className="text-gray-600">Generating personalized insights... ✨</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-3xl cute-shadow ${className}`}
    >
      {/* AI Message Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Daily AI Message</h3>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateNewMessage}
              disabled={messageLoading}
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-gray-600 ${messageLoading ? 'animate-spin' : ''}`} />
            </motion.button>
          </div>
          
          {messageLoading ? (
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-pink-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                className="w-3 h-3 bg-purple-400 rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                className="w-3 h-3 bg-pink-400 rounded-full"
              />
              <span className="text-gray-600 ml-2">Generating your message...</span>
            </div>
          ) : currentMessage ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-gray-700 leading-relaxed"
            >
              {currentMessage.message}
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">AI Insights</h2>
              <p className="text-gray-600">Personalized recommendations just for you 💕</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refreshInsights}
            disabled={refreshing}
            className="p-2 bg-pink-100 hover:bg-pink-200 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-5 h-5 text-pink-600 ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-pink-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.icon}
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="p-6">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No insights for this category yet
            </h3>
            <p className="text-gray-500">
              Keep tracking your health journey and we'll provide more personalized insights! 🌸
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInsights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-gray-50 rounded-2xl p-5 border-l-4 ${getInsightBorderColor(insight.priority)} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getInsightIcon(insight)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-800">{insight.title}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-600`}>
                          {insight.confidence}% confidence
                        </span>
                        <span className="text-2xl">{insight.icon}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-3">{insight.message}</p>
                    
                    {insight.actionable && insight.actions && (
                      <div className="flex flex-wrap gap-2">
                        {insight.actions.map((action, actionIndex) => (
                          <motion.button
                            key={actionIndex}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleInsightAction(action.action)}
                            className="flex items-center space-x-1 px-3 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-xl transition-colors"
                          >
                            <span>{action.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </motion.button>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span className="capitalize">{insight.category} • {insight.priority} priority</span>
                      <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AIInsightsDashboard;
