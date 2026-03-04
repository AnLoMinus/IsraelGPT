import React from 'react';
import { X, Scale } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const PrivacyPolicy: React.FC<Props> = ({ isOpen, onClose, isDarkMode }) => {
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
              <Scale className="w-5 h-5" />
            </div>
            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>מדיניות פרטיות</h2>
          </div>
          <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className={`p-6 overflow-y-auto flex-1 space-y-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
          <h3 className="font-bold text-lg">1. איסוף מידע</h3>
          <p>IsraelGPT לא אוספת מידע אישי מזהה (PII) מהמשתמשים שלה באופן ישיר. כל המידע שאתה מזין בצ'אט (היסטוריית שיחות, הגדרות, דמויות מותאמות אישית) נשמר באופן מקומי על המכשיר שלך (LocalStorage) ולא נשלח לשרתים שלנו.</p>
          
          <h3 className="font-bold text-lg">2. שימוש ב-Google Gemini API</h3>
          <p>כדי לספק את שירותי הצ'אט והבינה המלאכותית, הטקסט והתמונות שאתה שולח מועברים ל-Google באמצעות ה-API של Gemini. השימוש במידע זה כפוף למדיניות הפרטיות של Google.</p>
          
          <h3 className="font-bold text-lg">3. אבטחת מידע</h3>
          <p>אנו משתמשים בפרוטוקולי אבטחה סטנדרטיים (HTTPS) כדי להגן על המידע המועבר בין הדפדפן שלך לבין שרתי ה-API. עם זאת, אין מערכת חסינה לחלוטין, ואיננו יכולים להבטיח אבטחה מוחלטת.</p>
          
          <h3 className="font-bold text-lg">4. Cookies ואחסון מקומי</h3>
          <p>האפליקציה משתמשת ב-LocalStorage של הדפדפן כדי לשמור את היסטוריית השיחות שלך ואת ההעדפות האישיות (כמו מצב כהה/בהיר). מידע זה נשאר אצלך ואינו משותף איתנו.</p>
          
          <h3 className="font-bold text-lg">5. יצירת קשר</h3>
          <p>אם יש לך שאלות בנוגע למדיניות הפרטיות, ניתן ליצור קשר עם המפתח (AnLoMinus) דרך ערוצי התקשורת המפורטים באפליקציה.</p>
        </div>
        <div className={`p-4 border-t text-center text-xs ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-blue-100/50 text-slate-400'}`}>
          עודכן לאחרונה: פברואר 2026
        </div>
      </motion.div>
    </div>
  );
};
