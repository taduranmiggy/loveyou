import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Bell, 
  Shield, 
  Star, 
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

const Landing = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const features = [
    {
      icon: Calendar,
      title: "Smart Tracking",
      description: "Never miss a pill with our intelligent calendar system and personalized reminders."
    },
    {
      icon: Bell,
      title: "Custom Reminders",
      description: "Set up notifications that work with your schedule and lifestyle."
    },
    {
      icon: Heart,
      title: "Health Insights",
      description: "Track your progress and get insights about your contraceptive journey."
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your health data is encrypted and completely private - only you have access."
    }
  ];

  const testimonials = [
    {
      name: "Sarah M.",
      text: "Milady has completely changed how I manage my birth control. The cute capybara reminders make it so much easier!",
      rating: 5
    },
    {
      name: "Maria L.",
      text: "Finally, a pill tracker that's both functional and adorable. I love the pink theme and helpful features.",
      rating: 5
    },
    {
      name: "Jessica K.",
      text: "The streak tracking keeps me motivated, and I never forget my pills anymore. Highly recommend!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <img 
                src="/src/assets/welcomecapybara.png" 
                alt="Milady Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                Milady
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-pink-700 hover:text-pink-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-pink-700 hover:text-pink-900 transition-colors">How it Works</a>
              <a href="#about" className="text-pink-700 hover:text-pink-900 transition-colors">About</a>
              <a href="#contact" className="text-pink-700 hover:text-pink-900 transition-colors">Contact</a>
              <Link 
                to="/demo" 
                className="group relative bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  🦫 <span>Components</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                </span>
              </Link>
              <Link 
                to="/offline-demo" 
                className="group relative bg-gradient-to-r from-rose-400 to-pink-500 text-white px-3 py-2 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  � <span>PWA Demo</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">💕</span>
                </span>
              </Link>
              <Link 
                to="/login" 
                className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-pink-700 hover:text-pink-900"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden bg-white rounded-lg shadow-lg mt-2 p-4"
            >
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-pink-700 hover:text-pink-900">Features</a>
                <a href="#how-it-works" className="text-pink-700 hover:text-pink-900">How it Works</a>
                <a href="#about" className="text-pink-700 hover:text-pink-900">About</a>
                <a href="#contact" className="text-pink-700 hover:text-pink-900">Contact</a>
                <Link 
                  to="/demo" 
                  className="group relative bg-gradient-to-r from-pink-400 to-pink-500 text-white px-4 py-2 rounded-full hover:from-pink-500 hover:to-pink-600 transition-all duration-300 text-center text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    🦫 <span>Components Demo</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">✨</span>
                  </span>
                </Link>
                <Link 
                  to="/offline-demo" 
                  className="group relative bg-gradient-to-r from-rose-400 to-pink-500 text-white px-4 py-2 rounded-full hover:from-rose-500 hover:to-pink-600 transition-all duration-300 text-center text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    � <span>PWA Offline Demo</span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">💕</span>
                  </span>
                </Link>
                <Link 
                  to="/login" 
                  className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors text-center"
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-pink-800 mb-6">
                Your Cute
                <span className="block bg-gradient-to-r from-pink-600 to-pink-800 bg-clip-text text-transparent">
                  Pill Companion
                </span>
              </h1>
              <p className="text-xl text-pink-700 mb-8 leading-relaxed">
                Meet Milady - the most adorable way to track your contraceptive pills. 
                Never miss a dose again with our cute capybara friend cheering you on! 🦫💕
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-pink-600 to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-700 hover:to-pink-800 transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Start Tracking <ChevronRight className="ml-2" size={20} />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-pink-600 text-pink-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-pink-600 hover:text-white transition-all flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <motion.img 
                  src="/src/assets/smartcapybara.png" 
                  alt="Smart Capybara" 
                  className="w-96 h-96 object-contain mx-auto cursor-pointer"
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    // Create a fun response when clicked
                    const messages = [
                      "Hi there! I'm excited to help you! 🦫✨",
                      "Ready to start your pill tracking journey? 💕",
                      "I'll be your cute companion every step of the way! 🌸",
                      "Click 'Start Tracking' to begin! 🎉",
                      "Together we'll never miss a pill! 💊💖"
                    ];
                    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                    
                    // Show toast notification
                    import('react-hot-toast').then(toast => {
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
                        icon: '🦫'
                      });
                    });
                  }}
                />
              </div>
              {/* Floating elements */}
              <motion.div
                className="absolute top-10 right-10 bg-pink-200 rounded-full p-4"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                <Heart className="text-pink-600" size={24} />
              </motion.div>
              <motion.div
                className="absolute bottom-20 left-10 bg-pink-300 rounded-full p-4"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Calendar className="text-pink-700" size={24} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-pink-800 mb-4">
              Why Choose Milady? 🌸
            </h2>
            <p className="text-xl text-pink-600 max-w-3xl mx-auto">
              We've designed every feature with love and care to make your contraceptive journey as smooth and delightful as possible.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="glass rounded-3xl p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="text-pink-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-4">{feature.title}</h3>
                <p className="text-pink-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-pink-800 mb-4">
              How Milady Works ✨
            </h2>
            <p className="text-xl text-pink-600">
              Getting started is as easy as 1-2-3!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Create Your Profile",
                description: "Sign up and tell us about your pill type and preferences. Meet your capybara companion!",
                image: "/src/assets/welcomecapybara.png"
              },
              {
                step: "2", 
                title: "Set Your Schedule",
                description: "Choose your preferred pill time and customize reminder settings that work for you.",
                image: "/src/assets/smartcapybara.png"
              },
              {
                step: "3",
                title: "Track & Celebrate",
                description: "Mark your daily pills, build streaks, and celebrate milestones with your capybara friend!",
                image: "/src/assets/cutesycapybara.png"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                    {step.step}
                  </div>
                  <motion.img 
                    src={step.image} 
                    alt={step.title}
                    className="w-32 h-32 object-contain mx-auto cursor-pointer"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    whileTap={{ scale: 0.9, rotate: -10 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => {
                      const stepMessages = {
                        1: ["Welcome! I'm so happy you're here! 🦫💕", "Let's create your perfect profile together! ✨", "I can't wait to be your pill buddy! 🌸"],
                        2: ["Time management is my specialty! ⏰", "I'll help you never forget! 💊", "We'll find the perfect schedule for you! 🗓️"],
                        3: ["Every pill taken is a victory! 🎉", "I'm so proud of your consistency! 🌟", "Let's celebrate your amazing streak! 🎊"]
                      };
                      
                      const messages = stepMessages[step.step] || ["You're amazing! 🦫💖"];
                      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
                      
                      import('react-hot-toast').then(toast => {
                        toast.success(randomMessage, {
                          duration: 2500,
                          style: {
                            background: '#fce7f3',
                            color: '#831843',
                            border: '2px solid #f9a8d4',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '500'
                          },
                          icon: '🦫'
                        });
                      });
                    }}
                  />
                </div>
                <h3 className="text-2xl font-bold text-pink-800 mb-4">{step.title}</h3>
                <p className="text-pink-600 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-pink-800 mb-4">
              What Our Users Say 💕
            </h2>
            <p className="text-xl text-pink-600">
              Join thousands of happy users who love their Milady experience!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-3xl p-8"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-current" size={20} />
                  ))}
                </div>
                <p className="text-pink-700 mb-6 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-pink-800">- {testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-pink-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-pink-800 mb-6">
                About Milady 🦫
              </h2>
              <p className="text-lg text-pink-700 mb-6 leading-relaxed">
                Milady was born from the idea that healthcare should be both effective and enjoyable. 
                We believe that taking care of your reproductive health shouldn't feel like a chore.
              </p>
              <p className="text-lg text-pink-700 mb-6 leading-relaxed">
                Our cute capybara mascot represents the calm, consistent approach we want you to have 
                towards your contraceptive routine. Just like capybaras are known for their peaceful 
                and reliable nature, we want your pill-taking experience to be stress-free and dependable.
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-pink-100 rounded-full p-3">
                  <Heart className="text-pink-600" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-pink-800">Made with Love</h4>
                  <p className="text-pink-600">Designed by women, for women</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <motion.img 
                src="/src/assets/bookscapybara.png" 
                alt="Books Capybara" 
                className="w-96 h-96 object-contain mx-auto cursor-pointer"
                animate={{ 
                  y: [0, -15, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const aboutMessages = [
                    "Did you know capybaras are the most chill animals? Just like your pill routine should be! 🦫😌",
                    "I love reading about health and wellness! Want to learn together? 📚💕",
                    "Capybaras are all about consistency - perfect for pill tracking! 🌸",
                    "Fun fact: Capybaras are social creatures, just like our community! 🤝✨",
                    "I'm here to make your health journey peaceful and reliable! 🦫💖"
                  ];
                  const randomMessage = aboutMessages[Math.floor(Math.random() * aboutMessages.length)];
                  
                  import('react-hot-toast').then(toast => {
                    toast.success(randomMessage, {
                      duration: 4000,
                      style: {
                        background: '#fce7f3',
                        color: '#831843',
                        border: '2px solid #f9a8d4',
                        borderRadius: '20px',
                        fontSize: '15px',
                        fontWeight: '500',
                        maxWidth: '400px'
                      },
                      icon: '📚'
                    });
                  });
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            {...fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-pink-800 mb-4">
              Get in Touch 📧
            </h2>
            <p className="text-xl text-pink-600">
              Have questions? We'd love to hear from you!
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: Mail,
                title: "Email Support",
                info: "support@milady.app",
                description: "Get help within 24 hours"
              },
              {
                icon: Phone,
                title: "Phone Support",
                info: "+1 (555) 123-4567",
                description: "Mon-Fri, 9AM-5PM EST"
              },
              {
                icon: MapPin,
                title: "Address",
                info: "123 Health Street",
                description: "Wellness City, WC 12345"
              }
            ].map((contact, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center glass rounded-3xl p-8"
              >
                <div className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                  <contact.icon className="text-pink-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-pink-800 mb-2">{contact.title}</h3>
                <p className="text-pink-600 font-semibold mb-2">{contact.info}</p>
                <p className="text-pink-500 text-sm">{contact.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-pink-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="/src/assets/welcomecapybara.png" 
                  alt="Milady Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-2xl font-bold">Milady</span>
              </div>
              <p className="text-pink-200">
                Your cute companion for contraceptive care. 
                Making health tracking delightful! 🦫💕
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-pink-200 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="block text-pink-200 hover:text-white transition-colors">How it Works</a>
                <a href="#about" className="block text-pink-200 hover:text-white transition-colors">About</a>
                <a href="#contact" className="block text-pink-200 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-pink-200 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-pink-200 hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="block text-pink-200 hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="block text-pink-200 hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Stay Connected</h4>
              <p className="text-pink-200 mb-4">
                Get updates and health tips directly to your inbox!
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-full text-pink-800 focus:outline-none"
                />
                <button className="bg-pink-600 px-6 py-2 rounded-r-full hover:bg-pink-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-pink-700 mt-8 pt-8 text-center">
            <p className="text-pink-200">
              © 2025 Milady. Made with 💕 for your health and happiness.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
