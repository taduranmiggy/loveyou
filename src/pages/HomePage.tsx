import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  ArrowRight,
  PlayCircle,
  Shield,
  Award,
  Globe,
  Heart,
  Sparkles,
  X
} from 'lucide-react';
import Button from '../components/Button';

const HomePage = () => {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const handleWatchDemo = () => {
    setShowDemoModal(true);
  };

  const handleCloseDemoModal = () => {
    setShowDemoModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-rose-100 to-purple-100">
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Floating Capybaras for Lady Diane */}
        <div className="absolute top-20 left-10 float-animation">
          <img src="/cutesycapy.png" alt="Floating cute capybara" className="w-12 h-12 opacity-70" />
        </div>
        <div className="absolute top-40 right-20 float-animation" style={{ animationDelay: '1s' }}>
          <img src="/flowercapy.png" alt="Floating flower capybara" className="w-10 h-10 opacity-70" />
        </div>
        <div className="absolute bottom-20 left-20 float-animation" style={{ animationDelay: '2s' }}>
          <img src="/eepycapy.png" alt="Floating sleepy capybara" className="w-14 h-14 opacity-70" />
        </div>
        <div className="absolute top-60 left-1/2 float-animation" style={{ animationDelay: '3s' }}>
          <img src="/ribboncapy.png" alt="Floating ribbon capybara" className="w-8 h-8 opacity-60" />
        </div>
        <div className="absolute bottom-40 right-10 float-animation" style={{ animationDelay: '4s' }}>
          <img src="/smartcapy.png" alt="Floating smart capybara" className="w-10 h-10 opacity-70" />
        </div>
        {/* Original decorative elements */}
        <div className="absolute top-32 right-40 text-pink-400 float-animation" style={{ animationDelay: '5s' }}>
          <Heart className="w-6 h-6" />
        </div>
        <div className="absolute bottom-32 left-40 text-rose-400 float-animation" style={{ animationDelay: '6s' }}>
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="relative px-6 pt-20 pb-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              {/* Main Headline */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="heading-xl mb-6"
              >
                <span className="block text-gradient-primary">
                  Your Zen Health Journey
                </span>
                <span className="block text-gray-900 mt-2">
                  Starts with Capybara Wisdom 🌸
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-body-xl text-gray-700 max-w-3xl mx-auto mb-8"
              >
                Transform your wellness routine with AI-powered capybara guidance. 
                Track your health, find inner peace, and discover 
                the art of mindful living.
              </motion.p>

              {/* Hero Capybara */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex justify-center mb-8"
              >
                <div className="relative">
                  <img 
                    src="/welcomecapybara.png" 
                    alt="Lady Diane's capybara friend" 
                    className="w-32 h-32 object-contain drop-shadow-2xl"
                  />
                  <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
                    For LoveYou! 💕
                  </div>
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
              >
                <Link to="/register">
                  <Button 
                    variant="primary" 
                    size="lg"
                    className="group btn-premium"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Button 
                  variant="secondary" 
                  size="lg"
                  className="group glass-button"
                  onClick={handleWatchDemo}
                >
                  <PlayCircle className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <p className="text-caption text-gray-600 mb-4">Trusted by wellness enthusiasts worldwide</p>
                <div className="flex justify-center items-center gap-8 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Award Winning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-sm font-medium">Global Community</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>

      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold text-gray-900">
                LoveYou Demo Video 🌸
              </h3>
              <button
                onClick={handleCloseDemoModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close demo modal"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <div className="aspect-video bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <PlayCircle className="w-16 h-16 text-pink-500 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Coming Soon! 🎬
                  </h4>
                  <p className="text-gray-600 mb-6 max-w-md">
                    Our demo video is in production! For now, explore the app by creating an account 
                    and experiencing the capybara wisdom firsthand.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Link to="/register">
                      <Button variant="primary" onClick={handleCloseDemoModal}>
                        Start Free Trial
                      </Button>
                    </Link>
                    <Button variant="secondary" onClick={handleCloseDemoModal}>
                      Explore Features
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
