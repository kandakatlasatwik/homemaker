import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('homemakers-theme');
    return saved ? saved === 'dark' : true; // default dark
  });

  useEffect(() => {
    localStorage.setItem('homemakers-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  const theme = {
    isDark,
    toggleTheme,
    // Backgrounds
    bg: isDark ? 'bg-black' : 'bg-white',
    bgSecondary: isDark ? 'bg-gray-900' : 'bg-gray-50',
    bgCard: isDark ? 'bg-gray-900' : 'bg-white',
    bgInput: isDark ? 'bg-gray-800' : 'bg-white',
    bgHover: isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    // Text
    text: isDark ? 'text-white' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDark ? 'text-gray-400' : 'text-gray-500',
    textHeading: isDark ? 'text-white' : 'text-gray-900',
    // Borders
    border: isDark ? 'border-amber-500/50' : 'border-gray-300',
    borderAccent: isDark ? 'border-amber-400' : 'border-gray-400',
    borderHover: isDark ? 'hover:border-amber-400' : 'hover:border-gray-500',
    // Shadows
    shadow: isDark ? 'shadow-lg shadow-amber-500/10' : 'shadow-lg shadow-black/10',
    shadowCard: isDark ? 'shadow-xl shadow-amber-500/5' : 'shadow-xl shadow-black/8',
    // Specific
    navBg: isDark ? 'bg-black' : 'bg-white',
    navBorder: isDark ? 'border-gray-500' : 'border-gray-200',
    navText: isDark ? 'text-white' : 'text-gray-900',
    navHover: isDark ? 'hover:text-amber-300' : 'hover:text-[#2302ca]',
    footerBg: isDark ? 'bg-black' : 'bg-white',
    footerText: isDark ? 'text-white' : 'text-gray-900',
    footerHover: isDark ? 'hover:text-amber-300' : 'hover:text-[#2302ca]',
    // Buttons
    btnPrimary: isDark
      ? 'bg-amber-500 text-black hover:bg-amber-400'
      : 'bg-gray-900 text-white hover:bg-gray-800',
    btnBack: isDark
      ? 'bg-gray-800 text-white hover:bg-gray-700 border border-[#ca7a02]'
      : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-[#2302ca] shadow-sm shadow-black/5',
    // Glow / accent
    glow: isDark ? 'blur-md bg-amber-500 opacity-40' : 'blur-md bg-gray-300 opacity-60',
    ring: isDark ? 'ring-amber-400' : 'ring-gray-400',
    accent: isDark ? 'text-amber-400' : 'text-[#2302ca]',
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};
