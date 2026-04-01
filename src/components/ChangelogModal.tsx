import React, { useEffect, useState } from "react";
import { readMarkdownFile } from "../services/markdownService";
import { MarkdownViewer } from "./MarkdownViewer";
import { motion, AnimatePresence } from "motion/react";
import { X, History, ListTodo, Loader2 } from "lucide-react";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ChangelogModal: React.FC<ChangelogModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const [activeTab, setActiveTab] = useState<"changelog" | "todo">("changelog");
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchContent = async () => {
        setLoading(true);
        try {
          const data = await readMarkdownFile("", activeTab);
          setContent(data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching content:", error);
          setLoading(false);
        }
      };
      fetchContent();
    }
  }, [isOpen, activeTab]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rtl" dir="rtl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b flex items-center justify-between bg-indigo-50">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setActiveTab("changelog")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                    activeTab === "changelog" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  <History className="w-5 h-5" />
                  יומן אירועים
                </button>
                <button
                  onClick={() => setActiveTab("todo")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all ${
                    activeTab === "todo" ? "bg-indigo-600 text-white shadow-md" : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  <ListTodo className="w-5 h-5" />
                  רשימת משימות
                </button>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-indigo-100 rounded-full text-indigo-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {loading ? (
                <div className="flex items-center justify-center h-full p-20">
                  <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                </div>
              ) : (
                <MarkdownViewer content={content} isDarkMode={isDarkMode} />
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
