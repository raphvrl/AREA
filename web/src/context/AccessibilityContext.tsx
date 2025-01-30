import React, { createContext, useContext, useState, useEffect } from 'react';

interface AccessibilityState {
  fontSize: number;
  contrast: 'normal' | 'high' | 'maximum';
  reducedMotion: boolean;
  simplifiedUI: boolean;
  lineSpacing: number;
  dyslexicFont: boolean;
}

const AccessibilityContext = createContext<{
  settings: AccessibilityState;
  setSettings: (settings: AccessibilityState) => void;
}>(null!);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilityState>(() => {
    const saved = localStorage.getItem('accessibilitySettings');
    return saved
      ? JSON.parse(saved)
      : {
          fontSize: 100,
          contrast: 'normal',
          reducedMotion: false,
          simplifiedUI: false,
          lineSpacing: 1.5,
          dyslexicFont: false,
        };
  });

  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <AccessibilityContext.Provider value={{ settings, setSettings }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => useContext(AccessibilityContext);
