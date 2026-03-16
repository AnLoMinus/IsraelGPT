import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, Plus, MessageSquare, Settings as SettingsIcon, User, 
  Send, Paperclip, Mic, Sparkles, ChevronDown,
  Globe, Shield, Zap, Copy, ThumbsUp, ThumbsDown, RefreshCw,
  History, X, BookOpen, Loader2, Moon, Sun, Trash2,
  Volume2, Download, Share2, FileText, Info, FileCheck, ShieldCheck, Scale,
  Heart, Scroll, Users, LogIn, LogOut
} from 'lucide-react';
import Markdown from 'react-markdown';
import { GoogleGenAI, Type } from '@google/genai';
import { toPng } from 'html-to-image';
import { HDate, Sedra, Locale } from '@hebcal/core';
import { characters as defaultCharacters, Character } from './characters';
import { TermsOfUse } from './components/TermsOfUse';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { Settings } from './components/Settings';
import { ParashatHashavua } from './components/ParashatHashavua';
import { DafYomi } from './components/DafYomi';
import { Siddur } from './components/Siddur/Siddur';
import { auth, db } from './firebase';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, getDoc, setDoc, onSnapshot, query, orderBy } from 'firebase/firestore';

const StarOfDavid = ({ className = "w-6 h-6", style }: { className?: string, style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 20.66 17 3.34 17" />
    <polygon points="12 22 3.34 7 20.66 7" />
  </svg>
);

const DynamicBackground = ({ mousePos }: { mousePos: { x: number, y: number } }) => {
  const [windowSize, setWindowSize] = useState({ w: 1000, h: 1000 });

  useEffect(() => {
    setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const elements: any[] = useMemo(() => {
    const stars = Array.from({ length: 70 }).map(() => ({
      type: 'star',
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 25 + 8,
      opacity: Math.random() * 0.15 + 0.05, // Increased opacity
      parallaxX: (Math.random() - 0.5) * 120,
      parallaxY: (Math.random() - 0.5) * 120,
      rotation: Math.random() * 360,
    }));

    const particles = Array.from({ length: 50 }).map(() => ({
      type: 'particle',
      id: Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * -15,
    }));

    const lines = Array.from({ length: 10 }).map(() => ({
        type: 'line',
        id: Math.random(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        length: Math.random() * 300 + 200,
        rotation: Math.random() * 180,
        opacity: Math.random() * 0.05 + 0.02,
        duration: Math.random() * 30 + 20,
    }));

    return [...stars, ...particles, ...lines];
  }, []);

  const normX = mousePos.x / windowSize.w - 0.5;
  const normY = mousePos.y / windowSize.h - 0.5;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {elements.map((el) => {
        if (el.type === 'star') {
          return (
            <motion.div
              key={el.id}
              className="absolute text-blue-600 dark:text-blue-400"
              style={{ left: `${el.x}%`, top: `${el.y}%`, opacity: el.opacity }}
              animate={{ x: normX * el.parallaxX, y: normY * el.parallaxY, rotate: el.rotation + (normX * 30) }}
              transition={{ type: "spring", stiffness: 30, damping: 15, mass: 0.5 }}
            >
              <StarOfDavid style={{ width: el.size, height: el.size }} />
            </motion.div>
          );
        }
        if (el.type === 'particle') {
          return (
            <motion.div
              key={el.id}
              className="absolute bg-blue-400/50 dark:bg-cyan-300/50 rounded-full"
              style={{ left: `${el.x}%`, top: `${el.y}%`, width: el.size, height: el.size, opacity: 0 }}
              animate={{
                y: [0, -windowSize.h * 0.3, -windowSize.h * 0.7],
                x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                opacity: [el.opacity, el.opacity * 0.5, 0],
              }}
              transition={{ duration: el.duration, repeat: Infinity, repeatType: 'loop', ease: 'linear', delay: el.delay }}
            />
          );
        }
        if (el.type === 'line') {
            return (
                <motion.div
                    key={el.id}
                    className="absolute bg-gradient-to-r from-transparent via-blue-400/30 to-transparent dark:via-cyan-400/20"
                    style={{ left: `${el.x}%`, top: `${el.y}%`, width: el.length, height: '1px'}}
                    animate={{
                        rotate: [el.rotation, el.rotation + 5, el.rotation - 5, el.rotation],
                        opacity: [0, el.opacity, 0]
                    }}
                    transition={{ duration: el.duration, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
                />
            )
        }
        return null;
      })}
    </div>
  );
};

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  sageId?: string;
  sageName?: string;
  icon?: string;
  imageUrl?: string;
  isImageLoading?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  sageIds: string[];
  messages: Message[];
  timestamp: number;
  mode?: 'chat' | 'chavrusa';
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [message, setMessage] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState<'chat' | 'chavrusa'>('chat');
  
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [changelogText, setChangelogText] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isParashaOpen, setIsParashaOpen] = useState(false);
  const [isDafYomiOpen, setIsDafYomiOpen] = useState(false);
  const [isSiddurOpen, setIsSiddurOpen] = useState(false);
  
  const [customCharacters, setCustomCharacters] = useState<Character[]>([]);
  const [isAddCharOpen, setIsAddCharOpen] = useState(false);
  const [newChar, setNewChar] = useState({ name: '', desc: '', icon: '👤', prompt: '', greeting: '' });
  
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionSearch, setSessionSearch] = useState('');
  
  const [activeSages, setActiveSages] = useState<Character[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [user, setUser] = useState<any>(null);
  
  const [dateTimeInfo, setDateTimeInfo] = useState({
    gregorian: '',
    hebrew: '',
    time: '',
    parasha: ''
  });
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allCharacters = [...defaultCharacters, ...customCharacters];

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load from LocalStorage
  useEffect(() => {
    const savedDark = localStorage.getItem('israelgpt_dark');
    if (savedDark === 'true') setIsDarkMode(true);
    
    const savedChars = localStorage.getItem('israelgpt_custom_chars');
    if (savedChars) setCustomCharacters(JSON.parse(savedChars));
    
    const savedSessions = localStorage.getItem('israelgpt_sessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));

    fetch('/changelog.md')
      .then(res => res.text())
      .then(text => setChangelogText(text))
      .catch(err => console.error('Failed to load changelog', err));
  }, []);

  // Save Dark Mode
  useEffect(() => {
    localStorage.setItem('israelgpt_dark', isDarkMode.toString());
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save Sessions
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('israelgpt_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Save Custom Characters
  useEffect(() => {
    localStorage.setItem('israelgpt_custom_chars', JSON.stringify(customCharacters));
  }, [customCharacters]);

  useEffect(() => {
    const updateDateTime = () => {
      try {
        const now = new Date();
        const hDate = new HDate(now);
        const sedra = new Sedra(hDate.getFullYear(), true);
        const parashaArr = sedra.lookup(hDate);
        
        setDateTimeInfo({
          gregorian: now.toLocaleDateString('he-IL'),
          hebrew: hDate.render('he'),
          time: now.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          parasha: parashaArr ? parashaArr.parsha.map(p => Locale.gettext(p, 'he')).join(', ') : ''
        });
      } catch (err) {
        console.error('Failed to update date/time', err);
      }
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize or reset chat
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    // Only reset messages if we are not loading an existing session
    if (!currentSessionId) {
      setMessages([]);
      setChatStarted(false);
    }
  }, [activeSages, currentSessionId]);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleSend = async (overrideMsg?: string | React.MouseEvent | React.KeyboardEvent) => {
    const textToSend = typeof overrideMsg === 'string' ? overrideMsg : message;
    if (!textToSend.trim() || isLoading) return;
    
    const userMsg = textToSend.trim();
    if (typeof overrideMsg !== 'string') {
      setMessage('');
    }
    setChatStarted(true);
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text: userMsg };
    const newMessages = [...messages, newUserMsg];
    setMessages(newMessages);
    setIsLoading(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      let updatedMessages = [...newMessages];

      const generateImageTool = {
        name: "generate_image",
        description: "Generate an image based on a visual prompt. Use this when the user asks for a picture, drawing, sketch, or image.",
        parameters: {
          type: Type.OBJECT,
          properties: {
            imagePrompt: {
              type: Type.STRING,
              description: "A detailed prompt in English describing the image to generate."
            }
          },
          required: ["imagePrompt"]
        }
      };

      // Chavrusa Mode Logic
      if (mode === 'chavrusa' && activeSages.length >= 2) {
        const sageNames = activeSages.map(s => s.name).join(', ');
        const sageInstructions = activeSages.map(s => `אופי ${s.name}: ${s.systemInstruction}`).join('\n');
        
        const historyText = updatedMessages.map(m => `${m.role === 'user' ? 'משתמש' : m.sageName || 'מערכת'}: ${m.text}`).join('\n\n');
        
        const prompt = `
          היסטוריית השיחה:
          ${historyText}
          
          צור דיון (בית מדרש) מעמיק, מרתק ומכובד בין ${sageNames} בנושא האחרון שהעלה המשתמש.
          
          ${sageInstructions}
          
          הנחיות לדיון:
          1. כתוב את הדיון בצורה של מחזה (שם הדמות: טקסט).
          2. הדמויות צריכות לדון בנושא, להתווכח, להסכים, ולהביא מקורות מדויקים (פסוק, מסכת ודף בגמרא, סימן בשולחן ערוך) לכל רעיון או ציטוט.
          3. הדיון צריך להיות בעברית עשירה ותואמת לתקופה ולסגנון של כל דמות.
          4. סיים עם תובנה משותפת או סיכום קצר של הדעות השונות.
          5. אל תוסיף הקדמות כמו "הנה הדיון", פשוט התחל את הדיון.
        `;

        const modelMsgId = Date.now().toString();
        const modelMsg: Message = {
          id: modelMsgId,
          role: 'model',
          text: '',
          sageId: 'chavrusa',
          sageName: 'בית מדרש',
          icon: '🏛️'
        };
        
        updatedMessages = [...updatedMessages, modelMsg];
        setMessages(updatedMessages);

        try {
          const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: prompt,
          });

          let currentText = '';
          for await (const chunk of responseStream) {
            if (chunk.text) {
              currentText += chunk.text;
              setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: currentText } : m));
            }
          }
          updatedMessages = updatedMessages.map(m => m.id === modelMsgId ? { ...m, text: currentText } : m);
        } catch (err) {
          console.error("Streaming error", err);
          const errMsg = "מצטער, חלה שגיאה בתקשורת עם המודל.";
          setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: errMsg } : m));
          updatedMessages = updatedMessages.map(m => m.id === modelMsgId ? { ...m, text: errMsg } : m);
        }

      } else {
        // Standard Chat Mode Logic
        const currentSages = activeSages.length > 0 ? activeSages : [{
          id: 'default', name: 'IsraelGPT', icon: '✨', description: '', greeting: '',
          systemInstruction: 'אתה IsraelGPT, עוזר וירטואלי חכם, פטריוטי ומועיל. ענה בעברית תקנית, ברורה ואדיבה.'
        }];

        for (const sage of currentSages) {
          const historyText = updatedMessages.map(m => `${m.role === 'user' ? 'משתמש' : m.sageName || 'מערכת'}: ${m.text}`).join('\n\n');
          const prompt = `היסטוריית השיחה:\n${historyText}\n\nהגב כעת בתור ${sage.name}. אל תוסיף את שמך בתחילת התשובה, רק את התוכן.
          חשוב מאוד: בכל תשובה, השתדל להביא מקורות מדויקים (פסוק, מסכת ודף בגמרא, סימן בשולחן ערוך, או שם הספר) לכל רעיון או ציטוט שאתה מביא. הצג את המקורות בסוגריים או בהערת שוליים מסודרת.`;
  
          const modelMsgId = Date.now().toString() + Math.random().toString();
          const modelMsg: Message = {
            id: modelMsgId,
            role: 'model',
            text: '',
            sageId: sage.id,
            sageName: sage.name,
            icon: sage.icon
          };
          
          updatedMessages = [...updatedMessages, modelMsg];
          setMessages(updatedMessages);
  
          try {
            const responseStream = await ai.models.generateContentStream({
              model: 'gemini-3-flash-preview',
              contents: prompt,
              config: { 
                systemInstruction: sage.systemInstruction,
                tools: [{ functionDeclarations: [generateImageTool] }]
              }
            });
  
            let currentText = '';
            let imageUrl = '';
  
            for await (const chunk of responseStream) {
              if (chunk.functionCalls && chunk.functionCalls.length > 0) {
                const call = chunk.functionCalls[0];
                if (call.name === 'generate_image') {
                  const args = call.args as any;
                  const imagePrompt = args.imagePrompt;
                  
                  setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, isImageLoading: true } : m));
                  
                  try {
                    const imgResponse = await ai.models.generateContent({
                      model: 'gemini-2.5-flash-image',
                      contents: { parts: [{ text: imagePrompt }] }
                    });
                    
                    for (const part of imgResponse.candidates?.[0]?.content?.parts || []) {
                      if (part.inlineData) {
                        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                      }
                    }
                  } catch (imgErr) {
                    console.error("Image generation failed", imgErr);
                    currentText += "\n\n*(שגיאה: לא הצלחתי לייצר את התמונה המבוקשת)*";
                  }
                }
              }
              
              if (chunk.text) {
                currentText += chunk.text;
              }
  
              setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: currentText, imageUrl, isImageLoading: false } : m));
            }
            
            updatedMessages = updatedMessages.map(m => m.id === modelMsgId ? { ...m, text: currentText, imageUrl, isImageLoading: false } : m);
            
          } catch (err) {
            console.error("Streaming error", err);
            const errMsg = "מצטער, חלה שגיאה בתקשורת עם המודל.";
            setMessages(prev => prev.map(m => m.id === modelMsgId ? { ...m, text: errMsg } : m));
            updatedMessages = updatedMessages.map(m => m.id === modelMsgId ? { ...m, text: errMsg } : m);
          }
        }
      }
      
      // Save to session
      saveSession(updatedMessages);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'model', text: 'מצטער, חלה שגיאה כללית. אנא נסה שוב.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSession = (msgs: Message[]) => {
    setSessions(prev => {
      const existing = prev.find(s => s.id === currentSessionId);
      if (existing) {
        return prev.map(s => s.id === currentSessionId ? { ...s, messages: msgs } : s);
      } else {
        const newId = Date.now().toString();
        setCurrentSessionId(newId);
        return [{
          id: newId,
          title: msgs[0].text.substring(0, 30) + '...',
          sageIds: activeSages.map(s => s.id),
          messages: msgs,
          timestamp: Date.now(),
          mode: mode
        }, ...prev];
      }
    });
  };

  const loadSession = (session: ChatSession) => {
    setCurrentSessionId(session.id);
    setMessages(session.messages);
    setChatStarted(true);
    const sages = allCharacters.filter(c => session.sageIds?.includes(c.id));
    setActiveSages(sages);
    setMode(session.mode || 'chat');
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const startNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setChatStarted(false);
    setActiveSages([]);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addCustomCharacter = () => {
    if (!newChar.name || !newChar.prompt) return;
    const character: Character = {
      id: `custom_${Date.now()}`,
      name: newChar.name,
      description: newChar.desc || 'דמות מותאמת אישית',
      icon: newChar.icon || '👤',
      systemInstruction: newChar.prompt,
      greeting: newChar.greeting || `שלום, אני ${newChar.name}.`
    };
    setCustomCharacters(prev => [...prev, character]);
    setIsAddCharOpen(false);
    setNewChar({ name: '', desc: '', icon: '👤', prompt: '', greeting: '' });
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions(prev => prev.filter(s => s.id !== id));
    if (currentSessionId === id) {
      startNewChat();
    }
  };

  const handleTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'he-IL';
      
      // Try to find a more natural sounding Hebrew voice
      const voices = window.speechSynthesis.getVoices();
      const hebrewVoice = voices.find(v => v.lang === 'he-IL' && v.name.includes('Google'));
      if (hebrewVoice) {
        utterance.voice = hebrewVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower for better clarity
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('הדפדפן שלך לא תומך בהקראת טקסט.');
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('הדפדפן שלך לא תומך בזיהוי קולי.');
      return;
    }
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'he-IL';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    recognition.onstart = () => {
      setIsListening(true);
    };
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(prev => prev ? prev + ' ' + transcript : transcript);
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };
    
    recognition.start();
  };

  const handleDownloadMD = () => {
    if (messages.length === 0) return;
    
    let mdContent = `# שיחה עם ${activeSages.length > 0 ? activeSages.map(s => s.name).join(', ') : 'IsraelGPT'}\n\n`;
    messages.forEach(msg => {
      mdContent += `**${msg.role === 'user' ? 'אתה' : (msg.sageName || 'IsraelGPT')}**:\n${msg.text}\n\n`;
    });
    
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `israelgpt-chat-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMessageMD = (msg: Message) => {
    const mdContent = `**${msg.role === 'user' ? 'אתה' : (msg.sageName || 'IsraelGPT')}**:\n${msg.text}\n`;
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `israelgpt-message-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareMessageImage = async (msgId: string) => {
    const el = document.getElementById(`message-${msgId}`);
    if (!el) return;
    try {
      const dataUrl = await toPng(el, {
        backgroundColor: isDarkMode ? '#0f172a' : '#f4f7fb',
        pixelRatio: 2,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `israelgpt-msg-${Date.now()}.png`;
      a.click();
    } catch (error) {
      console.error('Failed to generate image', error);
      alert('אירעה שגיאה ביצירת התמונה.');
    }
  };

  return (
    <div dir="rtl" className={`flex h-screen overflow-hidden selection:bg-blue-200 selection:text-blue-900 relative transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gradient-to-br from-[#f0f5ff] via-white to-[#e6f0ff] text-slate-800'} font-sans`}>
      
      {/* Interactive Background */}
      <DynamicBackground mousePos={mousePos} />
      
      {/* Mouse Glow Follower */}
      <motion.div
        className={`fixed w-[600px] h-[600px] rounded-full blur-[100px] pointer-events-none z-0 ${isDarkMode ? 'bg-blue-500/5' : 'bg-blue-500/10'}`}
        animate={{
          x: mousePos.x - 300,
          y: mousePos.y - 300,
        }}
        transition={{ type: "spring", stiffness: 40, damping: 20, mass: 0.8 }}
      />

      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`h-full backdrop-blur-2xl border-l flex flex-col shadow-[4px_0_30px_rgba(37,99,235,0.05)] z-20 shrink-0 overflow-hidden relative ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/70 border-blue-100/50'}`}
          >
            <div className="w-[280px] h-full flex flex-col">
              <div className="p-4 flex items-center justify-between">
                <div className={`flex items-center gap-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                  <div className={`p-2 rounded-xl shadow-sm border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50'}`}>
                    <StarOfDavid className="w-6 h-6 text-blue-500" />
                  </div>
                  <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-l from-blue-500 to-cyan-400">IsraelGPT</span>
                </div>
                {user ? (
                  <button onClick={handleLogout} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`} title="התנתק">
                    <LogOut className="w-5 h-5" />
                  </button>
                ) : (
                  <button onClick={handleGoogleLogin} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`} title="התחבר">
                    <LogIn className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Mobile/Sidebar Date Info */}
              <div className="px-4 mb-2 lg:hidden">
                <div className={`p-3 rounded-xl border text-[10px] space-y-1.5 ${isDarkMode ? 'bg-slate-800/50 border-slate-700/50 text-slate-400' : 'bg-blue-50/50 border-blue-100/50 text-blue-600'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Scroll className="w-3 h-3 opacity-70" />
                      <span>{dateTimeInfo.hebrew}</span>
                    </div>
                    <span>{dateTimeInfo.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                    <BookOpen className="w-3 h-3" />
                    <span>פרשת {dateTimeInfo.parasha}</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 space-y-2">
                <button 
                  onClick={startNewChat}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] font-medium active:scale-[0.98] border border-blue-400/20"
                >
                  <Plus className="w-5 h-5" />
                  <span>צ'אט חדש</span>
                </button>
                
                <div className={`p-1 rounded-xl flex ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <button 
                    onClick={() => { setMode('chat'); setActiveSages([]); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === 'chat' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-700 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`}
                  >
                    צ'אט אישי
                  </button>
                  <button 
                    onClick={() => { setMode('chavrusa'); setActiveSages([]); }}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${mode === 'chavrusa' ? (isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'bg-white text-blue-700 shadow-sm') : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700')}`}
                  >
                    <Users className="w-3 h-3" />
                    בית מדרש
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
                {/* History Section */}
                {sessions.length > 0 && (
                  <div>
                    <h3 className={`text-xs font-semibold mb-3 px-3 uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-blue-400/80'}`}>
                      <History className="w-3.5 h-3.5" />
                      היסטוריה
                    </h3>
                    <div className="px-3 mb-3">
                      <input 
                        type="text"
                        value={sessionSearch}
                        onChange={e => setSessionSearch(e.target.value)}
                        placeholder="חפש שיחות..."
                        className={`w-full px-3 py-2 text-sm rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-blue-200 text-blue-900 placeholder:text-blue-400'}`}
                      />
                    </div>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-3">
                      {sessions.filter(s => s.title.toLowerCase().includes(sessionSearch.toLowerCase())).map(session => (
                        <div key={session.id} className="relative group">
                          <button 
                            onClick={() => loadSession(session)}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-right text-sm ${
                              currentSessionId === session.id 
                                ? (isDarkMode ? 'bg-slate-800 text-white' : 'bg-blue-50 text-blue-900 font-medium') 
                                : (isDarkMode ? 'hover:bg-slate-800/50 text-slate-300' : 'hover:bg-slate-100/50 text-slate-600')
                            }`}
                          >
                            <MessageSquare className="w-4 h-4 shrink-0 opacity-50" />
                            <span className="truncate flex-1">{session.title}</span>
                          </button>
                          <button 
                            onClick={(e) => deleteSession(e, session.id)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sages Section */}
                <div>
                  <div className="flex items-center justify-between px-3 mb-3">
                    <h3 className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-2 ${isDarkMode ? 'text-slate-400' : 'text-blue-400/80'}`}>
                      <BookOpen className="w-3.5 h-3.5" />
                      שוחח עם חכמינו
                    </h3>
                    <button 
                      onClick={() => setIsAddCharOpen(true)}
                      className={`p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`}
                      title="הוסף דמות משלך"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {['אבות האומה', 'נביאים ומנהיגים', 'תנאים', 'ראשונים', 'אחרונים', 'דמויות אישיות'].map((era) => {
                      const eraChars = allCharacters.filter(c => (c.era || 'דמויות אישיות') === era);
                      if (eraChars.length === 0) return null;
                      
                      return (
                        <div key={era}>
                          <h4 className={`text-[10px] font-bold uppercase tracking-wider mb-2 px-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            {era}
                          </h4>
                          <div className="space-y-2">
                            {eraChars.map((sage, i) => (
                              <button 
                                key={sage.id} 
                                onClick={() => {
                                  if (mode === 'chavrusa') {
                                    setActiveSages(prev => {
                                      const exists = prev.find(s => s.id === sage.id);
                                      if (exists) return prev.filter(s => s.id !== sage.id);
                                      if (prev.length >= 4) return [...prev.slice(1), sage]; // Keep the last 3 and add the new one
                                      return [...prev, sage];
                                    });
                                  } else {
                                    setActiveSages(prev => {
                                      const exists = prev.find(s => s.id === sage.id);
                                      if (exists) return prev.filter(s => s.id !== sage.id);
                                      return [...prev, sage];
                                    });
                                  }
                                  if (!chatStarted) {
                                    setCurrentSessionId(null);
                                    setMessages([]);
                                  }
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-right group border ${
                                  activeSages.some(s => s.id === sage.id)
                                    ? (isDarkMode ? 'bg-slate-800 border-slate-700 shadow-sm' : 'bg-blue-50 border-blue-200 shadow-sm')
                                    : (isDarkMode ? 'hover:bg-slate-800/50 border-transparent hover:border-slate-700' : 'hover:bg-blue-50/80 border-transparent hover:border-blue-100/50 hover:shadow-sm')
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-inner border group-hover:scale-110 transition-transform shrink-0 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-br from-blue-100 to-blue-50 border-blue-200/50'}`}>
                                  {sage.icon}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                  <div className={`font-bold text-sm truncate ${isDarkMode ? 'text-slate-200' : 'text-blue-900'}`}>{sage.name}</div>
                                  <div className={`text-xs truncate font-medium ${isDarkMode ? 'text-slate-400' : 'text-blue-600/70'}`}>{sage.description}</div>
                                </div>
                                {activeSages.some(s => s.id === sage.id) && (
                                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0"></div>
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={`p-4 border-t backdrop-blur-md ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-blue-100/50 bg-white/40'}`}>
                <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-right border border-transparent ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700' : 'hover:bg-white hover:shadow-[0_4px_15px_rgba(37,99,235,0.05)] hover:border-blue-200/50'}`}>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-medium text-sm shadow-md border border-white/20">
                    יש
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>ישראל ישראלי</div>
                    <div className="text-xs text-blue-500 font-medium">תוכנית Pro</div>
                  </div>
                  <Settings className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-blue-400'}`} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative min-w-0 z-10">
        {/* Header */}
        <header className={`h-16 flex items-center justify-between px-4 backdrop-blur-2xl border-b sticky top-0 z-20 ${isDarkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-white/40 border-blue-100/50'}`}>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-xl transition-all border border-transparent ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700 text-slate-300' : 'hover:bg-white/80 hover:shadow-sm hover:border-blue-100 text-blue-600'}`}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div 
              onClick={() => setIsChangelogOpen(true)}
              className={`flex items-center gap-2 px-3 py-1.5 backdrop-blur-md rounded-xl cursor-pointer transition-colors group border ${isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-700' : 'bg-white/80 shadow-[0_2px_10px_rgba(37,99,235,0.05)] border-blue-100/80 hover:bg-blue-50'}`}
              title="צפה ביומן אירועים (Changelog)"
            >
              <span className={`text-sm font-bold transition-colors ${isDarkMode ? 'text-slate-200 group-hover:text-white' : 'text-blue-900 group-hover:text-blue-700'}`}>IsraelGPT</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>v0.8.8</span>
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            </div>
            
            {/* Date & Time Info */}
            <div className={`hidden lg:flex items-center gap-3 px-4 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${isDarkMode ? 'bg-slate-800/40 border-slate-700/50 text-slate-400' : 'bg-blue-50/50 border-blue-100/50 text-blue-600'}`}>
              <div className="flex items-center gap-1.5">
                <Scroll className="w-3 h-3 opacity-70" />
                <span>{dateTimeInfo.hebrew}</span>
              </div>
              <div className="w-px h-3 bg-current opacity-20" />
              <div className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 opacity-70" />
                <span>{dateTimeInfo.gregorian}</span>
              </div>
              <div className="w-px h-3 bg-current opacity-20" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3 h-3 opacity-70" />
                <span>{dateTimeInfo.time}</span>
              </div>
              <div className="w-px h-3 bg-current opacity-20" />
              <div className="flex items-center gap-1.5 text-blue-500 font-bold">
                <BookOpen className="w-3 h-3" />
                <span>פרשת {dateTimeInfo.parasha}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownloadMD}
              className={`p-2 rounded-xl transition-all border border-transparent ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700 text-slate-300' : 'hover:bg-white/80 hover:shadow-sm hover:border-blue-100 text-blue-600'}`}
              title="הורד שיחה כמסמך"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all border border-transparent ${isDarkMode ? 'hover:bg-slate-800 hover:border-slate-700 text-yellow-400' : 'hover:bg-white/80 hover:shadow-sm hover:border-blue-100 text-slate-600'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button 
              onClick={() => setIsSiddurOpen(true)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-all border ${isDarkMode ? 'text-blue-400 bg-slate-800/80 border-slate-700 hover:bg-slate-700' : 'text-blue-700 bg-white/80 backdrop-blur-md border-blue-200/80 hover:bg-blue-50 hover:shadow-[0_2px_10px_rgba(37,99,235,0.1)]'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">סידור קול הרבים</span>
            </button>
            <button 
              onClick={() => setIsParashaOpen(true)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-all border ${isDarkMode ? 'text-blue-400 bg-slate-800/80 border-slate-700 hover:bg-slate-700' : 'text-blue-700 bg-white/80 backdrop-blur-md border-blue-200/80 hover:bg-blue-50 hover:shadow-[0_2px_10px_rgba(37,99,235,0.1)]'}`}
            >
              <Scroll className="w-4 h-4" />
              <span className="hidden sm:inline">פרשת שבוע</span>
            </button>
            <button 
              onClick={() => setIsDafYomiOpen(true)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-all border ${isDarkMode ? 'text-blue-400 bg-slate-800/80 border-slate-700 hover:bg-slate-700' : 'text-blue-700 bg-white/80 backdrop-blur-md border-blue-200/80 hover:bg-blue-50 hover:shadow-[0_2px_10px_rgba(37,99,235,0.1)]'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">תלמוד יומי</span>
            </button>
            <button 
              onClick={() => setIsAboutOpen(true)}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-1.5 rounded-full transition-all border ${isDarkMode ? 'text-blue-400 bg-slate-800/80 border-slate-700 hover:bg-slate-700' : 'text-blue-700 bg-white/80 backdrop-blur-md border-blue-200/80 hover:bg-blue-50 hover:shadow-[0_2px_10px_rgba(37,99,235,0.1)]'}`}
            >
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline">אודות</span>
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 scroll-smooth z-10">
          <div className="max-w-3xl mx-auto h-full flex flex-col" ref={chatContainerRef}>
            
            {!chatStarted ? (
              /* Welcome Screen */
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-center text-center mt-10 mb-20"
              >
                <div className="relative mb-8 group">
                  <div className="absolute inset-0 bg-blue-500 blur-[50px] opacity-20 rounded-full group-hover:opacity-40 transition-opacity duration-700"></div>
                  <div className={`w-28 h-28 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center shadow-[0_8px_32px_rgba(37,99,235,0.15)] border relative z-10 group-hover:scale-105 transition-transform duration-500 ${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-blue-100'}`}>
                    <StarOfDavid className="w-14 h-14 text-blue-500 drop-shadow-md" />
                  </div>
                </div>
                <h1 className={`text-4xl md:text-5xl font-bold text-transparent bg-clip-text mb-4 tracking-tight drop-shadow-sm ${isDarkMode ? 'bg-gradient-to-l from-blue-400 via-blue-300 to-cyan-300' : 'bg-gradient-to-l from-blue-900 via-blue-700 to-blue-500'}`}>
                  {mode === 'chavrusa' ? (
                    activeSages.length === 2 
                      ? `דיאלוג בין ${activeSages[0].name} ל${activeSages[1].name}`
                      : 'בחר שתי דמויות לדיאלוג'
                  ) : (
                    activeSages.length > 0 ? `שלום, אנחנו ${activeSages.map(s => s.name).join(', ')}` : 'איך אפשר לעזור לך היום?'
                  )}
                </h1>
                <p className={`mb-12 max-w-md text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-blue-800/60'}`}>
                  {mode === 'chavrusa' 
                    ? 'בחר נושא, והדמויות ידונו בו ביניהן מתוך עולמן הרוחני.'
                    : (activeSages.length === 1 
                        ? activeSages[0].greeting 
                        : activeSages.length > 1 
                          ? 'אנחנו כאן כדי לדון ולעזור יחד. פשוט תשאל.'
                          : 'אני כאן כדי לעזור לך לכתוב, לתכנן, ללמוד וליצור. פשוט תשאל.')
                  }
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  {[
                    { icon: BookOpen, text: 'הסבר את המחלוקת בין בית הלל לבית שמאי', color: 'text-blue-500', bg: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50' },
                    { icon: StarOfDavid, text: 'מהי המשמעות הפנימית של מצוות השבת?', color: 'text-indigo-500', bg: isDarkMode ? 'bg-indigo-500/10' : 'bg-indigo-50' },
                    { icon: Heart, text: 'ספר לי סיפור חסידי על אהבת ישראל', color: 'text-cyan-500', bg: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50' },
                    { icon: Scroll, text: 'כתוב לי דבר תורה קצר לפרשת השבוע', color: 'text-sky-500', bg: isDarkMode ? 'bg-sky-500/10' : 'bg-sky-50' }
                  ].map((item, i) => (
                    <motion.button 
                      key={i} 
                      whileHover={{ scale: 1.02, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setMessage(item.text);
                        if (textareaRef.current) {
                          textareaRef.current.focus();
                        }
                      }}
                      className={`flex items-center gap-4 p-4 backdrop-blur-md border rounded-2xl transition-all text-right group ${isDarkMode ? 'bg-slate-800/60 border-slate-700 hover:border-blue-500 hover:bg-slate-800' : 'bg-white/60 border-blue-100/80 hover:border-blue-400 hover:shadow-[0_8px_24px_rgba(37,99,235,0.15)] hover:bg-white/90'}`}
                    >
                      <div className={`p-3 rounded-xl ${item.bg} shadow-sm border border-white/10 transition-colors group-hover:scale-110 duration-300`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <span className={`text-sm font-semibold leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-blue-900/80'}`}>{item.text}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              /* Chat Messages */
              <div className="space-y-8">
                {messages.map((msg, idx) => (
                  <motion.div 
                    key={msg.id || idx}
                    id={`message-${msg.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 p-4 rounded-2xl ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/40'}`}
                  >
                    {msg.role === 'user' ? (
                      <>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-medium text-sm shrink-0 mt-1 shadow-md border border-white/20">
                          יש
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className={`font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>אתה</div>
                          <div className={`font-medium leading-relaxed text-[15px] whitespace-pre-wrap ${isDarkMode ? 'text-slate-200' : 'text-blue-900/80'}`}>
                            {msg.text}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shrink-0 mt-1 shadow-[0_4px_15px_rgba(37,99,235,0.4)] border border-blue-400/30 text-lg">
                          {msg.icon || <StarOfDavid className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 space-y-3">
                          <div className={`font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>{msg.sageName || 'IsraelGPT'}</div>
                          
                          {msg.text && (
                            <div className={`prose prose-p:leading-relaxed max-w-none text-[15px] font-medium markdown-body ${isDarkMode ? 'prose-invert text-slate-300' : 'prose-slate text-blue-900/80'}`} dir="rtl">
                              <Markdown>{msg.text}</Markdown>
                            </div>
                          )}
                          
                          {msg.isImageLoading && (
                            <div className={`flex items-center gap-2 mt-4 p-4 rounded-xl border border-dashed ${isDarkMode ? 'bg-blue-900/20 border-blue-800 text-blue-400' : 'bg-blue-50/50 border-blue-200 text-blue-500'}`}>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span className="text-sm font-medium">מצייר תמונה...</span>
                            </div>
                          )}

                          {msg.imageUrl && (
                            <div className={`mt-4 rounded-xl overflow-hidden border shadow-sm ${isDarkMode ? 'border-slate-700' : 'border-blue-100/50'}`}>
                              <img src={msg.imageUrl} alt="Generated" className="w-full max-w-md h-auto object-contain" />
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 pt-2">
                            <button 
                              onClick={() => handleTTS(msg.text)}
                              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm'}`} 
                              title="הקרא טקסט"
                            >
                              <Volume2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm'}`} title="העתק טקסט"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDownloadMessageMD(msg)}
                              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm'}`} title="הורד כמסמך Markdown"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleShareMessageImage(msg.id)}
                              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50 hover:shadow-sm'}`} title="שתף הודעה כתמונה"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                            <button className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800' : 'text-blue-400 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm'}`} title="תשובה טובה">
                              <ThumbsUp className="w-4 h-4" />
                            </button>
                            <button className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-blue-400 hover:text-red-600 hover:bg-red-50 hover:shadow-sm'}`} title="תשובה לא טובה">
                              <ThumbsDown className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                ))}
                {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 p-4 rounded-2xl ${isDarkMode ? 'bg-slate-900/40' : 'bg-white/40'}`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white shrink-0 mt-1 shadow-[0_4px_15px_rgba(37,99,235,0.4)] border border-blue-400/30 text-lg">
                      <StarOfDavid className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className={`font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>IsraelGPT</div>
                      <div className="flex items-center gap-2 text-blue-500">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-sm font-medium">חושב...</span>
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`w-full pt-4 pb-6 px-4 sm:px-6 md:px-8 z-20 shrink-0 ${isDarkMode ? 'bg-slate-950' : 'bg-[#f4f7fb]'}`}>
          <div className="max-w-3xl mx-auto relative">
            <div className={`backdrop-blur-2xl border rounded-[1.5rem] overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-700 shadow-[0_8px_40px_rgba(0,0,0,0.3)]' : 'bg-white/90 border-blue-200/80 shadow-[0_8px_40px_rgba(37,99,235,0.12)]'}`}>
              <textarea 
                ref={textareaRef}
                rows={1}
                placeholder="שאל את IsraelGPT כל דבר..."
                className={`w-full max-h-48 min-h-[60px] py-4 px-5 bg-transparent border-none focus:ring-0 resize-none text-[15px] leading-relaxed font-medium ${isDarkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-blue-900 placeholder:text-blue-400/70'}`}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                dir="auto"
              />
              <div className="flex items-center justify-between px-3 pb-3">
                <div className="flex items-center gap-1">
                  <button className={`p-2.5 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50'}`} title="צרף קובץ">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleVoiceInput}
                    className={`p-2.5 rounded-xl transition-colors ${isListening ? 'text-red-500 animate-pulse bg-red-50 dark:bg-red-500/10' : (isDarkMode ? 'text-slate-400 hover:text-blue-400 hover:bg-slate-800' : 'text-blue-400 hover:text-blue-700 hover:bg-blue-50')}`} 
                    title="הקלטה קולית"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleSend}
                    disabled={!message.trim()}
                    className={`p-2.5 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      message.trim() 
                        ? 'bg-gradient-to-l from-blue-600 to-blue-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95' 
                        : (isDarkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-50 text-blue-300 cursor-not-allowed')
                    }`}
                  >
                    <Send className="w-5 h-5 rtl:-scale-x-100" />
                  </button>
                </div>
              </div>
            </div>
            <div className="text-center mt-3">
              <span className={`text-xs font-semibold tracking-wide ${isDarkMode ? 'text-slate-500' : 'text-blue-600/60'}`}>
                IsraelGPT יכול לעשות טעויות. מומלץ לבדוק מידע חשוב.
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* Changelog Modal */}
      <AnimatePresence>
        {isChangelogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsChangelogOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl backdrop-blur-2xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[80vh] z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-blue-200/80'}`}
            >
              <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <History className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>מה חדש ב-IsraelGPT?</h2>
                </div>
                <button onClick={() => setIsChangelogOpen(false)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                <div className={`markdown-body ${isDarkMode ? 'prose-invert' : ''}`} dir="rtl">
                  <Markdown>{changelogText}</Markdown>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {isAboutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAboutOpen(false)}
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
                    <Info className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>אודות IsraelGPT</h2>
                </div>
                <button onClick={() => setIsAboutOpen(false)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center shadow-lg mb-4 ${isDarkMode ? 'bg-slate-800 text-blue-400' : 'bg-white text-blue-600'}`}>
                    <StarOfDavid className="w-10 h-10" />
                  </div>
                  <h3 className={`text-2xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>IsraelGPT</h3>
                  <p className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-blue-600/70'}`}>גרסה 0.7.0</p>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
                  <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-blue-800'}`}>
                    <ShieldCheck className="w-4 h-4" />
                    זכויות יוצרים וקרדיטים
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    כל הזכויות שמורות © 2026 ל-IsraelGPT.
                    <br />
                    אפליקציה זו פותחה במטרה להפוך לשירות מוביל המשלב בינה מלאכותית מתקדמת (Gemini) עם תכנים וערכים ישראליים ויהודיים.
                  </p>
                  <div className="mt-4 pt-4 border-t border-dashed border-slate-300 dark:border-slate-700">
                    <p className={`text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>פיתוח ועיצוב:</p>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      לאון יעקובוב (AnLoMinus)
                    </p>
                    <div className="flex flex-col gap-1 mt-2 text-xs">
                      <a href="https://github.com/AnLoMinus" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center gap-1">
                        GitHub: AnLoMinus
                      </a>
                      <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                        WhatsApp: 054-328-5967
                      </span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-blue-50/50 border-blue-100'}`}>
                  <h4 className={`text-sm font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-blue-800'}`}>
                    <Zap className="w-4 h-4" />
                    חזון לעתיד
                  </h4>
                  <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    אנו עמלים על פיתוח גרסאות קומפקטיות (Offline) שיאפשרו שימוש במודלים מתקדמים על גבי מכשירים מקומיים ללא צורך בחיבור לאינטרנט, תוך שמירה על פרטיות מלאה.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => setIsTermsOpen(true)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-blue-200 hover:bg-blue-50 text-blue-700'}`}
                  >
                    <FileCheck className="w-4 h-4" />
                    תנאי שימוש
                  </button>
                  <button 
                    onClick={() => setIsPrivacyOpen(true)}
                    className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors border ${isDarkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-blue-200 hover:bg-blue-50 text-blue-700'}`}
                  >
                    <Scale className="w-4 h-4" />
                    מדיניות פרטיות
                  </button>
                </div>
              </div>
              <div className={`p-4 border-t text-center text-xs ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-blue-100/50 text-slate-400'}`}>
                Made with ❤️ in Israel
              </div>
              
              {/* User Profile Footer */}
              {user && (
                <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                    <span className={`text-sm truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {user.displayName || user.email}
                    </span>
                  </div>
                  <button onClick={() => setIsSettingsOpen(true)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`} title="הגדרות">
                    <SettingsIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Terms of Use Modal */}
      <AnimatePresence>
        <TermsOfUse 
          isOpen={isTermsOpen} 
          onClose={() => setIsTermsOpen(false)} 
          isDarkMode={isDarkMode} 
        />
      </AnimatePresence>

      {/* Privacy Policy Modal */}
      <AnimatePresence>
        <PrivacyPolicy 
          isOpen={isPrivacyOpen} 
          onClose={() => setIsPrivacyOpen(false)} 
          isDarkMode={isDarkMode} 
        />
      </AnimatePresence>

      {/* Settings Modal */}
      <Settings 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        isDarkMode={isDarkMode} 
        user={user}
      />

      {/* Add Character Modal */}
      <AnimatePresence>
        {isAddCharOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsAddCharOpen(false)}
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
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-blue-900'}`}>הוסף דמות חדשה</h2>
                </div>
                <button onClick={() => setIsAddCharOpen(false)} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>שם הדמות</label>
                  <input 
                    type="text" 
                    value={newChar.name}
                    onChange={e => setNewChar({...newChar, name: e.target.value})}
                    placeholder="למשל: הרצל"
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-blue-200 text-blue-900 placeholder:text-blue-300'}`}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>תיאור קצר</label>
                    <input 
                      type="text" 
                      value={newChar.desc}
                      onChange={e => setNewChar({...newChar, desc: e.target.value})}
                      placeholder="למשל: חוזה המדינה"
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-blue-200 text-blue-900 placeholder:text-blue-300'}`}
                    />
                  </div>
                  <div className="w-24">
                    <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>אייקון</label>
                    <input 
                      type="text" 
                      value={newChar.icon}
                      onChange={e => setNewChar({...newChar, icon: e.target.value})}
                      className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all text-center text-xl ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-blue-200 text-blue-900'}`}
                    />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>הנחיות אופי (System Prompt)</label>
                  <textarea 
                    value={newChar.prompt}
                    onChange={e => setNewChar({...newChar, prompt: e.target.value})}
                    placeholder="הגדר איך הדמות צריכה לדבר ולהתנהג..."
                    rows={4}
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-blue-200 text-blue-900 placeholder:text-blue-300'}`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-1 ${isDarkMode ? 'text-slate-300' : 'text-blue-900'}`}>משפט פתיחה</label>
                  <input 
                    type="text" 
                    value={newChar.greeting}
                    onChange={e => setNewChar({...newChar, greeting: e.target.value})}
                    placeholder="למשל: אם תרצו, אין זו אגדה..."
                    className={`w-full px-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-white border-blue-200 text-blue-900 placeholder:text-blue-300'}`}
                  />
                </div>
              </div>
              <div className={`p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
                <button 
                  onClick={() => setIsAddCharOpen(false)}
                  className={`px-5 py-2 rounded-xl font-medium transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  ביטול
                </button>
                <button 
                  onClick={addCustomCharacter}
                  disabled={!newChar.name || !newChar.prompt}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-sm"
                >
                  הוסף דמות
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Siddur 
        isOpen={isSiddurOpen} 
        onClose={() => setIsSiddurOpen(false)} 
        isDarkMode={isDarkMode} 
      />

      <AnimatePresence>
        <ParashatHashavua 
          isOpen={isParashaOpen} 
          onClose={() => setIsParashaOpen(false)} 
          isDarkMode={isDarkMode} 
          onStartStudy={handleSend} 
        />
      </AnimatePresence>

      <AnimatePresence>
        <DafYomi 
          isOpen={isDafYomiOpen} 
          onClose={() => setIsDafYomiOpen(false)} 
          isDarkMode={isDarkMode} 
          onStartStudy={handleSend} 
        />
      </AnimatePresence>
    </div>
  );
}
