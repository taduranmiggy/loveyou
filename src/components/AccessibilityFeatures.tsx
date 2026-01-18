import { motion } from 'framer-motion';
import { 
  Eye, 
  Ear, 
  Keyboard, 
  Users, 
  CheckCircle, 
  Heart,
  Sparkles,
  Volume2,
  Monitor,
  Smartphone
} from 'lucide-react';
import { Badge } from './Badge';

const AccessibilityFeatures = () => {
  const features = [
    {
      icon: Eye,
      title: "Visual Accessibility",
      description: "Complete visual customization for all users",
      features: [
        "High contrast mode for improved visibility",
        "Dark mode support with automatic system detection",
        "Font size scaling from small to extra-large",
        "Color blind support for protanopia, deuteranopia, and tritanopia",
        "Reduced motion options for vestibular disorders",
        "Custom focus indicators with high visibility"
      ],
      badge: "WCAG 2.1 AA",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Ear,
      title: "Audio Accessibility", 
      description: "Voice announcements and audio feedback",
      features: [
        "Voice announcements for all interactions",
        "Screen reader compatibility (NVDA, JAWS, VoiceOver)",
        "Audio feedback for button clicks and navigation",
        "Customizable speech rate and volume",
        "Silent mode for environments requiring quiet use",
        "Alternative text for all images and icons"
      ],
      badge: "Screen Reader Ready",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard support without mouse dependency", 
      features: [
        "Complete keyboard navigation for all features",
        "Skip navigation links for faster content access",
        "Logical tab order throughout the application",
        "Keyboard shortcuts (Alt+A for accessibility panel)",
        "Focus trapping in modal dialogs",
        "Clear focus indicators on all interactive elements"
      ],
      badge: "Keyboard First",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Monitor,
      title: "Responsive Design",
      description: "Optimized for all devices and screen sizes",
      features: [
        "Mobile-first responsive design",
        "Touch-friendly interface with adequate target sizes",
        "Landscape and portrait orientation support", 
        "Zoom support up to 200% without horizontal scrolling",
        "Flexible layouts that adapt to content",
        "Consistent experience across all devices"
      ],
      badge: "Mobile Ready",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Cognitive Accessibility",
      description: "Clear, simple, and predictable interface design",
      features: [
        "Simple and intuitive navigation patterns",
        "Consistent layout and terminology throughout",
        "Clear error messages with suggested solutions",
        "Progress indicators for multi-step processes",
        "Auto-save functionality to prevent data loss",
        "Contextual help and tooltips"
      ],
      badge: "User Friendly",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Smartphone,
      title: "Assistive Technology",
      description: "Full compatibility with assistive devices",
      features: [
        "Switch navigation support for users with motor disabilities",
        "Voice control compatibility",
        "Eye-tracking software support",
        "Head mouse and alternative pointer support",
        "Sticky keys and filter keys compatibility",
        "High contrast and magnification tool support"
      ],
      badge: "AT Compatible",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const standards = [
    { name: "WCAG 2.1 AA", description: "Web Content Accessibility Guidelines Level AA compliance" },
    { name: "Section 508", description: "U.S. federal accessibility standards compliance" },
    { name: "ADA", description: "Americans with Disabilities Act compliance" },
    { name: "EN 301 549", description: "European accessibility standard compliance" }
  ];

  return (
    <div className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Heart className="w-12 h-12 text-pink-500" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-6 h-6 text-purple-500" />
              </motion.div>
            </div>
          </div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Accessibility First Design ♿
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            LoveYou is designed to be usable by everyone, regardless of ability. 
            We believe healthcare should be accessible to all women.
          </p>

          {/* Standards Compliance */}
          <div className="flex flex-wrap justify-center gap-3">
            {standards.map((standard, index) => (
              <div key={index} title={standard.description}>
                <Badge 
                  variant="primary" 
                  className="cursor-help"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  {standard.name}
                </Badge>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon and Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <Badge variant="secondary" size="sm">
                  {feature.badge}
                </Badge>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {feature.description}
              </p>

              {/* Feature List */}
              <ul className="space-y-2">
                {feature.features.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Quick Access Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 text-center"
        >
          <Volume2 className="w-12 h-12 text-pink-600 mx-auto mb-4" />
          
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Quick Accessibility Access
          </h3>
          
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Use the floating accessibility button (⚙️) in the top-right corner or press 
            <kbd className="bg-white px-2 py-1 rounded border mx-1 font-mono text-sm">Alt + A</kbd> 
            to quickly access all accessibility options.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-lg p-4">
              <Eye className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Visual Settings</h4>
              <p className="text-sm text-gray-600">High contrast, dark mode, font sizing</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <Volume2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Audio Features</h4>
              <p className="text-sm text-gray-600">Voice announcements and audio feedback</p>
            </div>
            
            <div className="bg-white rounded-lg p-4">
              <Keyboard className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Navigation</h4>
              <p className="text-sm text-gray-600">Keyboard shortcuts and reduced motion</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 p-6 bg-white rounded-xl border border-pink-200"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Need Accessibility Support?
          </h3>
          <p className="text-gray-600 mb-4">
            We're committed to improving accessibility. If you encounter any barriers or have suggestions, 
            please don't hesitate to contact us.
          </p>
          <p className="text-sm text-pink-600">
            📧 accessibility@loveyou.app | 📞 1-800-LOVEYOU-1
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessibilityFeatures;
