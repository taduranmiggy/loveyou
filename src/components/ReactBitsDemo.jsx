import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Calendar, Settings } from 'lucide-react';
import {
  MiladyButton,
  MiladyInput,
  MiladySelect,
  MiladyCard,
  MiladyProgress,
  MiladyBadge,
  MiladyCheckbox,
  MiladySwitch,
  MiladySkeleton
} from './MiladyComponents';
import { usePillTracking, useFormValidation, useLoveYouTheme } from '../hooks/useReactBits';
import Toast from '../utils/toast';

const ReactBitsDemo = () => {
  const [showDemo, setShowDemo] = useState('components');
  const { streak, totalTaken, markPillTaken } = usePillTracking();
  const { currentTheme, setTheme, themes } = useLoveYouTheme();

  // Demo form validation
  const { values, errors, setFieldValue, handleSubmit, isSubmitting } = useFormValidation(
    { name: '', email: '', pillType: '', notifications: true },
    {
      name: { required: true, minLength: 2, label: 'Full Name' },
      email: { required: true, email: true, label: 'Email Address' },
      pillType: { required: true, label: 'Pill Type' }
    }
  );

  const pillOptions = [
    { value: 'diane', label: 'Diane-35' },
    { value: 'althea', label: 'Althea' },
    { value: 'yasmin', label: 'Yasmin' },
    { value: 'trust', label: 'Trust' }
  ];

  const demoSections = {
    components: 'Component Showcase',
    hooks: 'Advanced Hooks',
    theming: 'Theme System'
  };

  const handleDemoSubmit = async (formData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    Toast.success(`Welcome ${formData.name}! Your settings have been saved! 🦫✨`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-pink-800 mb-4">
            React Bits + Milady Demo 🦫✨
          </h1>
          <p className="text-pink-600 text-lg">
            Showcasing enhanced UX components with React Bits integration
          </p>
        </motion.div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2">
            {Object.entries(demoSections).map(([key, label]) => (
              <MiladyButton
                key={key}
                variant={showDemo === key ? 'primary' : 'ghost'}
                onClick={() => setShowDemo(key)}
                className="px-4 py-2 text-sm"
              >
                {label}
              </MiladyButton>
            ))}
          </div>
        </div>

        {/* Component Showcase */}
        {showDemo === 'components' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Buttons Demo */}
            <Card title="Enhanced Buttons" capybara>
              <div className="space-y-3">
                <Button variant="primary" capybara onClick={() => markPillTaken()}>
                  Take Pill Today
                </Button>
                <Button variant="secondary" onClick={() => Toast.info('Coming soon! 🦫💭')}>
                  Set Reminder
                </Button>
                <Button variant="ghost" disabled>
                  Disabled Button
                </Button>
              </div>
            </Card>

            {/* Progress Demo */}
            <Card title="Progress Tracking" capybara>
              <div className="space-y-4">
                <Progress
                  value={streak}
                  max={30}
                  label="Monthly Streak"
                  capybara
                  color="pink"
                />
                <Progress
                  value={totalTaken}
                  max={21}
                  label="Cycle Progress"
                  color="green"
                />
                <div className="text-center">
                  <Badge variant="success" capybara>
                    {streak} Day Streak!
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Form Demo */}
            <Card title="Enhanced Form" capybara>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(handleDemoSubmit); }}>
                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    icon={User}
                    value={values.name}
                    onChange={(e) => setFieldValue('name', e.target.value)}
                    error={errors.name}
                    capybara
                  />
                  <Input
                    label="Email"
                    icon={Mail}
                    type="email"
                    value={values.email}
                    onChange={(e) => setFieldValue('email', e.target.value)}
                    error={errors.email}
                  />
                  <Select
                    label="Pill Type"
                    options={pillOptions}
                    value={values.pillType}
                    onChange={(value) => setFieldValue('pillType', value)}
                    error={errors.pillType}
                    capybara
                  />
                  <Button type="submit" loading={isSubmitting} capybara>
                    Save Settings
                  </Button>
                </div>
              </form>
            </Card>

            {/* Badges Demo */}
            <Card title="Status Badges" capybara>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success" capybara>Active</Badge>
                <Badge variant="warning">Reminder Set</Badge>
                <Badge variant="error">Missed</Badge>
                <Badge variant="default" capybara>Rest Day</Badge>
              </div>
            </Card>

            {/* Controls Demo */}
            <Card title="Interactive Controls" capybara>
              <div className="space-y-4">
                <Checkbox
                  label="Daily Reminders"
                  checked={values.notifications}
                  onChange={(checked) => setFieldValue('notifications', checked)}
                  capybara
                />
                <Switch
                  label="Dark Mode"
                  description="Switch to dark theme"
                  capybara
                />
                <Switch
                  label="Push Notifications"
                  description="Get notified on your phone"
                />
              </div>
            </Card>

            {/* Loading Demo */}
            <Card title="Loading States" capybara>
              <div className="space-y-4">
                <Skeleton lines={2} avatar capybara />
                <Button
                  loading
                  onClick={() => {}}
                  disabled
                >
                  Loading...
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Hooks Demo */}
        {showDemo === 'hooks' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card title="Pill Tracking Hook" capybara>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-pink-100 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-pink-800">{streak}</div>
                    <div className="text-pink-600">Day Streak</div>
                  </div>
                  <div className="bg-pink-100 rounded-2xl p-4">
                    <div className="text-2xl font-bold text-pink-800">{totalTaken}</div>
                    <div className="text-pink-600">Pills Taken</div>
                  </div>
                </div>
                <Button capybara onClick={() => markPillTaken()}>
                  Mark Pill Taken 💊
                </Button>
              </div>
            </Card>

            <Card title="Form Validation Hook" capybara>
              <div className="space-y-4">
                <div className="text-sm text-pink-600">
                  Real-time validation with useFormValidation:
                </div>
                <div className="bg-pink-50 rounded-lg p-3 text-sm">
                  <div>Form Valid: {Object.keys(errors).length === 0 ? '✅' : '❌'}</div>
                  <div>Errors: {Object.keys(errors).length}</div>
                  <div>Is Submitting: {isSubmitting ? '⏳' : '✅'}</div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Theming Demo */}
        {showDemo === 'theming' && (
          <Card title="Milady Theme System" capybara>
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all
                      ${key === 'default' ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-pink-300'}
                    `}
                  >
                    <div className="text-2xl mb-2">{theme.capybara}</div>
                    <div className="font-semibold capitalize">{key}</div>
                    <div className="text-sm text-gray-600">{theme.primary}</div>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Badge capybara>
                  Current: {Object.keys(themes).find(key => themes[key] === currentTheme)}
                </Badge>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-pink-600"
        >
          <p>✨ Enhanced with React Bits + Milady Magic 🦫💕</p>
        </motion.div>
      </div>
    </div>
  );
};

export default ReactBitsDemo;
