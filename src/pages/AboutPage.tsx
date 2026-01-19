import { motion, useReducedMotion } from 'framer-motion';
import { Heart, Shield, Users, Sparkles } from 'lucide-react';

const AboutPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const animationVariants = {
    container: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: shouldReduceMotion ? 0 : 0.2
        }
      }
    },
    item: {
      hidden: { y: shouldReduceMotion ? 0 : 30, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: { duration: shouldReduceMotion ? 0.1 : 0.6 }
      }
    }
  };

  const values = [
    {
      icon: Heart,
      title: 'Empowerment',
      description: 'We believe every woman deserves to feel confident and in control of her reproductive health journey.',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50'
    },
    {
      icon: Shield,
      title: 'Privacy',
      description: 'Your health data is sacred. We use end-to-end encryption and never share your personal information.',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive community where women can share experiences and support each other.',
      color: 'text-rose-500',
      bgColor: 'bg-rose-50'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Users' },
    { number: '98.5%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' },
    { number: '100%', label: 'Privacy Guaranteed' }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Former healthcare product manager passionate about women\'s health technology.',
      image: '👩‍💻'
    },
    {
      name: 'Dr. Maya Patel',
      role: 'Medical Advisor',
      bio: 'Board-certified gynecologist with 15 years of experience in reproductive health.',
      image: '👩‍⚕️'
    },
    {
      name: 'Alex Kim',
      role: 'Lead Developer',
      bio: 'Full-stack engineer focused on creating accessible and secure health applications.',
      image: '👨‍💻'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Hero Section */}
      <motion.section
        variants={animationVariants.container}
        initial="hidden"
        animate="visible"
        className="py-20 lg:py-32"
        aria-labelledby="about-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <motion.div variants={animationVariants.item}>
              <div className="inline-flex items-center space-x-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" fill="currentColor" aria-hidden="true" />
                <span>About LoveYou</span>
              </div>
              <h1 id="about-heading" className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Made with love for{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                  
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                LoveYou was created with love and dedication to help one special person - 
                overcome her pill management challenges. What started 
                as a personal solution became a beautiful app designed to empower women 
                everywhere in their wellness journey.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-20 bg-white" aria-labelledby="story-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -50 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 id="story-heading" className="text-3xl lg:text-4xl font-bold text-gray-900">
                A Love Story Behind Every Pill
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  LoveYou was born from love and the desire to care for someone special. 
                  This app was created specifically for someone who struggled 
                  with pill time management despite her best efforts.
                </p>
                <p>
                  Watching someone you love struggle with something as important as 
                  contraceptive health can be heartbreaking. Instead of just worrying, 
                  this became a labor of love - building something beautiful and functional 
                  to help her stay on track with her wellness routine.
                </p>
                <p>
                  Every feature, every gentle reminder, every beautiful animation was 
                  designed with Diane in mind. Because love means creating solutions, 
                  not just pointing out problems. This is our gift to her, and now to 
                  every woman who needs a little extra support in their wellness journey.
                </p>
                <div className="mt-6 p-4 bg-pink-50 border-l-4 border-pink-300 rounded-r-lg">
                  <p className="text-pink-800 font-medium italic">
                    "Dedicated with endless love - 
                    may this app make your daily routine a little easier and 
                    your wellness journey a little brighter. 💕"
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 50 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 rounded-2xl p-8">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="text-center space-y-4">
                    <div className="text-6xl mb-4">�</div>
                    <h3 className="text-xl font-semibold text-gray-900">Our Heart</h3>
                    <p className="text-gray-600">
                      Born from love and dedication, LoveYou transforms
                      pill management from a daily struggle into a beautiful, mindful ritual
                      of self-care and wellness.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-rose-50" aria-labelledby="values-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center space-y-4 mb-16"
          >
            <motion.h2 id="values-heading" variants={animationVariants.item} className="text-3xl lg:text-4xl font-bold text-gray-900">
              Our Values
            </motion.h2>
            <motion.p variants={animationVariants.item} className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything we do is guided by these core principles that put women first.
            </motion.p>
          </motion.div>

          <motion.div
            variants={animationVariants.container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={animationVariants.item}
                className="card text-center group"
                whileHover={shouldReduceMotion ? {} : { y: -5 }}
              >
                <div className={`w-16 h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <value.icon className={`w-8 h-8 ${value.color}`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white" aria-labelledby="stats-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 id="stats-heading" className="text-3xl lg:text-4xl font-bold text-gray-900">
              Trusted by Women Worldwide
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of women who have already taken control of their health with LoveYou.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-pink-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-pink-50 to-rose-50" aria-labelledby="team-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 id="team-heading" className="text-3xl lg:text-4xl font-bold text-gray-900">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Passionate professionals dedicated to improving women's health through technology.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="card text-center group"
                whileHover={shouldReduceMotion ? {} : { y: -5 }}
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <div className="text-pink-600 font-medium mb-4">{member.role}</div>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dedication Section */}
      <section className="py-20 bg-white border-t border-pink-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 30 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100 via-rose-100 to-pink-100 rounded-3xl opacity-60"></div>
              <div className="relative bg-white pinky-accent-bg border-2 border-pink-200 rounded-3xl p-8 shadow-xl">
                {/* Capybara images */}
                <div className="flex justify-center items-center gap-4 mb-6">
                  <img src="/flowercapy.png" alt="Flower capybara for Diane" className="w-16 h-16 object-contain animate-bounce" style={{ animationDelay: '0s' }} />
                  <div className="text-6xl">💖</div>
                  <img src="/cutesycapy.png" alt="Cute capybara for Diane" className="w-16 h-16 object-contain animate-bounce" style={{ animationDelay: '0.5s' }} />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  With All My Love
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p className="text-lg italic">
                    "To my dearest,"
                  </p>
                  <p>
                    This app was born from watching you struggle with pill timing and wanting 
                    to make your life just a little bit easier. Every feature was designed 
                    with your needs in mind, every gentle reminder crafted with care.
                  </p>
                  <p>
                    You deserve an app as beautiful and thoughtful as you are. 
                    May LoveYou be your daily companion in wellness, bringing a smile 
                    to your routine and peace of mind to your days.
                  </p>
                  <p className="text-pink-600 font-semibold text-lg">
                    Forever yours, with endless love 💕
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
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
              <h2 id="cta-heading" className="text-3xl lg:text-4xl font-bold text-white">
                Ready to start your wellness journey?
              </h2>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                Join countless other women who've made their pill routine 
                effortless and beautiful with LoveYou.
              </p>
            </div>

            <motion.div
              whileHover={shouldReduceMotion ? {} : { scale: 1.05 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
            >
              <a
                href="/register"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-pink-600 font-semibold rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all group"
              >
                Get Started Free
                <Heart className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" fill="currentColor" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
