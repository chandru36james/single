import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setIsDark(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative w-12 h-6 flex items-center bg-on-surface/10 rounded-full px-1 transition-colors hover:bg-on-surface/20 group"
      aria-label="Toggle Theme"
    >
      <motion.div
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-4 h-4 bg-primary rounded-full flex items-center justify-center shadow-sm"
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="sun"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Sun size={10} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="moon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Moon size={10} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Tooltip */}
      <span className="absolute top-full left-1/2 -translate-x-1/2 mt-4 px-2 py-1 bg-on-surface text-surface text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
        {isDark ? 'Light Room' : 'Dark Room'}
      </span>
    </button>
  );
};

export default ThemeToggle;
