import React from 'react';
import { X, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TermsOfUse: React.FC<Props> = ({ isOpen, onClose, isDarkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className={`relative w-full max-w-2xl backdrop-blur-2xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[85vh] z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-blue-200/80'}`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>תנאי שימוש</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <h3 className="font-bold text-lg">1. כללי</h3>
          <p>ברוכים הבאים ל-IsraelGPT. השימוש באפליקציה זו מעיד על הסכמתך לתנאים אלו. אם אינך מסכים לתנאים, אנא הימנע משימוש באפליקציה.</p>
          
          <h3 className="font-bold text-lg">2. מהות השירות</h3>
          <p>IsraelGPT הוא ממשק צ'אט מבוסס בינה מלאכותית (AI) המשתמש בטכנולוגיית Gemini של גוגל. המערכת מספקת תשובות, מייצרת טקסטים ותמונות על בסיס הקלט שלך.</p>
          
          <h3 className="font-bold text-lg">3. דיוק המידע (Disclaimer)</h3>
          <p>מודלים של בינה מלאכותית עלולים לעשות טעויות ("הזיות"). המידע המסופק על ידי IsraelGPT אינו מהווה ייעוץ מקצועי, משפטי, רפואי או הלכתי מוסמך. באחריות המשתמש לאמת כל מידע קריטי לפני הסתמכות עליו.</p>
          
          <h3 className="font-bold text-lg">4. אחריות המשתמש</h3>
          <p>הנך מתחייב לא להשתמש בשירות למטרות לא חוקיות, פוגעניות, גזעניות או מזיקות. האחריות על התוכן הנוצר והשימוש בו חלה על המשתמש בלבד.</p>
          
          <h3 className="font-bold text-lg">5. קניין רוחני</h3>
          <p>הקוד, העיצוב והממשק של IsraelGPT הם קניינו הבלעדי של המפתח (לאון יעקובוב / AnLoMinus). התוכן הנוצר על ידי ה-AI כפוף למדיניות השימוש של Google Gemini.</p>
          
          <h3 className="font-bold text-lg">6. שינויים</h3>
          <p>אנו שומרים לעצמנו את הזכות לשנות את תנאי השימוש בכל עת. המשך השימוש באפליקציה מהווה הסכמה לשינויים אלו.</p>
        </div>
        <div className={`p-4 border-t text-center text-xs ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-blue-100/50 text-slate-400'}`}>
          עודכן לאחרונה: פברואר 2026
        </div>
      </motion.div>
    </div>
  );
};
