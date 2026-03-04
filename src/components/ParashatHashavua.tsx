import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { HDate, Sedra, Locale } from '@hebcal/core';

interface ParashatHashavuaProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onStartStudy: (topic: string) => void;
}

export function ParashatHashavua({ isOpen, onClose, isDarkMode, onStartStudy }: ParashatHashavuaProps) {
  const [parashaName, setParashaName] = useState('');

  useEffect(() => {
    if (isOpen) {
      const today = new HDate();
      const sedra = new Sedra(today.getFullYear(), true);
      const result = sedra.lookup(today);
      if (!result.chag) {
        const parasha = result.parsha.join('-');
        const hebrewParasha = Locale.gettext(parasha, 'he');
        setParashaName(hebrewParasha);
      } else {
        setParashaName('קריאת חג');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
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
        className={`relative w-full max-w-lg backdrop-blur-2xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-blue-200/80'}`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>לימוד פרשת השבוע</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center text-center gap-6">
          <div className="space-y-2">
            <h3 className={`text-lg font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>הפרשה של השבוע היא:</h3>
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>פרשת {parashaName}</p>
          </div>
          
          <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
            הצטרפו ללימוד מעמיק של פרשת השבוע עם חכמי ישראל. תוכלו לשאול שאלות, לבקש פירושים, ולהעמיק במסרים של הפרשה.
          </p>

          <button 
            onClick={() => {
              onStartStudy(`אני רוצה ללמוד את פרשת השבוע, פרשת ${parashaName}. תוכל לשתף אותי ברעיון מרכזי מהפרשה?`);
              onClose();
            }}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${isDarkMode ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'}`}
          >
            <Sparkles className="w-6 h-6" />
            <span>התחל לימוד עכשיו</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
