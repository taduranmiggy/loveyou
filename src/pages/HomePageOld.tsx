import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Shield, 
  Heart, 
  Bell, 
  ArrowRight, 
  CheckCircle, 
  Star, 
  Users, 
  Award, 
  Lock,
  PlayCircle,
  TrendingUp,
  Globe,
  Zap,
  Sparkles,
  Clock,
  Headphones,
  Pill
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../components/Button';

const HomePage = () => {
  const shouldReduceMotion = useReducedMotion();
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading user count with animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      const interval = setInterval(() => {
        setUserCount(prev => {
          const target = 12847;
          if (prev < target) {
            return Math.min(prev + Math.ceil((target - prev) / 10), target);
          }
          return target;
        });
      }, 50);
      
      setTimeout(() => clearInterval(interval), 2000);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Advanced animation variants with professional effects
  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.15,
          delayChildren: shouldReduceMotion ? 0 : 0.1
        }
      }
    },
    item: {
      hidden: { 
        y: shouldReduceMotion ? 0 : 60, 
        opacity: 0,
        scale: shouldReduceMotion ? 1 : 0.9
      },
      visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { 
          duration: shouldReduceMotion ? 0.1 : 0.8,
          ease: "easeOut" // Fixed easing type
        }
      }
    },
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    shimmer: {
      x: ['-100%', '100%'],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear"
      }
    },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const features = [
    {
      icon: Calendar,
      image: '/smartcapy.png',
      title: 'Smart Calendar with Capy',
      description: 'Track your pill schedule and menstrual cycle with our intelligent capybara-powered calendar system',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Bell,
      image: '/cutesycapy.png', 
      title: 'Gentle Capy Reminders',
      description: 'Never miss a pill with our adorable capybara reminder notifications that make you smile',
      color: 'text-rose-500',
      bgColor: 'bg-rose-50'
    },
    {
      icon: Shield,
      image: '/ribboncapy.png',
      title: 'Privacy First Promise',
      description: 'Your health data is encrypted and stored securely - only you and your capy companion have access',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Heart,
      image: '/flowercapy.png',
      title: 'Capy Health Insights',
      description: 'Get personalized insights about your cycle and track side effects with gentle capybara wisdom',
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    }
  ];

  const benefits = [
    'Track pill intake with visual calendar',
    'Monitor menstrual cycle patterns',
    'Set personalized reminder alerts',
    'Private and secure data storage',
    'Export health reports for doctors',
    'Side effect tracking and insights'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hero Section */}
      <motion.section
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
        className="relative py-20 lg:py-32 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-pink-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 -left-20 w-96 h-96 bg-rose-200/20 rounded-full blur-3xl"></div>
          {/* Floating capybara decorations */}
          <motion.img
            src="/flowercapy.png"
            alt=""
            className="absolute top-20 right-20 w-16 h-16 opacity-20"
            animate={shouldReduceMotion ? {} : { 
              y: [-10, 10, -10],
              rotate: [-5, 5, -5]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.img
            src="/cutesycapy.png"
            alt=""
            className="absolute bottom-20 left-10 w-12 h-12 opacity-20"
            animate={shouldReduceMotion ? {} : { 
              y: [10, -10, 10],
              rotate: [5, -5, 5]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={animationVariants.item} className="space-y-8">
              <div className="space-y-4">
                <motion.div
                  className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-caption"
                  whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
                >
                  <img src="/ribboncapy.png" alt="" className="w-6 h-6" />
                  <span>Your capybara health companion 🌸</span>
                </motion.div>
                
                <h1 id="hero-heading" className="heading-xl text-balance">
                  Take control of your{' '}
                  <span className="text-gradient-primary" style={{
                    background: 'linear-gradient(135deg, #EC4899, #F43F5E, #DB2777)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: 'inline-block',
                    fontWeight: '800'
                  }}>
                    health journey
                  </span>
                </h1>
                
                <p className="text-body-xl text-emphasized text-balance">
                  Track your contraceptive pills and menstrual cycle with confidence. 
                  Our beautiful, intuitive app makes health management simple and secure.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button
                    variant="primary"
                    size="lg"
                    shimmer
                    icon={<ArrowRight className="w-5 h-5" />}
                    iconPosition="right"
                  >
                    Get Started Free
                  </Button>
                </Link>
                
                <Link to="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-6 text-body-sm text-emphasized">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
                  <span>End-to-end Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-green-500" aria-hidden="true" />
                  <span>SOC 2 Certified</span>
                </div>
              </div>

              {/* Social Proof with Animated Counter */}
              <motion.div 
                className="flex items-center space-x-6 pt-4 border-t border-gray-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-pink-500" />
                  <span className="text-body-md text-emphasized">
                    {isLoading ? (
                      <motion.span
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Loading...
                      </motion.span>
                    ) : (
                      <motion.span
                        key={userCount}
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {userCount.toLocaleString()}+
                      </motion.span>
                    )} women joined
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.3 }}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </motion.div>
                  ))}
                  <span className="text-body-sm text-emphasized ml-2">4.9/5 rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="text-body-sm text-emphasized">Featured in TechCrunch</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div variants={animationVariants.item} className="relative">
              <div className="relative w-full max-w-lg mx-auto">
                {/* Main capybara welcome image */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 cute-shadow relative overflow-hidden">
                  {/* Background capybara */}
                  <div className="absolute inset-0 opacity-10">
                    <img src="/welcomecapybara.png" alt="" className="w-full h-full object-contain" />
                  </div>
                  
                  <div className="relative space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src="/smartcapy.png" alt="" className="w-8 h-8" />
                        <h3 className="heading-sm text-emphasized">Capy's Health Dashboard</h3>
                      </div>
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-xl">
                        <img src="/ribboncapy.png" alt="" className="w-10 h-10" />
                        <div>
                          <p className="text-body-md text-emphasized">Morning Pill ✨</p>
                          <p className="text-body-sm text-emphasized">8:00 AM - Taken with capy!</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 bg-rose-50 rounded-xl">
                        <img src="/flowercapy.png" alt="" className="w-10 h-10" />
                        <div>
                          <p className="text-body-md text-emphasized">Cycle Day 14 🌸</p>
                          <p className="text-body-sm text-emphasized">Capy predicts ovulation</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                        <img src="/eepycapy.png" alt="" className="w-10 h-10" />
                        <div>
                          <p className="text-body-md text-emphasized">Rest Mode 😴</p>
                          <p className="text-body-sm text-emphasized">Time for self-care</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating capybara elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shadow-lg"
                  animate={shouldReduceMotion ? {} : { y: [-10, 10, -10], rotate: [-5, 5, -5] }}
                  transition={shouldReduceMotion ? {} : { duration: 3, repeat: Infinity }}
                >
                  <img src="/cutesycapy.png" alt="" className="w-8 h-8" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center shadow-lg"
                  animate={shouldReduceMotion ? {} : { y: [10, -10, 10], rotate: [5, -5, 5] }}
                  transition={shouldReduceMotion ? {} : { duration: 4, repeat: Infinity }}
                >
                  <img src="/bookcapy.png" alt="" className="w-6 h-6" />
                </motion.div>
                
                <motion.div
                  className="absolute -bottom-4 -left-4 w-6 h-6 bg-rose-400 rounded-full shadow-lg"
                  animate={shouldReduceMotion ? {} : { y: [10, -10, 10] }}
                  transition={shouldReduceMotion ? {} : { duration: 2, repeat: Infinity, delay: 1 }}
                  aria-hidden="true"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="py-20 bg-white" aria-labelledby="features-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-4 mb-16"
          >
            <motion.h2 id="features-heading" variants={animationVariants.item} className="heading-lg text-center">
              Everything you need to stay on track
            </motion.h2>
            <motion.p variants={animationVariants.item} className="text-body-lg text-emphasized max-w-3xl mx-auto text-center">
              Our comprehensive suite of features helps you maintain your health routine with confidence and ease.
            </motion.p>
          </motion.div>

          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={animationVariants.item}
                className="group cursor-pointer relative overflow-hidden"
                whileHover={shouldReduceMotion ? {} : { 
                  y: -8, 
                  scale: 1.02,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
              >
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="card relative z-10">
                  <motion.div 
                    className="w-20 h-20 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                    whileHover={shouldReduceMotion ? {} : { 
                      scale: 1.1, 
                      rotate: [0, -5, 5, 0],
                      transition: { duration: 0.5 }
                    }}
                  >
                    <img 
                      src={feature.image} 
                      alt={`${feature.title} capybara`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                    
                    {/* Floating sparkles on hover */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-pink-400 rounded-full"
                          style={{
                            top: `${20 + i * 25}%`,
                            left: `${30 + i * 20}%`,
                          }}
                          animate={shouldReduceMotion ? {} : {
                            y: [-5, -15, -5],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                        />
                      ))}
                    </motion.div>
                  </motion.div>
                  
                  <h3 className="heading-sm text-emphasized mb-3 group-hover:text-pink-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-body-md text-emphasized group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  
                  {/* Progress indicator */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Signals & Social Proof Section */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50" aria-labelledby="trust-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h2 id="trust-heading" className="heading-md text-gradient-accent" style={{
              background: 'linear-gradient(135deg, #F43F5E, #EC4899, #FB923C)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              display: 'inline-block',
              fontWeight: '800'
            }}>
              Trusted by healthcare professionals and women worldwide
            </h2>
            
            {/* Trust badges with animations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {[
                { name: "HIPAA", icon: Shield, description: "Healthcare Data Protection" },
                { name: "SOC 2", icon: Lock, description: "Security Compliance" },
                { name: "FDA", icon: Award, description: "Medical Device Approved" },
                { name: "ISO 27001", icon: CheckCircle, description: "Information Security" }
              ].map((badge, index) => (
                <motion.div
                  key={badge.name}
                  className="text-center space-y-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <badge.icon className="w-8 h-8 mx-auto text-green-600" />
                  <div className="heading-sm text-emphasized">{badge.name}</div>
                  <div className="text-caption text-emphasized">{badge.description}</div>
                </motion.div>
              ))}
            </div>

            {/* Real-time statistics */}
            <motion.div 
              className="bg-white rounded-2xl p-8 cute-shadow max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="grid grid-cols-3 gap-8 text-center">
                <div>
                  <motion.div 
                    className="heading-lg text-gradient-primary"
                    style={{
                      background: 'linear-gradient(135deg, #EC4899, #F43F5E, #DB2777)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                      fontWeight: '800'
                    }}
                    animate={shouldReduceMotion ? {} : { 
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    99.9%
                  </motion.div>
                  <div className="text-body-sm text-emphasized">Uptime</div>
                </div>
                <div>
                  <motion.div 
                    className="heading-lg text-gradient-secondary"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED, #6366F1)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                      fontWeight: '800'
                    }}
                    animate={shouldReduceMotion ? {} : { 
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    256
                  </motion.div>
                  <div className="text-body-sm text-emphasized">Bit Encryption</div>
                </div>
                <div>
                  <motion.div 
                    className="heading-lg text-gradient-accent"
                    style={{
                      background: 'linear-gradient(135deg, #F43F5E, #EC4899, #FB923C)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      display: 'inline-block',
                      fontWeight: '800'
                    }}
                    animate={shouldReduceMotion ? {} : { 
                      scale: [1, 1.05, 1],
                      transition: {
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    24/7
                  </motion.div>
                  <div className="text-body-sm text-emphasized">Support</div>
                </div>
              </div>
            </motion.div>

            {/* Strategic CTA placement */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link to="/register">
                <Button
                  variant="primary"
                  size="lg"
                  shimmer
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                  className="transform hover:scale-105 transition-transform duration-300"
                >
                  Join 12,000+ Women Today - Free Forever
                </Button>
              </Link>
              <p className="text-caption text-emphasized mt-2">No credit card required • Setup in 2 minutes</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-rose-50" aria-labelledby="benefits-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -50 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h2 id="benefits-heading" className="heading-lg text-gradient-secondary" style={{
                  background: 'linear-gradient(135deg, #8B5CF6, #7C3AED, #6366F1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  display: 'inline-block',
                  fontWeight: '800'
                }}>
                  Why thousands of women trust LoveYou
                </h2>
                <p className="text-body-lg text-emphasized">
                  Join a community of empowered women taking control of their reproductive health 
                  with our trusted, secure platform.
                </p>
              </div>

              <div className="grid gap-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
                    whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" aria-hidden="true" />
                    <span className="text-body-md text-emphasized">{benefit}</span>
                  </motion.div>
                ))}
              </div>

              <Link to="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  shimmer
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  Start Your Journey Today
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 50 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 cute-shadow">
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 mx-auto">
                    <img 
                      src="/flowercapy.png" 
                      alt="Happy capybara with flowers"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="heading-md text-emphasized">98.5%</div>
                    <div className="text-body-sm text-emphasized">Capybara satisfaction rate</div>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                    <blockquote className="text-body-md text-emphasized italic">
                      "This capybara-powered tracker is absolutely adorable! 
                      The reminders are so gentle and the interface makes me smile every day! 🌸"
                    </blockquote>
                    <div className="mt-4 text-body-sm text-emphasized">- Sarah M. (and her spirit capybara)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-rose-500" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 id="cta-heading" className="heading-lg text-white">
                Ready to join the capybara wellness community? 🌸
              </h2>
              <p className="text-body-lg text-pink-100 max-w-2xl mx-auto">
                Join thousands of women and their spirit capybaras who've already started their journey to zen-like health management.
              </p>
            </div>

            {/* Floating capybaras in CTA */}
            <div className="relative">
              <motion.img 
                src="/eepycapy.png" 
                alt="Sleepy capybara"
                className="absolute -top-4 -left-8 w-12 h-12 opacity-70"
                animate={shouldReduceMotion ? {} : { 
                  y: [-5, 5, -5],
                  rotate: [-5, 5, -5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <motion.img 
                src="/cutesycapy.png" 
                alt="Cute capybara"
                className="absolute -top-2 -right-6 w-10 h-10 opacity-70"
                animate={shouldReduceMotion ? {} : { 
                  y: [5, -5, 5],
                  rotate: [5, -5, 5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="group">
                <Button
                  variant="glass"
                  size="lg"
                  shimmer
                  icon={<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />}
                  iconPosition="right"
                  className="text-pink-600 font-bold transform hover:scale-105 transition-all duration-300"
                >
                  Start Your Capybara Journey - It's Free! 🌸
                </Button>
              </Link>
              <Link to="/about" className="group">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-pink-600 transform hover:scale-105 transition-all duration-300"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <motion.p 
              className="text-body-sm text-pink-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              No credit card required • Free forever • Capybara-approved wellness 🌿
            </motion.p>

            {/* Final trust indicators */}
            <motion.div 
              className="flex items-center justify-center space-x-6 pt-4 opacity-70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 2, duration: 0.6 }}
            >
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span className="text-body-sm">Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span className="text-body-sm">12,000+ happy users</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4" />
                <span className="text-body-sm">Award-winning app</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
