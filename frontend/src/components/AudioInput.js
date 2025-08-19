import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

const AudioInput = ({ onTranscript, disabled }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, [onTranscript]);

  const toggleListening = () => {
    if (!recognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (!('webkitSpeechRecognition' in window)) {
    return null; // Don't render anything if speech recognition is not supported
  }

  return (
    <Tooltip 
      content={
        disabled ? 'Voice input not available while processing' :
        !recognition ? 'Voice input not supported in your browser' :
        isListening ? 'Click to stop recording' : 'Click to start voice input'
      }
    >
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`p-2 rounded-full transition-all duration-200 ${
          isListening 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isListening ? (
          // Recording icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
        ) : (
          // Microphone icon
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        )}
      </button>
    </Tooltip>
  );
};

export default AudioInput;
