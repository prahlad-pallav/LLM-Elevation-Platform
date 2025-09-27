# LLM Evaluation Platform Backend

FastAPI backend for the LLM Evaluation Platform that integrates with multiple AI models including Gemini, Llama 3.3, GPT-OSS, and DeepSeek V3.

## Deployment on Render

### Prerequisites
- GitHub account
- Render account
- API keys for the following services:
  - Gemini API
  - OpenRouter API

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Render deployment files"
   git push origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Sign up/Login with your GitHub account
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing this backend

3. **Configure Environment Variables**
   In Render dashboard, go to your service → Environment → Add the following:
   - `GEMINI_API_KEY` - Your Gemini API key
   - `OPENROUTER_API_KEY` - Your OpenRouter API key

4. **Deploy**
   - Render will automatically detect the `render.yaml` file
   - Click "Create Web Service"
   - Wait for deployment to complete

### API Endpoints

- `GET /` - Health check
- `POST /evaluation/run/` - Run evaluation on specific model
- `POST /evaluation/judge/` - AI-powered response evaluation
- `POST /evaluation/chat/llama3/` - Chat with Llama 3.3
- `POST /evaluation/chat/gpt-oss/` - Chat with GPT-OSS
- `GET /evaluation/health/llama3/` - Llama 3.3 health check
- `GET /evaluation/health/gpt-oss/` - GPT-OSS health check

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Environment Variables

Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=your_gemini_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
```
