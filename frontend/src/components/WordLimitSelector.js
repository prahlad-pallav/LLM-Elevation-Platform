import React from 'react';

const WordLimitSelector = ({ value, onChange, disabled = false }) => {
  return (
    <div className="flex items-center gap-4">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Max Response Length:
      </label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value={100}>100 words (Short)</option>
        <option value={250}>250 words (Brief)</option>
        <option value={300}>300 words (Concise)</option>
        <option value={500}>500 words (Medium)</option>
        <option value={750}>750 words (Detailed)</option>
        <option value={1000}>1000 words (Comprehensive)</option>
        <option value={1500}>1500 words (Extensive)</option>
        <option value={2000}>2000 words (Very Long)</option>
      </select>
    </div>
  );
};

export default WordLimitSelector;
