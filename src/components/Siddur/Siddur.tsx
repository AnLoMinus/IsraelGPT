import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, ScrollText, ChevronDown, ChevronLeft } from 'lucide-react';
import { TfilatHaAchdut } from './prayers/TfilatHaAchdut';
import { ModehAni } from './prayers/ModehAni';
import { ShemaYisrael } from './prayers/ShemaYisrael';
import { TfilatHaDerech } from './prayers/TfilatHaDerech';
import { TfilaLeChochma } from './prayers/TfilaLeChochma';
import { TfilaLeShmira } from './prayers/TfilaLeShmira';
import { TfilaLeTikunMidot } from './prayers/TfilaLeTikunMidot';
import { TfilaLeShalomOlam } from './prayers/TfilaLeShalomOlam';
import { TfilatSlicha } from './prayers/TfilatSlicha';
import { TfilatSiyum } from './prayers/TfilatSiyum';

interface SiddurProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const SIDDUR_VERSION = "0.8.8";

const SIDDUR_TOC = [
  {
    id: 'waking',
    title: '🌅 שער א: השכמת הבוקר',
    prayers: [
      { id: 'modehAni', title: 'תפילת התעוררות' },
      { id: 'derech', title: 'ברכת פתיחת היום' },
      { id: 'netilatYadayim', title: 'נטילת ידיים' },
      { id: 'asherYatzar', title: 'אשר יצר' },
      { id: 'birkotHaTorah', title: 'ברכות התורה' },
    ]
  },
  {
    id: 'zemer',
    title: '🎶 שער ב: פסוקי דזמרה',
    prayers: [
      { id: 'baruchSheamar', title: 'ברוך שאמר' },
      { id: 'ashrei', title: 'אשרי יושבי ביתך' },
      { id: 'yishtabach', title: 'ישתבח' },
    ]
  },
  {
    id: 'shema',
    title: '🔯 שער ג: קריאת שמע',
    prayers: [
      { id: 'shema', title: 'קריאת שמע' },
    ]
  },
  {
    id: 'amidah',
    title: '🕯 שער ד: תפילת העמידה',
    prayers: [
      { id: 'amidah', title: 'תפילת העמידה' },
    ]
  },
  {
    id: 'mincha',
    title: '🌇 שער ה: תפילת מנחה',
    prayers: [
      { id: 'vidui', title: 'וידוי ותחנון' },
    ]
  },
  {
    id: 'arvit',
    title: '🌙 שער ו: תפילת ערבית',
    prayers: [
      { id: 'hashkivenu', title: 'השכיבנו' },
    ]
  },
  {
    id: 'special',
    title: '🕊 שער ז: תפילות מיוחדות',
    prayers: [
      { id: 'chochma', title: 'תפילה לחכמה ולבינה' },
      { id: 'shmira', title: 'תפילה לשמירה והגנה' },
      { id: 'tikunMidot', title: 'תפילה לתיקון המידות' },
      { id: 'shalomOlam', title: 'תפילה לשלום העולם' },
      { id: 'slicha', title: 'תפילת סליחה ותשובה' },
      { id: 'achdut', title: 'תפילת האחדות' },
      { id: 'siyum', title: 'תפילת סיום' },
    ]
  }
];

export const Siddur: React.FC<SiddurProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activePrayer, setActivePrayer] = useState('modehAni');
  const [expandedSection, setExpandedSection] = useState<string | null>('waking');

  if (!isOpen) return null;

  const renderPrayer = () => {
    switch(activePrayer) {
      case 'achdut': return <TfilatHaAchdut isDarkMode={isDarkMode} />;
      case 'modehAni': return <ModehAni isDarkMode={isDarkMode} />;
      case 'shema': return <ShemaYisrael isDarkMode={isDarkMode} />;
      case 'derech': return <TfilatHaDerech isDarkMode={isDarkMode} />;
      case 'chochma': return <TfilaLeChochma isDarkMode={isDarkMode} />;
      case 'shmira': return <TfilaLeShmira isDarkMode={isDarkMode} />;
      case 'tikunMidot': return <TfilaLeTikunMidot isDarkMode={isDarkMode} />;
      case 'shalomOlam': return <TfilaLeShalomOlam isDarkMode={isDarkMode} />;
      case 'slicha': return <TfilatSlicha isDarkMode={isDarkMode} />;
      case 'siyum': return <TfilatSiyum isDarkMode={isDarkMode} />;
      default: return (
        <div className={`text-center space-y-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          <Book className="w-16 h-16 mx-auto opacity-50" />
          <h3 className="text-2xl font-bold">תפילה זו תתווסף בקרוב</h3>
          <p>אנו עובדים על הוספת התפילה המלאה למערכת.</p>
        </div>
      );
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`relative w-full h-full backdrop-blur-2xl overflow-hidden flex flex-col z-10 ${isDarkMode ? 'bg-slate-900/95' : 'bg-white/95'}`}
          >
            <div className={`p-6 border-b flex items-center justify-between shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  <Book className="w-6 h-6" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>סידור "קול ישראל"</h2>
                  <p className={`text-sm font-medium mt-1 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>נוסח בלשון רבים - מתפללים יחד כקבוצה אחת</p>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-blue-400'}`}>גרסה {SIDDUR_VERSION}</p>
                </div>
              </div>
              <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar for prayers */}
              <div className={`w-64 border-l overflow-y-auto p-4 shrink-0 ${isDarkMode ? 'border-slate-800 bg-slate-900/30' : 'border-blue-100/50 bg-blue-50/30'}`}>
                <div className="space-y-2">
                  {SIDDUR_TOC.map((section) => (
                    <div key={section.id} className="mb-2">
                      <button
                        onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                        className={`w-full text-right px-3 py-2 rounded-xl transition-colors flex items-center justify-between font-bold ${isDarkMode ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-800 hover:bg-blue-100'}`}
                      >
                        <span>{section.title}</span>
                        {expandedSection === section.id ? <ChevronDown className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedSection === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden flex flex-col gap-1 mt-1 pr-2"
                          >
                            {section.prayers.map((prayer) => (
                              <button
                                key={prayer.id}
                                onClick={() => setActivePrayer(prayer.id)}
                                className={`w-full text-right px-4 py-2 rounded-xl transition-colors flex items-center gap-2 text-sm ${activePrayer === prayer.id ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-800')}`}
                              >
                                <ScrollText className="w-3 h-3" />
                                {prayer.title}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prayer Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-10 flex items-center justify-center">
                {renderPrayer()}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
