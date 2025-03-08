import React, { useContext, useState } from "react";
import DatasetUploader from "./DatasetUploader";
import PromptEditor from "./PromptEditor";
import EvaluationTable from "./EvaluationTable";
import { evaluatePrompt } from "../api/evaluationService";
import { DataContext } from "../context/DataContext";
import DatasetManager from "./DatasetManager";
import DatasetTable from "./DatasetTable";

const Dashboard = () => {
  const { results, setResults } = useContext(DataContext);
  const [selectedModel, setSelectedModel] = useState("groq");

  const handleEvaluation = async (prompt) => {
    try {
      const response = await evaluatePrompt(prompt, selectedModel);
      console.log("API Response:", response.data); // Debugging
  
      let responseText = "Invalid response format";

      if (selectedModel === "groq") {
        // Extract Groq's response
        if (response.data.choices && response.data.choices.length > 0) {
          responseText = response.data.choices[0].message.content;
        }
      } else if (selectedModel === "gemini") {
        // Extract Gemini's response
        if (
          response.data.candidates &&
          response.data.candidates.length > 0 &&
          response.data.candidates[0].content.parts &&
          response.data.candidates[0].content.parts.length > 0
        ) {
          responseText = response.data.candidates[0].content.parts[0].text;
        }
      }
  
      // if (response.data.choices && response.data.choices.length > 0) {
      //   responseText = response.data.choices[0].message.content; // Extracting actual text
      // } else {
      //   responseText = JSON.stringify(response.data, null, 2); // Fallback (stringify object)
      // }
  
      setResults([...results, { prompt, model: selectedModel, response: responseText }]);
    } catch (error) {
      alert("Evaluation failed!");
    }
  };
  

//   const handleEvaluation = async (prompt) => {
//     try {
//       const response = await evaluatePrompt(prompt, selectedModel);

//       console.log("API Response:", response.data); // Debugging
//       setResults([...results, { prompt, model: selectedModel, response: response.data }]);


//     } catch (error) {
//       alert("Evaluation failed!");
//     }
//   };

  return (
    <div>
      <h1>LLM Evaluation Platform</h1>
      <DatasetUploader />
      <DatasetTable />
      {/* <DatasetManager /> */}
      {/* <PromptEditor onSubmit={handleEvaluation} />
      <select onChange={(e) => setSelectedModel(e.target.value)}>
        <option value="groq">Groq</option>
        <option value="gemini">Gemini</option>
      </select>
      <EvaluationTable /> */}
    </div>
  );
};

export default Dashboard;
