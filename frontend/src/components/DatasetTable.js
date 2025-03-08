import React, { useContext, useState } from "react";
import { DataContext } from "../context/DataContext";
import { evaluatePrompt } from "../api/evaluationService";
import GeneratedPrompts from "./GeneratedPrompts";

const DatasetTable = () => {
  const { dataset, results, setResults } = useContext(DataContext);
  const [loading, setLoading] = useState(false);

  if (dataset.rows.length === 0) return <p>No dataset uploaded.</p>;

  const questionIndex = dataset.columns.indexOf("question");
  const questions = questionIndex !== -1 ? dataset.rows.map((row) => row[questionIndex]) : [];


  const handleEvaluation = async () => {
    setLoading(true);
  
    let evaluationResults = [];
  
    // Step 1: Fetch responses from both models first
    for (const prompt of questions.slice(0, 10)) {
      try {
        const groqResponse = await evaluatePrompt(prompt, "groq");
        const geminiResponse = await evaluatePrompt(prompt, "gemini");
  
        const groqText = groqResponse.data.choices?.[0]?.message?.content || JSON.stringify(groqResponse.data);
        const geminiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(geminiResponse.data);
  
        console.log("Groq Response:", groqText);
        console.log("Gemini Response:", geminiText);
  
        evaluationResults.push({ prompt, groq: groqText, gemini: geminiText });
  
        // Update UI with model responses (without judgment)
        setResults((prevResults) => [...prevResults, { prompt, groq: groqText, gemini: geminiText, judgment: "Evaluating..." }]);
  
      } catch (error) {
        console.error("Evaluation failed for prompt:", prompt);
      }
    }
  
    // Step 2: Once all responses are collected, call the judgment API
    for (const result of evaluationResults) {
      let judgmentData;
      try {
        const judgmentResponse = await fetch("http://localhost:8000/evaluation/judge/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            prompt: result.prompt, 
            groq_response: result.groq, 
            gemini_response: result.gemini 
          }),
        });
  
        if (!judgmentResponse.ok) {
          throw new Error(`HTTP error! Status: ${judgmentResponse.status}`);
        }
  
        const responseText = await judgmentResponse.text();
        try {
          judgmentData = JSON.parse(responseText);
        } catch (jsonError) {
          console.error("JSON Parse Error:", jsonError, "Response Text:", responseText);
          judgmentData = { error: "Invalid JSON response", rawResponse: responseText };
        }
  
      } catch (error) {
        console.error("API Request Failed:", error);
        judgmentData = { error: "Failed to fetch judgment response" };
      }
  
      console.log("Llama3 Judgment Response:", judgmentData);
  
      // Update UI with judgment
      setResults((prevResults) =>
        prevResults.map((res) =>
          res.prompt === result.prompt ? { ...res, judgment: judgmentData } : res
        )
      );
    }
  
    setLoading(false);
  };
  

  // const handleEvaluation = async () => {
  //   setLoading(true);
    
  //   for (const prompt of questions.slice(0, 10)) {
  //     try {
  //       const groqResponse = await evaluatePrompt(prompt, "groq");
  //       const geminiResponse = await evaluatePrompt(prompt, "gemini");

  //       const groqText = groqResponse.data.choices?.[0]?.message?.content || JSON.stringify(groqResponse.data);
  //       const geminiText = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || JSON.stringify(geminiResponse.data);

  //       console.log("Groq Response:", groqText);
  //       console.log("Gemini Response:", geminiText);

  //       // Update UI with model responses
  //       setResults((prevResults) => [...prevResults, { prompt, groq: groqText, gemini: geminiText, judgment: "Evaluating..." }]);

  //       // Call judgment API
  //       let judgmentData;

  //       try {
  //         const judgmentResponse = await fetch("http://localhost:8000/evaluation/judge/", {
  //           method: "POST",
  //           headers: { "Content-Type": "application/json" },
  //           body: JSON.stringify({ prompt, groq_response: groqText, gemini_response: geminiText }),
  //         });

  //         console.log("Raw judgment response:", judgmentResponse);

  //         if (!judgmentResponse.ok) {
  //           throw new Error(`HTTP error! Status: ${judgmentResponse.status}`);
  //         }

  //         const responseText = await judgmentResponse.text();
          
  //         try {
  //           judgmentData = JSON.parse(responseText);
  //         } catch (jsonError) {
  //           console.error("JSON Parse Error:", jsonError, "Response Text:", responseText);
  //           judgmentData = { error: "Invalid JSON response", rawResponse: responseText };
  //         }

  //       } catch (error) {
  //         console.error("API Request Failed:", error);
  //         judgmentData = { error: "Failed to fetch judgment response" };
  //       }

  //       console.log("Llama3 Judgment Response:", judgmentData);


  //       // // Call judgment API
  //       // const judgmentResponse = await fetch("http://localhost:8000/evaluation/judge/", {
  //       //   method: "POST",
  //       //   headers: { "Content-Type": "application/json" },
  //       //   body: JSON.stringify({ prompt, groq_response: groqText, gemini_response: geminiText }),
  //       // });

  //       // console.log(judgmentResponse);
  //       // let judgmentData;
  //       // try {
  //       //   judgmentData = await judgmentResponse.json();
  //       // } catch (err) {
  //       //   console.error("JSON Parse Error:", err);
  //       //   judgmentData = { error: "Invalid JSON response" };
  //       // }

  //       // console.log("Llama3 Judgment Response:", judgmentData);

  //       // Update UI with judgment
  //       setResults((prevResults) =>
  //         prevResults.map((res) =>
  //           res.prompt === prompt ? { ...res, judgment: judgmentData } : res
  //         )
  //       );
  //     } catch (error) {
  //       console.error("Evaluation failed for prompt:", prompt);
  //     }
  //   }
    
  //   setLoading(false);
  // };

  return (
    <div>
      <h3>Dataset Preview</h3>
      <table border="1">
        <thead>
          <tr>
            {dataset.columns.map((col, index) => <th key={index}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {dataset.rows.slice(0, 10).map((row, index) => (
            <tr key={index}>
              {row.map((cell, i) => <td key={i}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>

      <GeneratedPrompts questions={questions.slice(0, 10)} />

      <button onClick={handleEvaluation} disabled={loading}>
        {loading ? "Evaluating..." : "Run Evaluation"}
      </button>


      {results.length > 0 && (
        <div>
          <h3>Evaluation Results</h3>
          <table border="1">
            <thead>
              <tr>
                <th>Prompt</th>
                <th>Groq Response</th>
                <th>Gemini Response</th>
                <th>Judgment</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res, index) => (
                <tr key={index}>
                  <td>{res.prompt}</td>
                  <td>{res.groq}</td>
                  <td>{res.gemini}</td>
                  <td>{typeof res.judgment === "object" ? JSON.stringify(res.judgment) : res.judgment}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};

export default DatasetTable;
