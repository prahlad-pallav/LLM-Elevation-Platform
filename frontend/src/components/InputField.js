import React from 'react';

const InputField = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  name,
  error,
  required = false,
  className = ''
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label 
          htmlFor={name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 
          border border-gray-300 
          border border-gray-300 dark:border-gray-600
          rounded-md shadow-sm 
          focus:outline-none 
          focus:ring-2 
          focus:ring-blue-500 
          focus:border-blue-500
          bg-white dark:bg-gray-700
          text-gray-900 dark:text-gray-100
          placeholder-gray-500 dark:placeholder-gray-400
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
};

export default InputField;
