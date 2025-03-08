from fastapi import APIRouter
from fastapi import HTTPException
from pydantic import BaseModel
import requests
import json

router = APIRouter()

# Define available LLM APIs
LLM_APIS = {
    "groq": "https://api.groq.com/openai/v1/chat/completions",
    "gemini": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "llama3": "http://localhost:11434/api/generate"
}


API_KEYS = {
    "groq": "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",
    "gemini": "AIzaSyAiXSOFrYH0Bw9GaLKhDJjwY5hO4_3h9h8",
    "openai" : "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"
}


# Define a request model for expected input
class EvaluationRequest(BaseModel):
    prompt: str
    model: str


# Request model for judgment system
class JudgmentRequest(BaseModel):
    prompt: str
    groq_response: str
    gemini_response: str


@router.post("/run/")
async def evaluate(request: EvaluationRequest):
    if request.model not in LLM_APIS:
        raise HTTPException(status_code=400, detail="Invalid model name")

    url = LLM_APIS[request.model]

    if request.model == "groq":
        headers = {
            "Authorization": f"Bearer {API_KEYS['groq']}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "mixtral-8x7b-32768",
            "messages": [{"role": "user", "content": request.prompt}]
        }
    elif request.model == "gemini":
        url += f"?key={API_KEYS['gemini']}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": request.prompt}]}]
        }
    elif request.model == "llama3":
        headers = {"Content-Type": "application/json"}
        payload = {
            "model": "llama3",
            "prompt": request.prompt
        }

    response = requests.post(url, headers=headers, json=payload)

    # print("STATUS CODE:", response.status_code)  # Debugging
    # print("RESPONSE TEXT:", response.text)  # Debugging

    if response.status_code != 200:
        return {"error": response.text if response.text else "No response from API"}

    return response.json()





@router.post("/judge/")
async def automated_judgment(request: JudgmentRequest):
    try:
        url = LLM_APIS["llama3"]
        headers = {"Content-Type": "application/json"}

        judgment_prompt = f"""
        You are an AI judge evaluating responses based on correctness (1-10) and faithfulness (1-10).
        Compare the responses to the given question.

        Question: {request.prompt}

        Groq's Response: {request.groq_response}
        Gemini's Response: {request.gemini_response}

        Provide a structured JSON output in this format:
        {{
          "groq": {{"correctness": X, "faithfulness": Y}},
          "gemini": {{"correctness": A, "faithfulness": B}}
        }}
        """
        
        payload = {
            "model": "llama3",
            "prompt": judgment_prompt,
            "stream": False
        }

        response = requests.post(url, headers=headers, json=payload, stream=True)  # Enable streaming
        response_text = "".join([chunk.decode("utf-8") for chunk in response.iter_content(None)])

        # print("Hello From Backend")
        # print(response_text)

        # Extract JSON from response
        try:
            result = json.loads(response_text)
            return result
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response received", "raw_response": response_text}

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


# @router.post("/judge/")
# async def automated_judgment(request: JudgmentRequest):
#     """Use Llama 3 to evaluate responses from Groq and Gemini based on Correctness & Faithfulness."""
#     url = LLM_APIS["llama3"]  # Use Llama 3 for judging
#     headers = {"Content-Type": "application/json"}

#     # Define prompt for evaluation
#     judgment_prompt = f"""
#     You are an AI judge evaluating responses from two models based on two criteria:

#     1. **Correctness (1-10 scale)**: How accurately does the response answer the prompt?
#     2. **Faithfulness (1-10 scale)**: How well does the response align with the dataset without hallucination?

#     **Question:** {request.prompt}

#     **Groq's Response:** {request.groq_response}

#     **Gemini's Response:** {request.gemini_response}

#     Provide a structured JSON output in this format:
#     {{
#       "groq": {{"correctness": X, "faithfulness": Y}},
#       "gemini": {{"correctness": A, "faithfulness": B}}
#     }}
#     """

#     payload = {"model": "llama3", "prompt": judgment_prompt}

#     response = requests.post(url, headers=headers, json=payload)

#     if response.status_code != 200:
#         return {"error": response.text if response.text else "Failed to evaluate responses"}

#     return response.json()

# @router.post("/judge/")
# async def automated_judgment(request: JudgmentRequest):
#     """Use OpenAI GPT to evaluate responses from Groq and Gemini based on Correctness & Faithfulness."""
#     url = "https://api.openai.com/v1/chat/completions"
#     headers = {
#         "Authorization": f"Bearer {API_KEYS['openai']}",
#         "Content-Type": "application/json",
#     }

#     # Define prompt for evaluation
#     judgment_prompt = f"""
#     You are an AI judge evaluating responses from two models based on two criteria:
    
#     1. **Correctness (1-10 scale)**: How accurately does the response answer the prompt?
#     2. **Faithfulness (1-10 scale)**: How well does the response align with the dataset without hallucination?
    
#     **Question:** {request.prompt}
    
#     **Groq's Response:** {request.groq_response}
    
#     **Gemini's Response:** {request.gemini_response}
    
#     Provide a structured JSON output in this format:
#     {{
#       "groq": {{"correctness": X, "faithfulness": Y}},
#       "gemini": {{"correctness": A, "faithfulness": B}}
#     }}
#     """

#     payload = {
#         "model": "gpt-3.5-turbo",
#         "messages": [{"role": "user", "content": judgment_prompt}],
#         "temperature": 0.0,  # Keep deterministic
#     }

#     response = requests.post(url, headers=headers, json=payload)

#     if response.status_code != 200:
#         return {"error": response.text if response.text else "Failed to evaluate responses"}

#     return response.json()