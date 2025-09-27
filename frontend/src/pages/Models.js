import React from "react";

const Models = () => {
  const models = [
    {
      name: "Gemini 2.0 Flash",
      description: "Google's latest multimodal AI model designed for understanding and generating text, images, and other content types. Features advanced reasoning capabilities and creative text generation.",
      features: [
        "Multimodal capabilities",
        "Advanced reasoning",
        "Creative text generation",
        "Google's latest technology"
      ],
      color: "purple",
      icon: "🌟"
    },
    {
      name: "Llama 3.3 70B",
      description: "Meta's largest open-weight language model with 70 billion parameters. Features multilingual capabilities, advanced reasoning, and state-of-the-art performance across various tasks.",
      features: [
        "70B parameters",
        "Multilingual support",
        "Advanced reasoning",
        "Open-weight model"
      ],
      color: "green",
      icon: "🦙"
    },
    {
      name: "GPT-OSS 20B",
      description: "OpenAI's open-weight 21B parameter model with Mixture-of-Experts (MoE) architecture. Features 131K context window, function calling capabilities, and optimized for consumer hardware.",
      features: [
        "21B parameters (MoE)",
        "131K context window",
        "Function calling support",
        "Apache 2.0 license"
      ],
      color: "indigo",
      icon: "🤖"
    },
    {
      name: "DeepSeek V3 685B",
      description: "DeepSeek's flagship 685B-parameter mixture-of-experts model with 163K context window. Features advanced reasoning capabilities, multilingual support, and state-of-the-art performance across various tasks.",
      features: [
        "685B parameters (MoE)",
        "163K context window",
        "Advanced reasoning",
        "Multilingual support"
      ],
      color: "orange",
      icon: "🔍"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
      green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
      orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
    };
    return colorMap[color] || colorMap.blue;
  };

  const getTextColor = (color) => {
    const colorMap = {
      blue: "text-blue-600 dark:text-blue-400",
      purple: "text-purple-600 dark:text-purple-400",
      green: "text-green-600 dark:text-green-400",
      indigo: "text-indigo-600 dark:text-indigo-400",
      orange: "text-orange-600 dark:text-orange-400"
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Available AI Models
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore the powerful AI models available in our evaluation platform. Each model offers unique capabilities and strengths for different types of tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {models.map((model, index) => (
          <div
            key={index}
            className={`${getColorClasses(model.color)} border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
          >
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-4">{model.icon}</span>
              <h2 className={`text-2xl font-bold ${getTextColor(model.color)}`}>
                {model.name}
              </h2>
            </div>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
              {model.description}
            </p>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-3">
                Key Features:
              </h3>
              <ul className="space-y-2">
                {model.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-600 dark:text-gray-300">
                    <svg className="w-4 h-4 mr-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Compare?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Test these models side-by-side to see which one performs best for your specific use case.
          </p>
          <a
            href="/evaluate"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 shadow-lg"
          >
            Start Evaluation
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Models;
