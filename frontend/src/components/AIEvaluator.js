import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { evaluatePrompt } from "../api/evaluationService";
import InputField from "./InputField";
import AudioInput from "./AudioInput";
import Tooltip from "./Tooltip";
import SuggestedPrompts from "./SuggestedPrompts";
import { API_ENDPOINTS } from "../config/api";
// import ImageUpload from "./ImageUpload";

const AIEvaluator = () => {
  const { userInput, setUserInput, results, setResults } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mode, setMode] = useState('compare'); // 'compare', 'chat', 'llama3-chat', 'gpt-oss-chat', or 'deepseek-chat'
  const [chatHistory, setChatHistory] = useState([]);
  const [llama3ChatHistory, setLlama3ChatHistory] = useState([]);
  const [gptOssChatHistory, setGptOssChatHistory] = useState([]);
  const [deepseekChatHistory, setDeepseekChatHistory] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [maxWords, setMaxWords] = useState(300); // Default 300 words for consistency with compare mode

  // const handleImageUpload = (imageFile) => {
  //   setUploadedImage(imageFile);
  // };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
    setError(null); // Clear any previous errors
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setResults([]);
    setChatHistory([]);
    setLlama3ChatHistory([]);
    setGptOssChatHistory([]);
    setDeepseekChatHistory([]);
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

  const handleLlama3Chat = async () => {
    if (!userInput.trim()) {
      setError("Please enter a message");
      return;
    }
    setError(null);

    setLoading(true);
    try {
      // Add user message to chat history immediately
      const userMessage = { role: 'user', content: userInput };
      setLlama3ChatHistory(prev => [...prev, userMessage]);
      
      // Get response from Llama3
      const llama3Response = await fetch(API_ENDPOINTS.CHAT_LLAMA3, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!llama3Response.ok) {
        throw new Error(`HTTP error! Status: ${llama3Response.status}`);
      }

      const responseData = await llama3Response.json();
      const llama3Text = responseData.response || JSON.stringify(responseData);
      
      // Add Llama3's response to chat history
      const assistantMessage = { role: 'assistant', content: llama3Text };
      setLlama3ChatHistory(prev => [...prev, assistantMessage]);

      // Clear input after successful chat
      setUserInput("");
    } catch (error) {
      console.error("Llama3 Chat failed:", error);
      let errorMessage = "Failed to send message to Llama3. Please try again.";
      
      try {
        // Try to get the response data for better error messages
        if (error.message && error.message.includes("HTTP error")) {
          // This is a fetch error, try to get more details
          const responseText = await error.response?.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (e) {
              errorMessage = responseText;
            }
          } else {
            errorMessage = error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        console.error("Error parsing error message:", e);
        errorMessage = "Failed to send message to Llama3. Please try again.";
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleGptOssChat = async () => {
    if (!userInput.trim()) {
      setError("Please enter a message");
      return;
    }
    setError(null);

    setLoading(true);
    try {
      // Add user message to chat history immediately
      const userMessage = { role: 'user', content: userInput };
      setGptOssChatHistory(prev => [...prev, userMessage]);
      
      // Get response from GPT-OSS
      const gptOssResponse = await fetch(API_ENDPOINTS.CHAT_GPT_OSS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!gptOssResponse.ok) {
        throw new Error(`HTTP error! Status: ${gptOssResponse.status}`);
      }

      const responseData = await gptOssResponse.json();
      const gptOssText = responseData.response || JSON.stringify(responseData);
      
      // Add GPT-OSS's response to chat history
      const assistantMessage = { role: 'assistant', content: gptOssText };
      setGptOssChatHistory(prev => [...prev, assistantMessage]);

      // Clear input after successful chat
      setUserInput("");
    } catch (error) {
      console.error("GPT-OSS Chat failed:", error);
      let errorMessage = "Failed to send message to GPT-OSS. Please try again.";
      
      try {
        // Try to get the response data for better error messages
        if (error.message && error.message.includes("HTTP error")) {
          // This is a fetch error, try to get more details
          const responseText = await error.response?.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (e) {
              errorMessage = responseText;
            }
          } else {
            errorMessage = error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        console.error("Error parsing error message:", e);
        errorMessage = "Failed to send message to GPT-OSS. Please try again.";
      }
      
      setError(errorMessage);
    }
    setLoading(false);
  };

  const handleDeepseekChat = async () => {
    if (!userInput.trim()) {
      setError("Please enter a message");
      return;
    }
    setError(null);

    setLoading(true);
    try {
      // Add user message to chat history immediately
      const userMessage = { role: 'user', content: userInput };
      setDeepseekChatHistory(prev => [...prev, userMessage]);
      
      // Get response from DeepSeek
      const deepseekResponse = await fetch(API_ENDPOINTS.CHAT_DEEPSEEK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

      if (!deepseekResponse.ok) {
        throw new Error(`HTTP error! Status: ${deepseekResponse.status}`);
      }

      const responseData = await deepseekResponse.json();
      const deepseekText = responseData.response || JSON.stringify(responseData);
      
      // Add DeepSeek's response to chat history
      const assistantMessage = { role: 'assistant', content: deepseekText };
      setDeepseekChatHistory(prev => [...prev, assistantMessage]);

      // Clear input after successful chat
      setUserInput("");
    } catch (error) {
      console.error("DeepSeek Chat failed:", error);
      let errorMessage = "Failed to send message to DeepSeek. Please try again.";
      
      try {
        // Try to get the response data for better error messages
        if (error.message && error.message.includes("HTTP error")) {
          // This is a fetch error, try to get more details
          const responseText = await error.response?.text();
          if (responseText) {
            try {
              const errorData = JSON.parse(responseText);
              if (errorData.error) {
                errorMessage = errorData.error;
              }
            } catch (e) {
              errorMessage = responseText;
            }
          } else {
            errorMessage = error.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }
      } catch (e) {
        console.error("Error parsing error message:", e);
        errorMessage = "Failed to send message to DeepSeek. Please try again.";
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
      // Get responses from all models with 300 word limit for compare mode
      const [geminiResponse, gptOssResponse, deepseekResponse] = await Promise.all([
        evaluatePrompt(userInput, "gemini", 300),
        evaluatePrompt(userInput, "gpt-oss", 300),
        evaluatePrompt(userInput, "deepseek", 300)
      ]);

      const geminiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(geminiResponse.data);
      const gptOssText = gptOssResponse.data.choices?.[0]?.message?.content || JSON.stringify(gptOssResponse.data);
      const deepseekText = deepseekResponse.data.choices?.[0]?.message?.content || JSON.stringify(deepseekResponse.data);

      // Update UI with model responses
      setResults((prevResults) => [...prevResults, { 
        prompt: userInput, 
        gemini: geminiText, 
        gptOss: gptOssText, 
        deepseek: deepseekText, 
        judgment: "Evaluating..." 
      }]);

      // Get judgment
      let judgmentData;
      try {
        const judgmentResponse = await fetch(API_ENDPOINTS.JUDGE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: userInput, 
            gemini_response: geminiText,
            gpt_oss_response: gptOssText,
            deepseek_response: deepseekText
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
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Mode Selector */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-6">
            <Tooltip 
              content="Compare responses from multiple AI models and see which performs better"
              position="bottom"
            >
              <button
                onClick={() => handleModeChange('compare')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'compare'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Compare Models
              </button>
            </Tooltip>
            <Tooltip 
              content="Have a direct conversation with Gemini AI"
              position="bottom"
            >
              <button
                onClick={() => handleModeChange('chat')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'chat'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chat with Gemini
              </button>
            </Tooltip>
            <Tooltip 
              content="Have a direct conversation with Llama 3.3 70B AI"
              position="bottom"
            >
              <button
                onClick={() => handleModeChange('llama3-chat')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'llama3-chat'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chat with Llama 3.3
              </button>
            </Tooltip>
            <Tooltip 
              content="Have a direct conversation with OpenAI's GPT-OSS 20B AI"
              position="bottom"
            >
              <button
                onClick={() => handleModeChange('gpt-oss-chat')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'gpt-oss-chat'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chat with GPT-OSS
              </button>
            </Tooltip>
            <Tooltip 
              content="Have a direct conversation with DeepSeek V3 685B AI"
              position="bottom"
            >
              <button
                onClick={() => handleModeChange('deepseek-chat')}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  mode === 'deepseek-chat'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Chat with DeepSeek
              </button>
            </Tooltip>
          </div>

          <div className="space-y-6">
            {mode === 'chat' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Chat with Gemini 2.0 Flash</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-start">
                  Have a direct conversation with Google's latest multimodal AI model. Gemini 2.0 Flash excels at creative text generation, advanced reasoning, and understanding complex queries with remarkable accuracy.
                </p>
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
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <SuggestedPrompts onSelectPrompt={setUserInput} />
                      <InputField
                        label="Enter Your Prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your message to Gemini..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                    {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
                    <AudioInput
                      onTranscript={(text) => setUserInput(text)}
                      disabled={loading}
                    />
                  </div>
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
            ) : mode === 'llama3-chat' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Chat with Llama 3.3 70B</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-start">
                  Engage in conversations with Meta's largest open-weight language model. Llama 3.3 70B features multilingual capabilities, advanced reasoning, and state-of-the-art performance across various tasks with 70 billion parameters.
                </p>
                <div className="space-y-4 mb-6">
                  {llama3ChatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <SuggestedPrompts onSelectPrompt={setUserInput} />
                      <InputField
                        label="Enter Your Prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your message to Llama 3.3..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                    {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
                    <AudioInput
                      onTranscript={(text) => setUserInput(text)}
                      disabled={loading}
                    />
                  </div>
                  <button 
                    onClick={handleLlama3Chat}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-green-600 hover:to-green-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending to Llama 3.3...
                      </div>
                    ) : "Send to Llama 3.3"}
                  </button>
                </div>
              </>
            ) : mode === 'gpt-oss-chat' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Chat with GPT-OSS 20B</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-start">
                  Experience OpenAI's open-weight 21B parameter model with Mixture-of-Experts architecture. GPT-OSS features a massive 131K context window, function calling capabilities, and is optimized for consumer hardware deployment.
                </p>
                <div className="space-y-4 mb-6">
                  {gptOssChatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <SuggestedPrompts onSelectPrompt={setUserInput} />
                      <InputField
                        label="Enter Your Prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your message to GPT-OSS..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                    {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
                    <AudioInput
                      onTranscript={(text) => setUserInput(text)}
                      disabled={loading}
                    />
                  </div>
                  <button 
                    onClick={handleGptOssChat}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-purple-600 hover:to-purple-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending to GPT-OSS...
                      </div>
                    ) : "Send to GPT-OSS"}
                  </button>
                </div>
              </>
            ) : mode === 'deepseek-chat' ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Chat with DeepSeek V3 685B</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-start">
                  Interact with DeepSeek's flagship 685B-parameter mixture-of-experts model. DeepSeek V3 features a massive 163K context window, advanced reasoning capabilities, multilingual support, and state-of-the-art performance across diverse tasks.
                </p>
                <div className="space-y-4 mb-6">
                  {deepseekChatHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.role === 'user'
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <SuggestedPrompts onSelectPrompt={setUserInput} />
                      <InputField
                        label="Enter Your Prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your message to DeepSeek V3..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                    {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
                    <AudioInput
                      onTranscript={(text) => setUserInput(text)}
                      disabled={loading}
                    />
                  </div>
                  <button 
                    onClick={handleDeepseekChat}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-xl font-medium text-lg shadow-md hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending to DeepSeek...
                      </div>
                    ) : "Send to DeepSeek"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Compare AI Models Side-by-Side</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-start">
                  Test multiple AI models simultaneously to see how they perform on the same prompt. Get concise responses (max 300 words) from Gemini, GPT-OSS, and DeepSeek V3, then see which one provides the best answer using Llama 3.3 as the AI judge.
                </p>
                <div className="space-y-6">
                  <div className="flex items-end gap-2">
                    <div className="flex-grow space-y-2">
                      <SuggestedPrompts onSelectPrompt={setUserInput} />
                      <InputField
                        label="Enter your prompt"
                        value={userInput}
                        onChange={handleInputChange}
                        placeholder="Type or speak your question..."
                        name="userInput"
                        className="text-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                      />
                    </div>
                    {/* <ImageUpload onImageUpload={handleImageUpload} disabled={loading} /> */}
                    <div className="mb-2">
                      <AudioInput
                        onTranscript={(text) => setUserInput(text)}
                        disabled={loading}
                      />
                    </div>
                  </div>
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 transform transition-all duration-500">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Evaluation Results</h3>
            <div className="overflow-x-auto">
              {results.map((res, index) => (
                <div key={index} className="mb-8 last:mb-0 bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Prompt */}
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Prompt</h4>
                      <p className="text-gray-800 dark:text-gray-200">{res.prompt}</p>
                    </div>
                    
                    {/* Gemini Response */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Gemini Response</h4>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{res.gemini}</p>
                      </div>
                    </div>

                    {/* GPT-OSS Response */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">GPT-OSS Response</h4>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{res.gptOss}</p>
                      </div>
                    </div>

                    {/* DeepSeek Response */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">DeepSeek Response</h4>
                      <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{res.deepseek}</p>
                      </div>
                    </div>

                    {/* Judgment */}
                    <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">AI Judge Evaluation</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {typeof res.judgment === "object" && res.judgment.gemini && res.judgment.gpt_oss && res.judgment.deepseek ? (
                          <>
                            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900">
                              <h5 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Gemini Scores</h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-purple-600 dark:text-purple-300">Correctness:</span>
                                  <span className="float-right font-medium text-purple-800 dark:text-purple-200">{res.judgment.gemini.correctness}/10</span>
                                </div>
                                <div>
                                  <span className="text-sm text-purple-600 dark:text-purple-300">Faithfulness:</span>
                                  <span className="float-right font-medium text-purple-800 dark:text-purple-200">{res.judgment.gemini.faithfulness}/10</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900">
                              <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">GPT-OSS Scores</h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-indigo-600 dark:text-indigo-300">Correctness:</span>
                                  <span className="float-right font-medium text-indigo-800 dark:text-indigo-200">{res.judgment.gpt_oss.correctness}/10</span>
                                </div>
                                <div>
                                  <span className="text-sm text-indigo-600 dark:text-indigo-300">Faithfulness:</span>
                                  <span className="float-right font-medium text-indigo-800 dark:text-indigo-200">{res.judgment.gpt_oss.faithfulness}/10</span>
                                </div>
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900">
                              <h5 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">DeepSeek Scores</h5>
                              <div className="space-y-2">
                                <div>
                                  <span className="text-sm text-orange-600 dark:text-orange-300">Correctness:</span>
                                  <span className="float-right font-medium text-orange-800 dark:text-orange-200">{res.judgment.deepseek.correctness}/10</span>
                                </div>
                                <div>
                                  <span className="text-sm text-orange-600 dark:text-orange-300">Faithfulness:</span>
                                  <span className="float-right font-medium text-orange-800 dark:text-orange-200">{res.judgment.deepseek.faithfulness}/10</span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="col-span-3 text-gray-600 dark:text-gray-300">
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

export default AIEvaluator;
