import { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsContextType {
  fontSize: number;
  letterSpacing: number;
  updateSettings: (fontSize: number, letterSpacing: number) => void;
};

export const SettingsContext = createContext({
  fontSize: 16,
  letterSpacing: 0,
  updateSettings: (fontSize: number, letterSpacing: number) => Promise.resolve(),
});

export function SettingsProvider({ children }: { children: React.ReactNode})
{
  const [fontSize, setFontSize] = useState(18);
  const [letterSpacing, setLetterSpacing] = useState(0.16);

  const updateSettings = async (newFontSize: number, newLetterSpacing: number) => {
    setFontSize(newFontSize);
    setLetterSpacing(newLetterSpacing);
    await AsyncStorage.setItem('fontSize', newFontSize.toString());
    await AsyncStorage.setItem('letterSpacing', newLetterSpacing.toString());
  }

  return (
    <SettingsContext.Provider value={{ fontSize, letterSpacing, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => useContext(SettingsContext);