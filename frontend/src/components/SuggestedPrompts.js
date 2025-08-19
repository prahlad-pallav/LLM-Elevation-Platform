import React, { useState, useRef, useEffect } from 'react';
import Tooltip from './Tooltip';

const getCategoryTooltip = (category) => {
  const tooltips = {
    writing: "Writing tasks like blog posts, emails, and articles",
    analysis: "Analytical tasks and in-depth explanations",
    technical: "Technical explanations and documentation",
    creative: "Creative writing and brainstorming",
    problemSolving: "Solutions to real-world problems"
  };
  return tooltips[category];
};

const promptCategories = {
  writing: [
    "Write a blog post about artificial intelligence in healthcare",
    "Create a compelling product description for a smart home device",
    "Write a creative story about time travel",
    "Draft a professional email requesting a business partnership",
    "Write a persuasive argument about renewable energy"
  ],
  analysis: [
    "Analyze the main themes in Shakespeare's Macbeth",
    "Compare and contrast democracy and autocracy",
    "Explain the impact of social media on modern society",
    "Analyze the causes and effects of climate change",
    "Evaluate the pros and cons of remote work"
  ],
  technical: [
    "Explain how blockchain technology works",
    "Describe the process of machine learning in simple terms",
    "Write a tutorial on creating a REST API",
    "Explain the concept of quantum computing",
    "Describe how neural networks function"
  ],
  creative: [
    "Generate a unique superhero concept",
    "Create a recipe for a fusion dish",
    "Design a concept for a sci-fi movie plot",
    "Write a short poem about nature",
    "Create a character description for a fantasy novel"
  ],
  problemSolving: [
    "How would you solve urban traffic congestion?",
    "Propose a solution to reduce plastic waste",
    "How can we improve online education?",
    "Suggest ways to increase renewable energy adoption",
    "How can we make cities more sustainable?"
  ]
};

const SuggestedPrompts = ({ onSelectPrompt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('writing');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePromptSelect = (prompt) => {
    onSelectPrompt(prompt);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Tooltip
        content="Browse and select from pre-written prompts"
        position="right"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 px-4 py-2 text-left text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Suggested Prompts
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </Tooltip>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
          {/* Category Selector */}
          <div className="flex border-b border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-700">
            {Object.keys(promptCategories).map((category) => (
              <Tooltip
                key={category}
                content={getCategoryTooltip(category)}
                position="top"
              >
                <button
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 rounded-md text-sm whitespace-nowrap transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              </Tooltip>
            ))}
          </div>

          {/* Prompts List */}
          <div className="max-h-64 overflow-y-auto p-2">
            {promptCategories[selectedCategory].map((prompt, index) => (
              <button
                key={index}
                onClick={() => handlePromptSelect(prompt)}
                className="w-full text-left p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 transition-all duration-200"
              >
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{prompt}</p>
              </button>
            ))}
          </div>

          {/* Pro Tip */}
          <div className="border-t border-gray-100 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>Click any prompt to use it instantly</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuggestedPrompts;
