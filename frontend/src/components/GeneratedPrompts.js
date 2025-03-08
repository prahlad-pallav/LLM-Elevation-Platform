import React from 'react'

const GeneratedPrompts = ({ questions }) => {
  return (
    <>
    <h3>Generated Prompts</h3>
      <ul>
        {questions.slice(0, 10).map((question, index) => (
          <li key={index}>Prompt {index + 1}: {question}</li>
        ))}
      </ul>
    </>
  )
}

export default GeneratedPrompts