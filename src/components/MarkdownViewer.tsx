import React from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "motion/react";

interface MarkdownViewerProps {
  content: string;
  title?: string;
  isDarkMode: boolean;
}

export const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ content, title, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-8 shadow-xl border max-w-4xl mx-auto my-8 rtl ${
        isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-200' : 'bg-white/80 border-blue-100 text-slate-800'
      }`}
      dir="rtl"
    >
      {title && (
        <h1 className={`text-3xl font-bold mb-8 border-b pb-4 text-center ${isDarkMode ? 'text-white border-slate-700' : 'text-blue-900 border-blue-100'}`}>
          {title}
        </h1>
      )}
      <div className={`markdown-body ${isDarkMode ? 'prose-invert' : ''} max-w-none text-right`}>
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </motion.div>
  );
};
