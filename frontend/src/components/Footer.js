import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
            <span className="text-sm">Made with</span>
            <svg 
              className="w-5 h-5 text-red-500 animate-pulse" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-sm">© 2025 copyright all right reserved</span>
          </div>
          <div className="text-gray-800 dark:text-gray-200 font-medium">
            <span className="text-sm">Designed and Developed by </span>
            <span className="text-blue-600 dark:text-blue-400 font-semibold">Prahlad Pallav</span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            LLM Evaluation Platform
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
