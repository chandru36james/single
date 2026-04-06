import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Clock, LogOut } from 'lucide-react';

interface LogoutReminderProps {
  isOpen: boolean;
  timeLeft: number;
  onStay: () => void;
  onLogout: () => void;
}

export const LogoutReminder: React.FC<LogoutReminderProps> = ({ isOpen, timeLeft, onStay, onLogout }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onStay}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-neutral-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-6">
                <Clock className="text-amber-600 animate-pulse" size={32} />
              </div>
              
              <h2 className="text-2xl font-bold italic serif text-neutral-900 mb-2">
                Inactivity Warning
              </h2>
              <p className="text-neutral-500 mb-8">
                You've been inactive for a while. For your security, you will be logged out in <span className="font-bold text-neutral-900">{timeLeft} seconds</span>.
              </p>

              <div className="flex flex-col w-full gap-3">
                <button
                  onClick={onStay}
                  className="w-full bg-neutral-900 text-white py-4 rounded-2xl font-bold hover:bg-neutral-800 transition-all shadow-lg shadow-neutral-900/10"
                >
                  Stay Logged In
                </button>
                <button
                  onClick={onLogout}
                  className="w-full bg-white text-red-600 py-4 rounded-2xl font-bold hover:bg-red-50 transition-all border border-red-100 flex items-center justify-center gap-2"
                >
                  <LogOut size={18} />
                  Logout Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
