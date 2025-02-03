import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import {
  IoAccessibility,
  IoTextOutline,
  IoContrastOutline,
  IoSpeedometerOutline,
  IoColorPaletteOutline,
  IoCloseOutline,
} from 'react-icons/io5';

interface AccessibilityState {
  fontSize: number;
  contrast: 'normal' | 'high' | 'maximum';
  reducedMotion: boolean;
  simplifiedUI: boolean;
  lineSpacing: number;
  letterSpacing: number;
  dyslexicFont: boolean;
  wordSpacing: number;
  paragraphSpacing: number;
}

const contrastRatios = {
  normal: 4.5, // AA
  high: 7, // AAA
  maximum: 21, // Ultra AAA
};

export const AccessibilityFab: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilityState>(() => {
    // Charger les paramètres depuis localStorage au montage
    const savedSettings = localStorage.getItem('accessibilitySettings');
    return savedSettings
      ? JSON.parse(savedSettings)
      : {
          fontSize: 100,
          contrast: 'normal',
          reducedMotion: false,
          simplifiedUI: false,
          lineSpacing: 1.5,
          dyslexicFont: false,
          letterSpacing: 0, // Default letterSpacing
        };
  });

  // Sauvegarder les paramètres quand ils changent
  useEffect(() => {
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
  }, [settings]);

  const updateFontSize = (value: number) => {
    setSettings((prev) => ({ ...prev, fontSize: value }));
    document.documentElement.style.fontSize = `${value}%`;
  };

  const updateLineSpacing = (value: number) => {
    setSettings((prev) => ({ ...prev, lineSpacing: value }));
    document.documentElement.style.lineHeight = value.toString();
  };

  const updateLetterSpacing = (value: number) => {
    setSettings((prev) => ({ ...prev, letterSpacing: value }));
    document.documentElement.style.letterSpacing = `${value}em`;
  };

  // Contraste
  const toggleContrast = useCallback(() => {
    const contrasts: ('normal' | 'high' | 'maximum')[] = [
      'normal',
      'high',
      'maximum',
    ];
    const currentIndex = contrasts.indexOf(settings.contrast);
    const nextContrast = contrasts[(currentIndex + 1) % contrasts.length];
    setSettings((prev) => ({ ...prev, contrast: nextContrast }));

    // Apply contrast ratio based on the selected level
    const ratio = contrastRatios[nextContrast];
    document.documentElement.style.setProperty(
      '--contrast-ratio',
      ratio.toString()
    );

    // Remove existing contrast classes
    document.documentElement.classList.remove(
      'contrast-normal',
      'contrast-high',
      'contrast-maximum'
    );

    // Add new contrast class if not normal
    if (nextContrast !== 'normal') {
      document.documentElement.classList.add(`contrast-${nextContrast}`);
    }
  }, [settings.contrast]);

  // Motion réduite
  const toggleReducedMotion = useCallback(() => {
    const newReducedMotion = !settings.reducedMotion;
    setSettings((prev) => ({ ...prev, reducedMotion: newReducedMotion }));

    if (newReducedMotion) {
      document.documentElement.classList.add('motion-reduce');
    } else {
      document.documentElement.classList.remove('motion-reduce');
    }
  }, [settings.reducedMotion]);

  // Interface simplifiée
  const toggleSimplifiedUI = () => {
    const newSimplifiedUI = !settings.simplifiedUI;
    setSettings((prev) => ({ ...prev, simplifiedUI: newSimplifiedUI }));

    if (newSimplifiedUI) {
      document.documentElement.classList.add('simplified');
    } else {
      document.documentElement.classList.remove('simplified');
    }
  };

  // Police dyslexique
  const toggleDyslexicFont = () => {
    const newDyslexicFont = !settings.dyslexicFont;
    setSettings((prev) => ({ ...prev, dyslexicFont: newDyslexicFont }));

    if (newDyslexicFont) {
      document.documentElement.classList.add('dyslexic-font');
      document.documentElement.style.fontFamily = "'OpenDyslexic', sans-serif";
      document.documentElement.style.letterSpacing = '0.35em';
      document.documentElement.style.wordSpacing = '1em';
      document.documentElement.style.lineHeight = '1.8';
    } else {
      document.documentElement.classList.remove('dyslexic-font');
      document.documentElement.style.fontFamily = '';
      document.documentElement.style.letterSpacing = `${settings.letterSpacing}em`;
      document.documentElement.style.wordSpacing = '';
      document.documentElement.style.lineHeight =
        settings.lineSpacing.toString();
    }
  };

  // Effet pour initialiser les paramètres au chargement
  useEffect(() => {
    // Appliquer les paramètres initiaux
    document.documentElement.style.fontSize = `${settings.fontSize}%`;
    document.documentElement.style.lineHeight = settings.lineSpacing.toString();
    document.documentElement.style.letterSpacing = `${settings.letterSpacing}em`;

    if (settings.reducedMotion)
      document.documentElement.classList.add('reduced-motion');
    if (settings.simplifiedUI)
      document.documentElement.classList.add('simplified-ui');
    if (settings.dyslexicFont)
      document.documentElement.classList.add('dyslexic-font');
    if (settings.contrast !== 'normal') {
      document.documentElement.classList.add(`${settings.contrast}-contrast`);
    }

    return () => {
      document.documentElement.classList.remove(
        'reduced-motion',
        'simplified-ui',
        'dyslexic-font',
        'high-contrast',
        'maximum-contrast'
      );
      document.documentElement.style.fontSize = '';
      document.documentElement.style.lineHeight = '';
      document.documentElement.style.letterSpacing = '';
    };
  }, [
    settings.fontSize,
    settings.lineSpacing,
    settings.letterSpacing,
    settings.reducedMotion,
    settings.simplifiedUI,
    settings.dyslexicFont,
    settings.contrast,
  ]); // Add all settings dependencies

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.altKey) {
        switch (e.key) {
          case 'c':
            toggleContrast();
            break;
          case 'f':
            setIsOpen((prev) => !prev);
            break;
          case 'm':
            toggleReducedMotion();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleContrast, toggleReducedMotion]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={`absolute bottom-16 right-0 p-4 rounded-lg shadow-lg 
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
            w-72`}
        >
          <div className="space-y-4">
            {/* Controls reste le même */}
            <div>
              <label
                className={`block text-sm font-medium mb-1 
                ${
                  isDarkMode
                    ? 'text-gray-100' // Plus clair pour un meilleur contraste
                    : 'text-gray-900' // Plus foncé pour un meilleur contraste
                }`}
              >
                Font Size ({settings.fontSize}%)
              </label>
              <input
                type="range"
                min="120" // Augmenter la taille minimale à 120%
                max="200"
                step="10"
                value={settings.fontSize}
                onChange={(e) => updateFontSize(Number(e.target.value))}
                className={`w-full ${
                  isDarkMode ? 'accent-blue-400' : 'accent-blue-600'
                }`}
                aria-label="Adjust font size"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Line Spacing ({settings.lineSpacing})
              </label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={settings.lineSpacing}
                onChange={(e) => updateLineSpacing(Number(e.target.value))}
                className="w-full"
                aria-label="Adjust line spacing"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Letter Spacing
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.letterSpacing}
                onChange={(e) => updateLetterSpacing(Number(e.target.value))}
                className={`w-full ${isDarkMode ? 'accent-blue-400' : 'accent-blue-600'}`}
                aria-label="Adjust letter spacing"
              />
            </div>

            <div role="tooltip" id="contrastHelp" className="sr-only">
              Normal contrast is 4.5:1, High contrast is 7:1, and Maximum
              contrast is 21:1
            </div>

            <button
              onClick={toggleContrast}
              aria-describedby="contrastHelp"
              className={`flex items-center space-x-2 w-full p-2 rounded 
                ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-200'
                    : 'hover:bg-gray-100 text-gray-700'
                }
                transition-colors`}
              aria-label="Toggle contrast mode"
            >
              <IoContrastOutline className="w-5 h-5" />
              <span>Contrast Mode: {settings.contrast}</span>
            </button>

            <button
              onClick={toggleReducedMotion}
              className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle reduced motion"
            >
              <IoSpeedometerOutline className="w-5 h-5" />
              <span>
                Reduced Motion: {settings.reducedMotion ? 'On' : 'Off'}
              </span>
            </button>

            <button
              onClick={toggleDyslexicFont}
              className="flex items-center space-x-2 w-full p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dyslexic friendly font"
            >
              <IoTextOutline className="w-5 h-5" />
              <span>Dyslexic Font: {settings.dyslexicFont ? 'On' : 'Off'}</span>
            </button>
          </div>
        </motion.div>
      )}

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-lg 
          ${
            isDarkMode
              ? 'bg-gray-800 text-gray-200 hover:bg-gray-700'
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 
          ${isDarkMode ? 'focus:ring-blue-400' : 'focus:ring-blue-600'} 
          transition-colors duration-200 ease-in-out`}
        aria-label="Accessibility options"
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <IoCloseOutline className="w-6 h-6" />
        ) : (
          <IoAccessibility className="w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
};
