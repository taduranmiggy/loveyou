import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Volume2, 
  Type, 
  Contrast, 
  Settings, 
  X,
  Palette
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';

const AccessibilityToolbar = () => {
  const { settings, updateSettings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  // Voice announcement function
  const announceText = (text: string) => {
    if (settings.voiceAnnouncements && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  // Toggle functions with voice announcements
  const toggleHighContrast = () => {
    const newSettings = { ...settings, highContrast: !settings.highContrast };
    updateSettings(newSettings);
    announceText(`High contrast mode ${newSettings.highContrast ? 'enabled' : 'disabled'}`);
  };

  const changeFontSize = (size: typeof settings.fontSize) => {
    const newSettings = { ...settings, fontSize: size };
    updateSettings(newSettings);
    announceText(`Font size changed to ${size}`);
  };

  const toggleVoiceAnnouncements = () => {
    const newSettings = { ...settings, voiceAnnouncements: !settings.voiceAnnouncements };
    updateSettings(newSettings);
    
    if (newSettings.voiceAnnouncements) {
      announceText('Voice announcements enabled');
    }
  };

  const toggleReducedMotion = () => {
    const newSettings = { ...settings, reducedMotion: !settings.reducedMotion };
    updateSettings(newSettings);
    announceText(`Reduced motion ${newSettings.reducedMotion ? 'enabled' : 'disabled'}`);
  };

  const changeColorBlindMode = (mode: typeof settings.colorBlindMode) => {
    const newSettings = { ...settings, colorBlindMode: mode };
    updateSettings(newSettings);
    announceText(`Color blind support ${mode === 'none' ? 'disabled' : `enabled for ${mode}`}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key === 'a') {
        e.preventDefault();
        setIsOpen(!isOpen);
        announceText(isOpen ? 'Accessibility panel closed' : 'Accessibility panel opened');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <>
      {/* Floating accessibility button */}
      <motion.button
        className={`fixed top-20 right-4 z-50 shadow-lg rounded-full p-3 border-2 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
          settings.highContrast 
            ? 'bg-black text-white border-white hover:bg-gray-800' 
            : 'bg-white text-pink-600 border-pink-200 hover:border-pink-400'
        }`}
        onClick={() => {
          setIsOpen(!isOpen);
          announceText(isOpen ? 'Accessibility panel closed' : 'Accessibility panel opened');
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open accessibility options (Alt + A)"
        aria-expanded={isOpen}
        title="Accessibility Options (Alt + A)"
      >
        <Settings className="w-5 h-5" />
      </motion.button>

      {/* Accessibility panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-20 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: 100, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 100, scale: 0.9 }}
              className={`fixed top-20 right-4 z-50 rounded-xl shadow-2xl border p-6 w-96 max-h-[80vh] overflow-y-auto ${
                settings.highContrast
                  ? 'bg-black text-white border-white'
                  : 'bg-white text-gray-800 border-pink-200'
              }`}
              role="dialog"
              aria-labelledby="accessibility-title"
              aria-describedby="accessibility-description"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 id="accessibility-title" className="text-lg font-semibold mb-1">
                    Accessibility Options
                  </h3>
                  <p id="accessibility-description" className="text-sm opacity-70">
                    Customize your experience
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-full hover:bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                    settings.highContrast ? 'hover:bg-white' : 'hover:bg-gray-200'
                  }`}
                  aria-label="Close accessibility panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Visual Options */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Visual Settings
                  </h4>

                  {/* High Contrast Toggle */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <Contrast className="w-4 h-4" />
                      High Contrast
                    </label>
                    <button
                      className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        settings.highContrast 
                          ? 'bg-pink-500' 
                          : settings.highContrast ? 'bg-gray-600' : 'bg-gray-300'
                      }`}
                      onClick={toggleHighContrast}
                      aria-pressed={settings.highContrast}
                      aria-label={`High contrast mode ${settings.highContrast ? 'enabled' : 'disabled'}`}
                    >
                      <span 
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          settings.highContrast ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                      <span className="sr-only">{settings.highContrast ? 'On' : 'Off'}</span>
                    </button>
                  </div>

                  {/* Font Size Selector */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Type className="w-4 h-4" />
                      Font Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['small', 'normal', 'large', 'extra-large'] as const).map(size => (
                        <button
                          key={size}
                          className={`px-3 py-2 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                            settings.fontSize === size 
                              ? settings.highContrast
                                ? 'bg-white text-black'
                                : 'bg-pink-500 text-white'
                              : settings.highContrast
                              ? 'bg-gray-800 text-white hover:bg-gray-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => changeFontSize(size)}
                          aria-pressed={settings.fontSize === size}
                        >
                          {size.charAt(0).toUpperCase() + size.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Blind Support */}
                  <div className="mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium mb-2">
                      <Palette className="w-4 h-4" />
                      Color Blind Support
                    </label>
                    <select
                      value={settings.colorBlindMode}
                      onChange={(e) => changeColorBlindMode(e.target.value as typeof settings.colorBlindMode)}
                      className={`w-full p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                        settings.highContrast
                          ? 'bg-black text-white border-white'
                          : 'bg-white text-gray-800 border-gray-300'
                      }`}
                    >
                      <option value="none">None</option>
                      <option value="protanopia">Protanopia (Red-blind)</option>
                      <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                      <option value="tritanopia">Tritanopia (Blue-blind)</option>
                    </select>
                  </div>
                </div>

                {/* Audio & Motion Options */}
                <div>
                  <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Audio & Motion
                  </h4>

                  {/* Voice Announcements */}
                  <div className="flex items-center justify-between mb-4">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <Volume2 className="w-4 h-4" />
                      Voice Announcements
                    </label>
                    <button
                      className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        settings.voiceAnnouncements ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                      onClick={toggleVoiceAnnouncements}
                      aria-pressed={settings.voiceAnnouncements}
                      aria-label={`Voice announcements ${settings.voiceAnnouncements ? 'enabled' : 'disabled'}`}
                    >
                      <span 
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          settings.voiceAnnouncements ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                      <span className="sr-only">{settings.voiceAnnouncements ? 'On' : 'Off'}</span>
                    </button>
                  </div>

                  {/* Reduced Motion */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                      <motion.div
                        animate={settings.reducedMotion ? {} : { rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Settings className="w-4 h-4" />
                      </motion.div>
                      Reduce Motion
                    </label>
                    <button
                      className={`relative w-14 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
                        settings.reducedMotion ? 'bg-pink-500' : 'bg-gray-300'
                      }`}
                      onClick={toggleReducedMotion}
                      aria-pressed={settings.reducedMotion}
                      aria-label={`Reduced motion ${settings.reducedMotion ? 'enabled' : 'disabled'}`}
                    >
                      <span 
                        className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                          settings.reducedMotion ? 'translate-x-7' : 'translate-x-0'
                        }`} 
                      />
                      <span className="sr-only">{settings.reducedMotion ? 'On' : 'Off'}</span>
                    </button>
                  </div>
                </div>

                {/* Reset Button */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      const defaultSettings = {
                        highContrast: false,
                        fontSize: 'normal' as const,
                        voiceAnnouncements: false,
                        reducedMotion: false,
                        colorBlindMode: 'none' as const
                      };
                      updateSettings(defaultSettings);
                      announceText('All settings reset to defaults');
                    }}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                      settings.highContrast
                        ? 'bg-gray-800 text-white hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    🔄 Reset to Defaults
                  </button>
                </div>

                {/* Help Text */}
                <div className={`text-xs p-3 rounded-md mt-4 ${
                  settings.highContrast ? 'bg-gray-800' : 'bg-pink-50'
                }`}>
                  <p className="mb-1">💡 <strong>Tip:</strong> Use Alt + A to quickly open this panel</p>
                  <p>All settings are automatically saved and will persist across sessions.</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AccessibilityToolbar;
