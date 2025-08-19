# 🚀 Deploy to Render - Complete Guide

## Prerequisites

### 1. API Keys Required
You need API keys for the following services:

- **Groq API**: Get from [console.groq.com](https://console.groq.com)
- **Gemini API**: Get from [makersuite.google.com](https://makersuite.google.com)
- **OpenRouter API**: Get from [openrouter.ai](https://openrouter.ai)

### 2. GitHub Repository
Make sure your code is pushed to GitHub.

## Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Push all changes to GitHub:**
   ```bash
   cd LLM-Elevation-Platform
   git add .
   git commit -m "Add Render deployment configuration"
   git push origin main
   ```

2. **Verify these files exist in your repository:**
   - `backend/requirements.txt`
   - `backend/render.yaml`
   - `backend/app/main.py`
   - `backend/app/routes/evaluation.py`

### Step 2: Deploy on Render

1. **Go to Render:**
   - Visit [render.com](https://render.com)
   - Sign up/Login with your GitHub account

2. **Create New Web Service:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository containing your LLM Evaluation Platform

3. **Configure the Service:**
   - **Name**: `llm-evaluation-backend` (or your preferred name)
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `backend` (important!)

4. **Add Environment Variables:**
   Click "Environment" tab and add:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete (usually 2-5 minutes)

### Step 3: Get Your Backend URL

After successful deployment, Render will provide you with a URL like:
```
https://your-app-name.onrender.com
```

### Step 4: Update Frontend Configuration

1. **Update the API configuration:**
   Edit `frontend/src/config/api.js`:
   ```javascript
   const API_CONFIG = {
     LOCAL: "http://localhost:8000",
     PRODUCTION: "https://your-actual-app-name.onrender.com", // ← Update this
     CURRENT: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'LOCAL'
   };
   ```

2. **Test the connection:**
   Visit `https://your-app-name.onrender.com` in your browser
   You should see: `{"message": "LLM Evaluation Platform API"}`

### Step 5: Deploy Frontend (Optional)

You can also deploy your frontend to:
- **Vercel**: Connect your GitHub repo and deploy
- **Netlify**: Drag and drop your `build` folder
- **GitHub Pages**: Use GitHub Actions

## Troubleshooting

### Common Issues:

1. **Build Fails:**
   - Check `requirements.txt` has all dependencies
   - Verify Python version compatibility

2. **Environment Variables Not Working:**
   - Double-check variable names (case-sensitive)
   - Redeploy after adding environment variables

3. **CORS Errors:**
   - Backend already allows all origins (`allow_origins=["*"]`)
   - If issues persist, update CORS settings in `main.py`

4. **API Timeouts:**
   - Render free tier has 15-minute sleep after inactivity
   - First request after sleep may take 30-60 seconds

### Health Check Endpoints:

Test these URLs to verify your deployment:
- `https://your-app-name.onrender.com/` - Basic health check
- `https://your-app-name.onrender.com/evaluation/health/llama3/` - Llama 3.3 health
- `https://your-app-name.onrender.com/evaluation/health/gpt-oss/` - GPT-OSS health

## Cost

- **Free Tier**: 750 hours/month (enough for 24/7 usage)
- **Sleep Mode**: Free tier sleeps after 15 minutes of inactivity
- **Wake Time**: First request after sleep takes 30-60 seconds

## Next Steps

1. **Test all endpoints** with your deployed backend
2. **Update frontend** to use the new backend URL
3. **Monitor logs** in Render dashboard
4. **Set up custom domain** (optional)

## Support

- **Render Docs**: [docs.render.com](https://docs.render.com)
- **FastAPI Docs**: [fastapi.tiangolo.com](https://fastapi.tiangolo.com)
- **Render Community**: [community.render.com](https://community.render.com)
