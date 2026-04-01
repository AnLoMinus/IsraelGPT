import React, { useEffect, useState } from "react";
import { listMarkdownFiles, readMarkdownFile } from "../services/markdownService";
import { MarkdownViewer } from "./MarkdownViewer";
import { motion, AnimatePresence } from "motion/react";
import { X, BookOpen, ChevronLeft, FileText, Loader2 } from "lucide-react";

interface TorahLearningPageProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const TorahLearningPage: React.FC<TorahLearningPageProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const fileList = await listMarkdownFiles();
        setFiles(fileList);
      } catch (error) {
        console.error("Error fetching files:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, [isOpen]);

  const handleFileSelect = async (filename: string) => {
    setLoading(true);
    try {
      const fileContent = await readMarkdownFile(filename);
      setContent(fileContent);
      setSelectedFile(filename);
    } catch (error) {
      console.error("Error reading file:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-5xl h-[90vh] backdrop-blur-2xl border rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col z-10 ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-blue-200/80'}`}
          dir="rtl"
        >
          <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-blue-100/50 bg-white/50'}`}>
            <div className="flex items-center gap-3">
              {selectedFile ? (
                <button 
                  onClick={() => setSelectedFile(null)}
                  className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <div className={`p-2 rounded-xl ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                  <BookOpen className="w-6 h-6" />
                </div>
              )}
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                {selectedFile ? selectedFile.replace('.md', '') : 'תורה אורה והוראה'}
              </h2>
            </div>
            <button onClick={onClose} className={`p-2 rounded-xl transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-blue-50 text-blue-500'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : selectedFile ? (
              <MarkdownViewer content={content} isDarkMode={isDarkMode} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file) => (
                  <motion.button
                    key={file}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFileSelect(file)}
                    className={`p-6 rounded-2xl border text-right transition-all flex flex-col gap-3 group ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800' 
                        : 'bg-white border-blue-100 hover:border-blue-300 hover:shadow-lg'
                    }`}
                  >
                    <div className={`p-3 rounded-xl w-fit ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                      <FileText className="w-6 h-6" />
                    </div>
                    <span className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-blue-900'}`}>
                      {file.replace('.md', '')}
                    </span>
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
