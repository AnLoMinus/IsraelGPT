import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Shield, Database, Trash2, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  user: any;
}

export const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, isDarkMode, user }) => {
  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onClose();
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full max-w-2xl backdrop-blur-2xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-blue-200/80'}`}
          >
            <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <SettingsIcon className="w-5 h-5" />
                </div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>הגדרות משתמש</h2>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-8">
              {/* User Profile Section */}
              <section>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-blue-900'}`}>
                  <User className="w-5 h-5" /> פרופיל משתמש
                </h3>
                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-100'}`}>
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>שם משתמש: <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.displayName || 'לא הוגדר'}</span></p>
                  <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>אימייל: <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.email}</span></p>
                </div>
              </section>

              {/* Data Management Section */}
              <section>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-blue-900'}`}>
                  <Database className="w-5 h-5" /> ניהול נתונים וקבצים
                </h3>
                <div className="space-y-3">
                  <button className={`w-full text-right px-4 py-3 rounded-xl border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-blue-100 text-slate-700 hover:bg-blue-50'}`}>
                    ייצוא כל הנתונים שלי (JSON)
                  </button>
                  <button className={`w-full text-right px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 text-red-500 ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-red-900/20' : 'bg-white border-red-100 hover:bg-red-50'}`}>
                    <Trash2 className="w-4 h-4" /> מחיקת כל הנתונים והיסטוריית השיחות
                  </button>
                </div>
              </section>

              {/* Security Section */}
              <section>
                <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-blue-900'}`}>
                  <Shield className="w-5 h-5" /> אבטחה
                </h3>
                <button onClick={handleLogout} className={`w-full text-right px-4 py-3 rounded-xl border transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-red-400 hover:bg-slate-700' : 'bg-white border-blue-100 text-red-600 hover:bg-red-50'}`}>
                  <LogOut className="w-4 h-4" /> התנתק מהמערכת
                </button>
              </section>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
