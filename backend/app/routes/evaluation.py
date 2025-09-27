from fastapi import APIRouter
from fastapi import HTTPException
from pydantic import BaseModel
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()

# Define available LLM APIs
LLM_APIS = {
    "gemini": "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
    "llama3": "https://openrouter.ai/api/v1/chat/completions",
    "gpt-oss": "https://openrouter.ai/api/v1/chat/completions",
    "deepseek": "https://openrouter.ai/api/v1/chat/completions"
}

API_KEYS = {
    "gemini": os.getenv("GEMINI_API_KEY"),
    "openrouter": os.getenv("OPENROUTER_API_KEY")
}

print("Hello")
print(API_KEYS["openrouter"])

# Define a request model for expected input
class EvaluationRequest(BaseModel):
    prompt: str
    model: str
    max_tokens: int = 1000  # Default to 1000 tokens (~750 words)
    max_words: int = None   # Optional word limit (1 token ≈ 0.75 words)


# Request model for judgment system
class JudgmentRequest(BaseModel):
    prompt: str
    gemini_response: str
    gpt_oss_response: str
    deepseek_response: str


@router.post("/run/")
async def evaluate(request: EvaluationRequest):
    if request.model not in LLM_APIS:
        raise HTTPException(status_code=400, detail="Invalid model name")

    # Calculate max_tokens based on word limit if provided
    max_tokens = request.max_tokens
    if request.max_words:
        # Convert words to tokens (roughly 1 token = 0.75 words)
        max_tokens = int(request.max_words * 1.33)

    url = LLM_APIS[request.model]

    if request.model == "gemini":
        url += f"?key={API_KEYS['gemini']}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{"parts": [{"text": request.prompt}]}],
            "generationConfig": {
                "maxOutputTokens": max_tokens
            }
        }
    elif request.model == "llama3":
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # Required by OpenRouter
            "X-Title": "LLM Evaluation Platform"  # Optional but recommended
        }
        payload = {
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [{"role": "user", "content": request.prompt}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }
    elif request.model == "gpt-oss":
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # Required by OpenRouter
            "X-Title": "LLM Evaluation Platform"  # Optional but recommended
        }
        payload = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [{"role": "user", "content": request.prompt}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }
    elif request.model == "deepseek":
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",  # Required by OpenRouter
            "X-Title": "LLM Evaluation Platform"  # Optional but recommended
        }
        payload = {
            "model": "deepseek/deepseek-chat-v3-0324:free",
            "messages": [{"role": "user", "content": request.prompt}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code != 200:
        return {"error": response.text if response.text else "No response from API"}

    return response.json()





@router.post("/judge/")
async def automated_judgment(request: JudgmentRequest):
    try:
        url = LLM_APIS["llama3"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }

        judgment_prompt = f"""
        You are an AI judge evaluating responses based on correctness (1-10) and faithfulness (1-10).
        Compare the responses to the given question.

        Question: {request.prompt}

        Gemini's Response: {request.gemini_response}
        GPT-OSS's Response: {request.gpt_oss_response}
        DeepSeek's Response: {request.deepseek_response}

        Provide a structured JSON output in this format:
        {{
          "gemini": {{"correctness": X, "faithfulness": Y}},
          "gpt_oss": {{"correctness": A, "faithfulness": B}},
          "deepseek": {{"correctness": C, "faithfulness": D}}
        }}
        """
        
        payload = {
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [{"role": "user", "content": judgment_prompt}],
            "temperature": 0.1,  # Lower temperature for more consistent judgment
            "max_tokens": 500
        }

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        response_text = response.text

        # Extract JSON from response
        try:
            result = json.loads(response_text)
            
            # Handle OpenRouter response format for judgment
            if "choices" in result and len(result["choices"]) > 0:
                message = result["choices"][0].get("message", {})
                content = message.get("content", "")
                
                # Try to parse the JSON from the content
                try:
                    # Look for JSON in the response content
                    import re
                    json_match = re.search(r'\{.*\}', content, re.DOTALL)
                    if json_match:
                        json_str = json_match.group()
                        parsed_result = json.loads(json_str)
                        return parsed_result
                    else:
                        return {"error": "No JSON found in response", "raw_response": content}
                except json.JSONDecodeError:
                    return {"error": "Invalid JSON in response content", "raw_response": content}
            else:
                return result
                
        except json.JSONDecodeError:
            return {"error": "Invalid JSON response received", "raw_response": response_text}

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail="Internal Server Error")


# Request model for chat
class ChatRequest(BaseModel):
    message: str
    max_tokens: int = 1000  # Default to 1000 tokens (~750 words)
    max_words: int = None   # Optional word limit


@router.post("/chat/llama3/")
async def chat_with_llama3(request: ChatRequest):
    """Chat endpoint specifically for Llama3 using OpenRouter"""
    try:
        # Calculate max_tokens based on word limit if provided
        max_tokens = request.max_tokens
        if request.max_words:
            max_tokens = int(request.max_words * 1.33)
        
        url = LLM_APIS["llama3"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        payload = {
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [{"role": "user", "content": request.message}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }

        print(f"Llama3 Chat Request: {payload}")  # Debug log

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"Llama3 Response Status: {response.status_code}")  # Debug log
        
        if response.status_code != 200:
            error_text = response.text if response.text else "No response from Llama3 API"
            print(f"Llama3 API Error: {error_text}")  # Debug log
            return {"error": f"Llama3 API Error: {error_text}"}

        # Parse OpenRouter response format
        try:
            response_data = response.json()
            print(f"Llama3 Response Data: {response_data}")  # Debug log
            
            # Extract the response text from OpenRouter format
            if "choices" in response_data and len(response_data["choices"]) > 0:
                message = response_data["choices"][0].get("message", {})
                content = message.get("content", "")
                return {"response": content}
            else:
                # Fallback for unexpected format
                return {"response": str(response_data), "raw_data": response_data}
                
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")  # Debug log
            # If JSON parsing fails, return the raw text
            return {"response": response.text, "raw_text": True}

    except requests.exceptions.ConnectionError:
        error_msg = "Cannot connect to Llama3. Please ensure Llama3 is running on localhost:11434"
        print(f"Connection Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except requests.exceptions.Timeout:
        error_msg = "Llama3 request timed out. Please try again."
        print(f"Timeout Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except Exception as e:
        error_msg = f"Llama3 Chat Error: {str(e)}"
        print(f"General Error: {error_msg}")  # Debug log
        return {"error": error_msg}


@router.post("/chat/gpt-oss/")
async def chat_with_gpt_oss(request: ChatRequest):
    """Chat endpoint specifically for GPT-OSS using OpenRouter"""
    try:
        url = LLM_APIS["gpt-oss"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        # Calculate max_tokens based on word limit if provided
        max_tokens = request.max_tokens
        if request.max_words:
            max_tokens = int(request.max_words * 1.33)
        
        payload = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [{"role": "user", "content": request.message}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }

        print(f"GPT-OSS Chat Request: {payload}")  # Debug log

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"GPT-OSS Response Status: {response.status_code}")  # Debug log
        
        if response.status_code != 200:
            error_text = response.text if response.text else "No response from GPT-OSS API"
            print(f"GPT-OSS API Error: {error_text}")  # Debug log
            return {"error": f"GPT-OSS API Error: {error_text}"}

        # Parse OpenRouter response format
        try:
            response_data = response.json()
            print(f"GPT-OSS Response Data: {response_data}")  # Debug log
            
            # Extract the response text from OpenRouter format
            if "choices" in response_data and len(response_data["choices"]) > 0:
                message = response_data["choices"][0].get("message", {})
                content = message.get("content", "")
                return {"response": content}
            else:
                # Fallback for unexpected format
                return {"response": str(response_data), "raw_data": response_data}
                
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")  # Debug log
            # If JSON parsing fails, return the raw text
            return {"response": response.text, "raw_text": True}

    except requests.exceptions.ConnectionError:
        error_msg = "Cannot connect to GPT-OSS. Please check your internet connection."
        print(f"Connection Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except requests.exceptions.Timeout:
        error_msg = "GPT-OSS request timed out. Please try again."
        print(f"Timeout Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except Exception as e:
        error_msg = f"GPT-OSS Chat Error: {str(e)}"
        print(f"General Error: {error_msg}")  # Debug log
        return {"error": error_msg}


@router.get("/health/gpt-oss/")
async def check_gpt_oss_health():
    """Check if GPT-OSS via OpenRouter is accessible"""
    try:
        url = LLM_APIS["gpt-oss"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        # Simple test payload
        payload = {
            "model": "openai/gpt-oss-20b:free",
            "messages": [{"role": "user", "content": "Hello"}],
            "max_tokens": 10
        }

        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            return {"status": "healthy", "message": "GPT-OSS via OpenRouter is accessible"}
        elif response.status_code == 401:
            return {"status": "unhealthy", "message": "Invalid OpenRouter API key. Please check your API key."}
        else:
            return {"status": "unhealthy", "message": f"OpenRouter returned status {response.status_code}"}

    except requests.exceptions.ConnectionError:
        return {"status": "unhealthy", "message": "Cannot connect to OpenRouter API"}
    except requests.exceptions.Timeout:
        return {"status": "unhealthy", "message": "OpenRouter request timed out"}
    except Exception as e:
        return {"status": "unhealthy", "message": f"Error checking GPT-OSS: {str(e)}"}


@router.post("/chat/deepseek/")
async def chat_with_deepseek(request: ChatRequest):
    """Chat endpoint specifically for DeepSeek V3 using OpenRouter"""
    try:
        url = LLM_APIS["deepseek"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        # Calculate max_tokens based on word limit if provided
        max_tokens = request.max_tokens
        if request.max_words:
            max_tokens = int(request.max_words * 1.33)
        
        payload = {
            "model": "deepseek/deepseek-chat-v3-0324:free",
            "messages": [{"role": "user", "content": request.message}],
            "temperature": 0.7,
            "max_tokens": max_tokens
        }

        print(f"DeepSeek Chat Request: {payload}")  # Debug log

        response = requests.post(url, headers=headers, json=payload, timeout=30)
        
        print(f"DeepSeek Response Status: {response.status_code}")  # Debug log
        
        if response.status_code != 200:
            error_text = response.text if response.text else "No response from DeepSeek API"
            print(f"DeepSeek API Error: {error_text}")  # Debug log
            
            # Handle rate limiting specifically
            if response.status_code == 429:
                try:
                    error_data = response.json()
                    if "error" in error_data and "metadata" in error_data["error"]:
                        raw_error = error_data["error"]["metadata"].get("raw", "")
                        if "rate-limited" in raw_error.lower():
                            return {"error": "DeepSeek V3 is currently rate-limited. Please try again in a few minutes or use a different model."}
                except:
                    pass
            
            return {"error": f"DeepSeek API Error: {error_text}"}

        # Parse OpenRouter response format
        try:
            response_data = response.json()
            print(f"DeepSeek Response Data: {response_data}")  # Debug log
            
            # Extract the response text from OpenRouter format
            if "choices" in response_data and len(response_data["choices"]) > 0:
                message = response_data["choices"][0].get("message", {})
                content = message.get("content", "")
                return {"response": content}
            else:
                # Fallback for unexpected format
                return {"response": str(response_data), "raw_data": response_data}
                
        except json.JSONDecodeError as e:
            print(f"JSON Decode Error: {e}")  # Debug log
            # If JSON parsing fails, return the raw text
            return {"response": response.text, "raw_text": True}

    except requests.exceptions.ConnectionError:
        error_msg = "Cannot connect to DeepSeek. Please check your internet connection."
        print(f"Connection Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except requests.exceptions.Timeout:
        error_msg = "DeepSeek request timed out. Please try again."
        print(f"Timeout Error: {error_msg}")  # Debug log
        return {"error": error_msg}
    except Exception as e:
        error_msg = f"DeepSeek Chat Error: {str(e)}"
        print(f"General Error: {error_msg}")  # Debug log
        return {"error": error_msg}


@router.get("/health/deepseek/")
async def check_deepseek_health():
    """Check if DeepSeek V3 via OpenRouter is accessible"""
    try:
        url = LLM_APIS["deepseek"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        # Simple test payload
        payload = {
            "model": "deepseek/deepseek-chat-v3-0324:free",
            "messages": [{"role": "user", "content": "Hello"}],
            "max_tokens": 10
        }

        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            return {"status": "healthy", "message": "DeepSeek V3 via OpenRouter is accessible"}
        elif response.status_code == 401:
            return {"status": "unhealthy", "message": "Invalid OpenRouter API key. Please check your API key."}
        else:
            return {"status": "unhealthy", "message": f"OpenRouter returned status {response.status_code}"}

    except requests.exceptions.ConnectionError:
        return {"status": "unhealthy", "message": "Cannot connect to OpenRouter API"}
    except requests.exceptions.Timeout:
        return {"status": "unhealthy", "message": "OpenRouter request timed out"}
    except Exception as e:
        return {"status": "unhealthy", "message": f"Error checking DeepSeek V3: {str(e)}"}


@router.get("/health/llama3/")
async def check_llama3_health():
    """Check if Llama3 via OpenRouter is accessible"""
    try:
        url = LLM_APIS["llama3"]
        headers = {
            "Authorization": f"Bearer {API_KEYS['openrouter']}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "LLM Evaluation Platform"
        }
        
        # Simple test payload
        payload = {
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [{"role": "user", "content": "Hello"}],
            "max_tokens": 10
        }

        response = requests.post(url, headers=headers, json=payload, timeout=10)
        
        if response.status_code == 200:
            return {"status": "healthy", "message": "Llama 3.3 via OpenRouter is accessible"}
        elif response.status_code == 401:
            return {"status": "unhealthy", "message": "Invalid OpenRouter API key. Please check your API key."}
        else:
            return {"status": "unhealthy", "message": f"OpenRouter returned status {response.status_code}"}

    except requests.exceptions.ConnectionError:
        return {"status": "unhealthy", "message": "Cannot connect to OpenRouter API"}
    except requests.exceptions.Timeout:
        return {"status": "unhealthy", "message": "OpenRouter request timed out"}
    except Exception as e:
        return {"status": "unhealthy", "message": f"Error checking Llama 3.3: {str(e)}"}