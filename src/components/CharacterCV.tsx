import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { Character } from '../characters/types';
import { Biography } from '../biographies/types';
import { BookOpen, Calendar, Quote, X } from 'lucide-react';

interface CharacterCVProps {
  character: Character;
  biography?: Biography;
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const CharacterCV: React.FC<CharacterCVProps> = ({ character, biography, isOpen, onClose, isDarkMode, onMouseEnter, onMouseLeave }) => {
  if (!isOpen) return null;

  // צבע רקע דינמי לפי הדמות (אם יש לה צבע מוגדר, אחרת כחול ברירת מחדל)
  const themeColor = character.color || 'bg-gradient-to-br from-blue-600 to-blue-800';
  const headerBgClass = themeColor.includes('bg-') ? themeColor : 'bg-gradient-to-br from-blue-600 to-blue-800';

  // תוכן הביוגרפיה - אם אין קובץ ביוגרפיה מלא, נשתמש בתיאור ובהנחיות האופי כברירת מחדל
  const bioContent = biography?.fullBiography || `
# ${character.name}

${character.description}

## על הדמות
${character.systemInstruction}
  `;

  return (
    <AnimatePresence>
      <div 
        className="absolute inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pointer-events-none"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* רקע מטשטש */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
          onClick={onClose}
        />

        {/* חלון המודל */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-[95%] sm:w-full max-w-2xl max-h-[95%] flex flex-col rounded-2xl shadow-2xl overflow-hidden pointer-events-auto ${
            isDarkMode ? 'bg-slate-900 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
          dir="rtl"
        >
          {/* כפתור סגירה */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* כותרת (Header) */}
          <div className={`relative px-8 py-10 text-white ${headerBgClass} overflow-hidden shrink-0`}>
            {/* אפקט רקע */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-5xl shadow-lg shrink-0">
                {character.icon}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2 drop-shadow-md">{character.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-white/90 font-medium text-sm">
                  {character.era && (
                    <span className="px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                      {character.era}
                    </span>
                  )}
                  {biography?.born && biography?.died && (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/10">
                      <Calendar className="w-3.5 h-3.5" />
                      {biography.born} - {biography.died}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* תוכן נגלל (Body) */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            
            {/* ציטוט מפורסם */}
            {biography?.famousQuote && (
              <div className={`mb-8 p-5 rounded-xl border-r-4 italic text-lg font-medium relative ${
                isDarkMode ? 'bg-slate-800/50 border-blue-500 text-slate-300' : 'bg-blue-50 border-blue-500 text-blue-900'
              }`}>
                <Quote className={`absolute top-3 left-3 w-8 h-8 opacity-10 ${isDarkMode ? 'text-white' : 'text-blue-900'}`} />
                {biography.famousQuote}
              </div>
            )}

            {/* חיבורים מרכזיים */}
            {biography?.mainWorks && biography.mainWorks.length > 0 && (
              <div className="mb-8">
                <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <BookOpen className="w-4 h-4" />
                  חיבורים מרכזיים
                </h3>
                <div className="flex flex-wrap gap-2">
                  {biography.mainWorks.map((work, idx) => (
                    <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                    }`}>
                      {work}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* טקסט ביוגרפיה (Markdown) */}
            <div className={`prose prose-p:leading-relaxed max-w-none markdown-body ${
              isDarkMode ? 'prose-invert prose-headings:text-blue-400 text-slate-300' : 'prose-slate prose-headings:text-blue-700 text-slate-800'
            }`}>
              <Markdown>{bioContent}</Markdown>
            </div>
            
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
