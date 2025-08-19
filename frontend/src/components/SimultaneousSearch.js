import React, { useState, useContext } from "react";
import { DataContext } from "../context/DataContext";
import InputField from "./InputField";
import AudioInput from "./AudioInput";
// import ImageUpload from "./ImageUpload";
import SuggestedPrompts from "./SuggestedPrompts";
import WordLimitSelector from "./WordLimitSelector";

const SimultaneousSearch = () => {
  const { userInput, setUserInput } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [results, setResults] = useState(null);
  const [maxWords, setMaxWords] = useState(300); // Default 300 words for consistency with compare mode

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError(null);
  };

  // const handleImageUpload = (imageFile) => {
  //   setUploadedImage(imageFile);
  // };

  const handleSimultaneousSearch = async () => {
    if (!userInput.trim()) {
      setError("Please enter a prompt to search");
      return;
    }
    setError(null);
    setLoading(true);
    setResults(null);

    try {
      // Send requests to all models simultaneously
      const promises = [
        fetch("http://localhost:8000/evaluation/run/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput, model: "gemini", max_words: maxWords }),
        }),
        fetch("http://localhost:8000/evaluation/run/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput, model: "gpt-oss", max_words: maxWords }),
        }),
        fetch("http://localhost:8000/evaluation/run/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: userInput, model: "deepseek", max_words: maxWords }),
        }),
      ];

      const responses = await Promise.allSettled(promises);
      
      const modelResults = {
        gemini: { status: 'pending', response: '', error: '' },
        gptOss: { status: 'pending', response: '', error: '' },
        deepseek: { status: 'pending', response: '', error: '' },
      };

      // Process each response
      responses.forEach((result, index) => {
        const modelNames = ['gemini', 'gptOss', 'deepseek'];
        const modelName = modelNames[index];

        if (result.status === 'fulfilled') {
          const response = result.value;
          if (response.ok) {
            response.json().then(data => {
              let responseText = '';
              
              // Parse response based on model
              if (modelName === 'gemini') {
                responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(data);
              } else if (['gptOss', 'deepseek'].includes(modelName)) {
                responseText = data.choices?.[0]?.message?.content || JSON.stringify(data);
              }
              
              setResults(prev => ({
                ...prev,
                [modelName]: { status: 'success', response: responseText, error: '' }
              }));
            }).catch(err => {
              setResults(prev => ({
                ...prev,
                [modelName]: { status: 'error', response: '', error: err.message }
              }));
            });
          } else {
            setResults(prev => ({
              ...prev,
              [modelName]: { status: 'error', response: '', error: `HTTP ${response.status}` }
            }));
          }
        } else {
          setResults(prev => ({
            ...prev,
            [modelName]: { status: 'error', response: '', error: result.reason?.message || 'Request failed' }
          }));
        }
      });

    } catch (error) {
      console.error("Simultaneous search failed:", error);
      setError("Failed to perform simultaneous search. Please try again.");
    }
    setLoading(false);
  };

  const getModelDisplayName = (modelName) => {
    const names = {
      gemini: 'Gemini 2.0 Flash',
      gptOss: 'GPT-OSS 20B',
      deepseek: 'DeepSeek V3 685B'
    };
    return names[modelName] || modelName;
  };

  const getModelColor = (modelName) => {
    const colors = {
      gemini: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
      gptOss: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20',
      deepseek: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
    };
    return colors[modelName] || 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 dark:text-green-400';
      case 'error': return 'text-red-600 dark:text-red-400';
      case 'pending': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Multi-Model Compare
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Send the same prompt to all AI models simultaneously and compare their responses in real-time. Get instant insights from Gemini, GPT-OSS, and DeepSeek V3 all at once.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 transform -translate-y-2 transition-all duration-500">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error</h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="space-y-6">
            <div className="flex items-end gap-2">
              <div className="flex-grow space-y-2">
                <SuggestedPrompts onSelectPrompt={setUserInput} />
                                      <InputField
                        label="Enter Your Prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your question for all models..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                      <WordLimitSelector 
                        value={maxWords} 
                        onChange={setMaxWords} 
                        disabled={loading} 
                      />
              </div>
                              {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
              <AudioInput
                onTranscript={(text) => setUserInput(text)}
                disabled={loading}
              />
            </div>
            <button 
              onClick={handleSimultaneousSearch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching All Models...
                </div>
              ) : "Compare All Models"}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform transition-all duration-500">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Comparison Results</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.entries(results).map(([modelName, result]) => (
                <div
                  key={modelName}
                  className={`border-2 rounded-xl p-4 ${getModelColor(modelName)}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {getModelDisplayName(modelName)}
                    </h3>
                    <span className={`text-sm font-medium ${getStatusColor(result.status)}`}>
                      {result.status === 'success' && '✓ Success'}
                      {result.status === 'error' && '✗ Error'}
                      {result.status === 'pending' && '⏳ Pending'}
                    </span>
                  </div>
                  
                  {result.status === 'success' && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-sm leading-relaxed">
                        {result.response}
                      </p>
                    </div>
                  )}
                  
                  {result.status === 'error' && (
                    <div className="text-red-600 dark:text-red-400 text-sm">
                      Error: {result.error}
                    </div>
                  )}
                  
                  {result.status === 'pending' && (
                    <div className="flex items-center justify-center py-8">
                      <svg className="animate-spin h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimultaneousSearch;
