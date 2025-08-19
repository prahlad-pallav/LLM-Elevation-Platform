import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { evaluatePrompt } from "../api/evaluationService";
import InputField from "./InputField";

const DatasetTable = () => {
  const { userInput, setUserInput, results, setResults } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('compare'); // 'compare' or 'chat'
  const [chatHistory, setChatHistory] = useState([]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResults([]);
    setChatHistory([]);
    setError(null);
    setUserInput('');
  };

  const handleChat = async () => {
    if (!userInput.trim()) {
      setError("Please enter a message");
      return;
    }
    setError(null);

    setLoading(true);
    try {
      // Add user message to chat history immediately
      const userMessage = { role: 'user', content: userInput };
      setChatHistory(prev => [...prev, userMessage]);
      
      // Get response from Gemini
      const geminiResponse = await evaluatePrompt(userInput, "gemini");
      const geminiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(geminiResponse.data);
      
      // Add Gemini's response to chat history
      const assistantMessage = { role: 'assistant', content: geminiText };
      setChatHistory(prev => [...prev, assistantMessage]);

      // Clear input after successful chat
      setUserInput("");
    } catch (error) {
      console.error("Chat failed:", error);
      let errorMessage = "Failed to send message. Please try again.";
      
      if (error.response?.data?.error) {
        try {
          const errorData = JSON.parse(error.response.data.error);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          errorMessage = error.response.data.error;
        }
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleEvaluation = async () => {
    if (!userInput.trim()) {
      setError("Please enter some text to evaluate");
      return;
    }
    setError(null);

    setLoading(true);
      try {
      // Get responses from both models
      const groqResponse = await evaluatePrompt(userInput, "groq");
      const geminiResponse = await evaluatePrompt(userInput, "gemini");
  
        const groqText = groqResponse.data.choices?.[0]?.message?.content || JSON.stringify(groqResponse.data);
        const geminiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(geminiResponse.data);
  
      // Update UI with model responses
      setResults((prevResults) => [...prevResults, { 
        prompt: userInput, 
        groq: groqText, 
        gemini: geminiText, 
        judgment: "Evaluating..." 
      }]);

      // Get judgment
      let judgmentData;
      try {
        const judgmentResponse = await fetch("http://localhost:8000/evaluation/judge/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: userInput, 
            groq_response: groqText, 
            gemini_response: geminiText 
          }),
        });
  
        if (!judgmentResponse.ok) {
          throw new Error(`HTTP error! Status: ${judgmentResponse.status}`);
        }
  
        const responseText = await judgmentResponse.text();
          judgmentData = JSON.parse(responseText);
      } catch (error) {
        console.error("Judgment API Error:", error);
        judgmentData = { error: "Failed to get judgment" };
      }
  
      // Update UI with judgment
      setResults((prevResults) =>
        prevResults.map((res, index) =>
          index === prevResults.length - 1 ? { ...res, judgment: judgmentData } : res
        )
      );

      // Clear input after successful evaluation
      setUserInput("");
    } catch (error) {
      console.error("Evaluation failed:", error);
      let errorMessage = "Evaluation failed. Please try again.";
      
      if (error.response?.data?.error) {
        try {
          const errorData = JSON.parse(error.response.data.error);
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (e) {
          errorMessage = error.response.data.error;
        }
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 transform -translate-y-2 transition-all duration-500">
            <div className="bg-white rounded-lg shadow-lg border-l-4 border-red-500 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selector */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handleModeChange('compare')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === 'compare'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Compare Models
            </button>
            <button
              onClick={() => handleModeChange('chat')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                mode === 'chat'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Chat with Gemini
            </button>
          </div>

          <div className="space-y-6">
            {mode === 'chat' ? (
              <>
                <div className="space-y-4 mb-6">
                  {chatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <InputField
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your message here..."
                    name="userInput"
                    className="text-lg"
                  />
                  <button 
                    onClick={handleChat}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : "Send Message"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Compare AI Models</h2>
                <div className="space-y-6">
                  <InputField
                    label="Enter your prompt"
                    value={userInput}
                    onChange={handleInputChange}
                    placeholder="Type your question or prompt here..."
                    name="userInput"
                    className="text-lg"
                  />
                  <button 
                    onClick={handleEvaluation} 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Evaluating...
                      </div>
                    ) : "Compare Models"}
      </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results Section */}
      {results.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 transform transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Evaluation Results</h3>
            <div className="overflow-x-auto">
              {results.map((res, index) => (
                <div key={index} className="mb-8 last:mb-0 bg-gray-50 rounded-xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Prompt */}
                    <div className="col-span-full bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Prompt</h4>
                      <p className="text-gray-800">{res.prompt}</p>
                    </div>
                    
                    {/* Groq Response */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Groq Response</h4>
                      <div className="prose max-w-none">
                        <p className="text-gray-800 whitespace-pre-wrap">{res.groq}</p>
                      </div>
                    </div>

                    {/* Gemini Response */}
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">Gemini Response</h4>
                      <div className="prose max-w-none">
                        <p className="text-gray-800 whitespace-pre-wrap">{res.gemini}</p>
                      </div>
                    </div>

                    {/* Judgment */}
                    <div className="col-span-full bg-white rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">AI Judge Evaluation</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {typeof res.judgment === "object" && res.judgment.groq && res.judgment.gemini ? (
                          <>
                            <div className="p-4 rounded-lg bg-blue-50">
                              <h5 className="font-semibold text-blue-800 mb-2">Groq Scores</h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-blue-600">Correctness:</span>
                                  <span className="float-right font-medium text-blue-800">{res.judgment.groq.correctness}/10</span>
                                </div>
                                <div>
                                  <span className="text-sm text-blue-600">Faithfulness:</span>
                                  <span className="float-right font-medium text-blue-800">{res.judgment.groq.faithfulness}/10</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-50">
                              <h5 className="font-semibold text-purple-800 mb-2">Gemini Scores</h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-purple-600">Correctness:</span>
                                  <span className="float-right font-medium text-purple-800">{res.judgment.gemini.correctness}/10</span>
                                </div>
                                <div>
                                  <span className="text-sm text-purple-600">Faithfulness:</span>
                                  <span className="float-right font-medium text-purple-800">{res.judgment.gemini.faithfulness}/10</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-2 text-gray-600">
                            {typeof res.judgment === "object" ? JSON.stringify(res.judgment, null, 2) : res.judgment}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default DatasetTable;
