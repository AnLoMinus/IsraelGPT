import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Book, ChevronRight, Search, FileText, Info, ExternalLink } from 'lucide-react';
import Markdown from 'react-markdown';

interface TorahLearningProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TorahLearning: React.FC<TorahLearningProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/torah/list')
        .then(res => res.json())
        .then(data => setFiles(data.files || []))
        .catch(err => console.error('Failed to list Torah files', err));
    }
  }, [isOpen]);

  const handleFileSelect = async (filename: string) => {
    setLoading(true);
    setSelectedFile(filename);
    try {
      const res = await fetch(`/api/torah/read/${encodeURIComponent(filename)}`);
      const data = await res.json();
      setContent(data.content || '');
    } catch (err) {
      console.error('Failed to read Torah file', err);
      setContent('שגיאה בטעינת הקובץ.');
    } finally {
      setLoading(false);
    }
  };

  const filteredFiles = files.filter(f => f.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className={`w-full sm:max-w-6xl h-full sm:h-[85vh] rounded-none sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border ${
            isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-blue-100 text-blue-900'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-blue-50 bg-blue-50/30'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight">תורה אורה והוראה</h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-blue-600/70'}`}>ספריית הדרכה, מוסר וכלים להעברת שיעורי תורה</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-all ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-blue-100 text-blue-400'}`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Sidebar - File List */}
            <div className={`w-full md:w-80 border-b md:border-b-0 md:border-l flex flex-col ${selectedFile ? 'hidden md:flex' : 'flex'} ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-50 bg-slate-50/30'}`}>
              <div className="p-4">
                <div className="relative">
                  <Search className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-blue-400'}`} />
                  <input
                    type="text"
                    placeholder="חפש תכנים..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className={`w-full pr-10 pl-4 py-2 rounded-xl text-sm border outline-none transition-all ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white focus:border-blue-500' : 'bg-white border-blue-100 text-blue-900 focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {filteredFiles.map(file => (
                  <button
                    key={file}
                    onClick={() => handleFileSelect(file)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all group ${
                      selectedFile === file
                        ? (isDarkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-blue-600 text-white shadow-lg shadow-blue-600/20')
                        : (isDarkMode ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-blue-50 text-blue-700')
                    }`}
                  >
                    <FileText className={`w-5 h-5 shrink-0 ${selectedFile === file ? 'text-white' : 'opacity-50'}`} />
                    <span className="truncate flex-1 font-medium">{file.replace('.md', '')}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${selectedFile === file ? 'rotate-90 text-white' : 'opacity-0 group-hover:opacity-100'}`} />
                  </button>
                ))}
                {filteredFiles.length === 0 && (
                  <div className="p-8 text-center opacity-50 text-sm">לא נמצאו קבצים</div>
                )}
              </div>
            </div>

            {/* Content Area */}
            <div className={`flex-1 overflow-y-auto bg-transparent relative ${!selectedFile ? 'hidden md:block' : 'block'}`}>
              {selectedFile && (
                <button 
                  onClick={() => setSelectedFile(null)}
                  className="md:hidden absolute top-4 right-4 z-10 p-2 rounded-full bg-blue-500 text-white shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
              )}
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : selectedFile ? (
                <div className="p-8 md:p-12 max-w-4xl mx-auto">
                  <div className="markdown-body prose prose-blue dark:prose-invert max-w-none">
                    <Markdown>{content}</Markdown>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-blue-50'}`}>
                    <Info className={`w-12 h-12 ${isDarkMode ? 'text-slate-600' : 'text-blue-200'}`} />
                  </div>
                  <div className="max-w-md">
                    <h3 className="text-xl font-bold mb-2">בחר תוכן ללמידה</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-blue-600/60'}`}>
                      בחר אחד מהקבצים בתפריט הימני כדי לצפות בתוכן, ללמוד את המוסר ולהתנהל על פי ההדרכות המקצועיות להעברת שיעורי תורה.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
