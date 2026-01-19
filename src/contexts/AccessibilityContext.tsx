import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'small' | 'normal' | 'large' | 'extra-large';
  voiceAnnouncements: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: AccessibilitySettings) => void;
  announceText: (text: string) => void;
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  voiceAnnouncements: false,
  reducedMotion: false,
  colorBlindMode: 'none'
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider = ({ children }: AccessibilityProviderProps) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('loveyou-accessibility-settings');
    if (savedSettings) {
      try {
        return { ...defaultSettings, ...JSON.parse(savedSettings) };
      } catch (error) {
        console.warn('Failed to parse accessibility settings from localStorage:', error);
      }
    }
    
    // Always default to light mode - no dark mode functionality
    return {
      ...defaultSettings,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('loveyou-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply CSS classes to document body and root
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Font size classes (on root)
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    switch (settings.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      case 'extra-large':
        root.classList.add('text-xl');
        break;
      default:
        root.classList.add('text-base');
    }

    // High contrast mode (on body to be more specific)
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Reduced motion (on root for global effect)
    if (settings.reducedMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Color blind mode (on body for filter effect)
    body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (settings.colorBlindMode !== 'none') {
      body.classList.add(settings.colorBlindMode);
    }
  }, [settings]);

  // Voice announcement function
  const announceText = (text: string) => {
    if (settings.voiceAnnouncements && 'speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.7;
      
      // Use a more natural voice if available
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && voice.name.includes('Google')
      ) || voices.find(voice => voice.lang.startsWith('en'));
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const updateSettings = (newSettings: AccessibilitySettings) => {
    setSettings(newSettings);
  };

  // Listen for system preference changes
  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
    };
  }, []);

  return (
    <AccessibilityContext.Provider value={{ settings, updateSettings, announceText }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export default AccessibilityProvider;
