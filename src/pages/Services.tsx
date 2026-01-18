import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Shield, 
  Bell, 
  BarChart3, 
  Users, 
  Sparkles,
  Clock,
  Target,
  Award,
  Lock,
  Star
} from 'lucide-react';
import { Badge } from '../components/Badge';
import Button from '../components/Button';

const Services = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleLearnMore = (serviceTitle: string) => {
    // Navigate to a detailed service page or show modal
    const serviceId = serviceTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const element = document.getElementById(`service-${serviceId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: navigate to contact page with service inquiry
      navigate(`/contact?service=${encodeURIComponent(serviceTitle)}`);
    }
  };

  const handleViewPricing = () => {
    // Create a simple pricing modal or scroll to pricing section
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If no pricing section exists, navigate to register with pricing focus
      navigate('/register?plan=premium');
    }
  };
  const services = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "💊 Pill Tracking",
      description: "Never miss a pill again with our cute daily reminders and easy tracking system",
      features: [
        "Daily pill reminders with custom cute notifications",
        "Visual pill calendar with adorable icons",
        "Pill adherence tracking and statistics",
        "Multiple pill type support"
      ],
      color: "from-pink-400 to-rose-500",
      badge: "Most Popular"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "🌸 Cycle Monitoring", 
      description: "Track your menstrual cycle with beautiful visualizations and smart predictions",
      features: [
        "Period tracking with cute emoji mood indicators",
        "Cycle length analysis and predictions",
        "Fertility window calculations",
        "Symptom logging with customizable options"
      ],
      color: "from-rose-400 to-pink-500",
      badge: "Essential"
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "✨ Smart Reminders",
      description: "Gentle, personalized reminders that fit perfectly into your daily routine",
      features: [
        "Customizable reminder times and messages",
        "Smart snooze options for busy days",
        "Motivational quotes and cute encouragements",
        "Missed pill alerts with helpful suggestions"
      ],
      color: "from-purple-400 to-pink-500",
      badge: "New"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "📊 Health Insights",
      description: "Beautiful analytics that help you understand your body's patterns",
      features: [
        "Monthly and yearly health trend reports",
        "Side effect tracking and correlation analysis",
        "Personalized health recommendations",
        "Export data for healthcare provider visits"
      ],
      color: "from-pink-400 to-purple-500",
      badge: "Premium"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "🔒 Privacy First",
      description: "Your health data is precious - we keep it safe with top-tier security",
      features: [
        "End-to-end encryption for all personal data",
        "Local data storage with optional cloud backup",
        "No data sharing with third parties",
        "Complete data control and export options"
      ],
      color: "from-indigo-400 to-pink-500",
      badge: "Secure"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "👭 Community Support",
      description: "Connect with other users in a safe, supportive environment",
      features: [
        "Anonymous community forums and discussions",
        "Expert health tips and advice",
        "Peer support groups and challenges",
        "Educational resources and articles"
      ],
      color: "from-pink-400 to-rose-400",
      badge: "Coming Soon"
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Users", icon: <Heart className="w-5 h-5" /> },
    { number: "99.9%", label: "Uptime", icon: <Target className="w-5 h-5" /> },
    { number: "4.9★", label: "User Rating", icon: <Star className="w-5 h-5" /> },
    { number: "24/7", label: "Support", icon: <Clock className="w-5 h-5" /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 px-4 text-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-100/50 to-purple-100/50" />
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mb-8"
          >
            <Sparkles className="w-16 h-16 mx-auto text-pink-500 mb-4" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl font-bold text-gray-800 mb-6"
          >
            Our <span className="text-gradient-primary">Magical</span> Services ✨
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Discover how LoveYou makes contraceptive tracking beautiful, simple, and empowering for every woman 💕
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 cute-shadow"
              >
                <div className="text-pink-500 mb-2 flex justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Services Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Everything You Need 🌸
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From pill tracking to cycle monitoring, we've got all your reproductive health needs covered
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-white rounded-3xl p-8 cute-shadow hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                {/* Badge */}
                <div className="absolute top-4 right-4">
                  <Badge variant="primary" size="sm">
                    {service.badge}
                  </Badge>
                </div>

                {/* Icon */}
                <motion.div 
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.color} flex items-center justify-center text-white mb-6`}
                >
                  {service.icon}
                </motion.div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <motion.li
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + featureIndex * 0.05 }}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <div className="w-2 h-2 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                      {feature}
                    </motion.li>
                  ))}
                </ul>

                {/* CTA */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full group-hover:bg-pink-50 transition-colors"
                  onClick={() => handleLearnMore(service.title)}
                >
                  Learn More
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 px-4 bg-gradient-to-r from-pink-100 to-purple-100"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <Award className="w-16 h-16 mx-auto text-pink-500" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Start Your Journey? 💖
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of women who trust LoveYou with their reproductive health tracking. 
            Your wellness journey starts here!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="primary" 
              size="lg" 
              className="group"
              onClick={handleGetStarted}
            >
              Get Started Free
              <Heart className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={handleViewPricing}
            >
              View Pricing
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500"
          >
            <Lock className="w-4 h-4" />
            Your data is always encrypted and private
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Services;
