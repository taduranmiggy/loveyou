import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Calendar, Clock, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';
import { Input } from '../components/Input';
import { useNavigate } from 'react-router-dom';

interface OnboardingData {
  nickname: string;
  pillType: string;
  pillTime: string;
  cycleLength: number;
  lastPeriodDate: string;
  cycleRegularity: 'regular' | 'irregular' | 'not-sure';
  previousContraception: string;
  healthConditions: string[];
  goals: string[];
}

const OnboardingPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState<OnboardingData>({
    nickname: '',
    pillType: '',
    pillTime: '08:00',
    cycleLength: 28,
    lastPeriodDate: '',
    cycleRegularity: 'regular',
    previousContraception: '',
    healthConditions: [],
    goals: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const pillTypes = [
    'Combined Pill (Estrogen + Progestin)',
    'Mini Pill (Progestin Only)',
    'Extended Cycle Pill',
    'Not sure / Need advice'
  ];

  const contraceptionOptions = [
    'None - First time user',
    'Different birth control pill',
    'Condoms only',
    'IUD (Copper)',
    'IUD (Hormonal)',
    'Implant',
    'Injection',
    'Patch',
    'Ring',
    'Other'
  ];

  const healthConditionOptions = [
    'PCOS (Polycystic Ovary Syndrome)',
    'Endometriosis',
    'Heavy periods',
    'Irregular periods',
    'Severe cramps',
    'Migraines',
    'Blood clots history',
    'High blood pressure',
    'Depression/Anxiety',
    'None of the above'
  ];

  const goalOptions = [
    'Prevent pregnancy',
    'Regulate menstrual cycle',
    'Reduce period pain',
    'Lighter periods',
    'Clear skin/Reduce acne',
    'Manage PCOS symptoms',
    'Manage endometriosis',
    'Track cycle health',
    'Better time management'
  ];

  const handleInputChange = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayToggle = (field: 'healthConditions' | 'goals', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.nickname.trim()) {
          newErrors.nickname = 'Please enter your nickname';
        }
        break;
      case 2:
        if (!formData.pillType) {
          newErrors.pillType = 'Please select your pill type';
        }
        break;
      case 3:
        if (!formData.lastPeriodDate) {
          newErrors.lastPeriodDate = 'Please enter your last period date';
        }
        if (formData.cycleLength < 21 || formData.cycleLength > 40) {
          newErrors.cycleLength = 'Cycle length should be between 21-40 days';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const completeOnboarding = () => {
    if (user) {
      updateUser({
        nickname: formData.nickname,
        hasCompletedOnboarding: true,
        onboardingData: formData
      });
      navigate('/dashboard');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/cutesycapy.png" 
                alt="Cute capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [-5, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to LoveYou! 🌸</h2>
              <p className="text-gray-600">Let's start by getting to know you better</p>
            </div>
            
            <Input
              label="What should we call you? 💕"
              placeholder="Enter your nickname (e.g., Diane, Lady D, etc.)"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              error={errors.nickname}
              leftIcon={<Heart className="w-5 h-5" />}
            />
            
            <div className="text-sm text-gray-500 text-center">
              This will be used to personalize your experience throughout the app
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/smartcapy.png" 
                alt="Smart capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  y: [-3, 3, -3]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">About Your Pill 💊</h2>
              <p className="text-gray-600">Help us understand your contraceptive needs</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What type of contraceptive pill are you taking?
              </label>
              <div className="space-y-3">
                {pillTypes.map((type) => (
                  <motion.button
                    key={type}
                    onClick={() => handleInputChange('pillType', type)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      formData.pillType === type
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300 hover:bg-pink-25'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.pillType === type
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`} />
                      <span className="font-medium">{type}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
              {errors.pillType && (
                <p className="text-red-600 text-sm mt-2">{errors.pillType}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Preferred pill time ⏰"
                type="time"
                value={formData.pillTime}
                onChange={(e) => handleInputChange('pillTime', e.target.value)}
                leftIcon={<Clock className="w-5 h-5" />}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/flowercapy.png" 
                alt="Flower capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  rotate: [-3, 3, -3]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cycle Information 🌺</h2>
              <p className="text-gray-600">This helps us predict and track your menstrual cycle</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Last period start date 📅"
                type="date"
                value={formData.lastPeriodDate}
                onChange={(e) => handleInputChange('lastPeriodDate', e.target.value)}
                error={errors.lastPeriodDate}
                leftIcon={<Calendar className="w-5 h-5" />}
              />
              
              <Input
                label="Average cycle length (days)"
                type="number"
                min="21"
                max="40"
                value={formData.cycleLength}
                onChange={(e) => handleInputChange('cycleLength', parseInt(e.target.value))}
                error={errors.cycleLength}
                leftIcon={<Calendar className="w-5 h-5" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How regular is your cycle?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { value: 'regular', label: 'Regular', desc: '± 2 days' },
                  { value: 'irregular', label: 'Irregular', desc: 'Varies significantly' },
                  { value: 'not-sure', label: 'Not Sure', desc: 'Need to track more' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    onClick={() => handleInputChange('cycleRegularity', option.value)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.cycleRegularity === option.value
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm opacity-70">{option.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/bookcapy.png" 
                alt="Book capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Previous Contraception 📋</h2>
              <p className="text-gray-600">What were you using before? (Optional)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Previous contraceptive method
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contraceptionOptions.map((option) => (
                  <motion.button
                    key={option}
                    onClick={() => handleInputChange('previousContraception', option)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.previousContraception === option
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full border-2 ${
                        formData.previousContraception === option
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`} />
                      <span className="text-sm font-medium">{option}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/eepycapy.png" 
                alt="Sleepy capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  y: [-2, 2, -2]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Health Considerations 🏥</h2>
              <p className="text-gray-600">Help us provide better tracking (Select all that apply)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have any of these conditions?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {healthConditionOptions.map((condition) => (
                  <motion.button
                    key={condition}
                    onClick={() => handleArrayToggle('healthConditions', condition)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.healthConditions.includes(condition)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData.healthConditions.includes(condition)
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.healthConditions.includes(condition) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{condition}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.img 
                src="/ribboncapy.png" 
                alt="Ribbon capybara"
                className="w-24 h-24 mx-auto mb-4"
                animate={{ 
                  rotate: [-5, 5, -5],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals 🎯</h2>
              <p className="text-gray-600">What do you hope to achieve? (Select all that apply)</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your health and wellness goals
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {goalOptions.map((goal) => (
                  <motion.button
                    key={goal}
                    onClick={() => handleArrayToggle('goals', goal)}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      formData.goals.includes(goal)
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-pink-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        formData.goals.includes(goal)
                          ? 'border-pink-500 bg-pink-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.goals.includes(goal) && (
                          <div className="w-2 h-2 bg-white rounded-sm" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{goal}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-pink-200">
              <h3 className="font-bold text-gray-900 mb-2">🎉 You're all set!</h3>
              <p className="text-gray-600 text-sm">
                Ready to start your personalized wellness journey with your capybara companions! 
                We'll use this information to provide you with the best tracking experience.
              </p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8 lg:pt-28">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold text-gray-900">Getting Started</h1>
            <span className="text-sm text-gray-500">{currentStep} of {totalSteps}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 1}
            icon={<ChevronLeft className="w-5 h-5" />}
            iconPosition="left"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              variant="primary"
              onClick={nextStep}
              icon={<ChevronRight className="w-5 h-5" />}
              iconPosition="right"
              shimmer
            >
              Continue
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={completeOnboarding}
              icon={<Target className="w-5 h-5" />}
              iconPosition="right"
              shimmer
            >
              Complete Setup 🎉
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
