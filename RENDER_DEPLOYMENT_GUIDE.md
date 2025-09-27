# 🚀 Complete Render.com Deployment Guide

## 📋 Prerequisites

✅ **Your code is now on GitHub**: [https://github.com/prahlad-pallav/LLM-Elevation-Platform](https://github.com/prahlad-pallav/LLM-Elevation-Platform)

✅ **You have the required API keys**:
- Gemini API Key (from Google AI Studio)
- OpenRouter API Key (for Llama 3.3, GPT-OSS, DeepSeek)

## 🌐 Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account
4. Authorize Render to access your repositories

## 🔧 Step 2: Deploy Backend (FastAPI)

### 2.1 Create Backend Service
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect GitHub"** if not already connected
3. Select your repository: `prahlad-pallav/LLM-Elevation-Platform`

### 2.2 Configure Backend Service
Fill in these exact settings:

| Field | Value |
|-------|-------|
| **Name** | `llm-evaluation-backend` |
| **Environment** | `Python 3` |
| **Region** | `Oregon (US West)` |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Runtime** | `Python 3.9` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

### 2.3 Set Environment Variables
In the **Environment** tab, add these variables:

| Key | Value | Description |
|-----|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key_here` | From Google AI Studio |
| `OPENROUTER_API_KEY` | `your_openrouter_api_key_here` | From OpenRouter |

### 2.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. **Copy the backend URL** (e.g., `https://llm-evaluation-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend (React)

### 3.1 Create Frontend Service
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Select your repository: `prahlad-pallav/LLM-Elevation-Platform`

### 3.2 Configure Frontend Service
Fill in these exact settings:

| Field | Value |
|-------|-------|
| **Name** | `llm-evaluation-frontend` |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Publish Directory** | `frontend/build` |

### 3.3 Set Environment Variables
In the **Environment** tab, add:

| Key | Value | Description |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com` | Your backend URL from Step 2.4 |

### 3.4 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment (5-10 minutes)
3. **Copy the frontend URL** (e.g., `https://llm-evaluation-frontend.onrender.com`)

## 🔗 Step 4: Update Backend CORS Settings

### 4.1 Update CORS in Backend
Add your frontend URL to the CORS origins in `backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://your-frontend-url.onrender.com",  # Production frontend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 4.2 Redeploy Backend
1. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Update CORS for production frontend"
   git push origin main
   ```
2. Render will automatically redeploy

## ✅ Step 5: Test Your Deployment

### 5.1 Test Frontend
1. Visit your frontend URL
2. Try the "Multi-Model Compare" feature
3. Test individual model chats

### 5.2 Check Backend Health
Visit: `https://your-backend-url.onrender.com/docs` to see the API documentation

## 🎯 Your Deployed URLs

After successful deployment, you'll have:

- **Frontend**: `https://llm-evaluation-frontend.onrender.com`
- **Backend API**: `https://llm-evaluation-backend.onrender.com`
- **API Docs**: `https://llm-evaluation-backend.onrender.com/docs`

## 🐛 Troubleshooting

### Common Issues:

#### 1. **Build Failures**
- Check the "Logs" tab in Render dashboard
- Verify all dependencies are in `requirements.txt`
- Check Node.js version compatibility

#### 2. **API Connection Issues**
- Verify `REACT_APP_API_URL` is set correctly
- Check CORS settings in backend
- Ensure backend is deployed and running

#### 3. **Environment Variables**
- Double-check API keys are correct
- Ensure variable names match exactly
- Check for typos in environment variable names

#### 4. **Slow Performance**
- Render free tier has cold starts
- First request after inactivity may be slow
- Consider upgrading to paid plan for better performance

## 📊 Render Dashboard Navigation

### Backend Service
```
Render Dashboard
├── Web Services
│   └── llm-evaluation-backend
│       ├── Overview
│       ├── Environment ← Set API keys here
│       ├── Manual Deploy ← Redeploy after changes
│       ├── Logs ← Check for errors
│       └── Settings
```

### Frontend Service
```
Render Dashboard
├── Static Sites
│   └── llm-evaluation-frontend
│       ├── Overview
│       ├── Environment ← Set REACT_APP_API_URL here
│       ├── Manual Deploy ← Redeploy after changes
│       ├── Logs ← Check for errors
│       └── Settings
```

## 🔄 Updates and Maintenance

### Updating Your App
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
4. Render automatically redeploys

### Environment Variables
- Update in Render dashboard
- No code changes needed
- Services restart automatically

## 💰 Cost Information

### Free Tier Limits
- **Backend**: 750 hours/month (enough for most use cases)
- **Frontend**: Unlimited static hosting
- **Sleep**: Services sleep after 15 minutes of inactivity

### Paid Plans
- **Starter**: $7/month per service
- **Standard**: $25/month per service
- **Pro**: $85/month per service

## 🎉 Success!

Your LLM Evaluation Platform is now live! Share your frontend URL with users to start evaluating AI models.

## 📞 Support

If you encounter issues:
1. Check Render documentation: [render.com/docs](https://render.com/docs)
2. Review build logs in Render dashboard
3. Test locally first
4. Check environment variables

## 🔗 Useful Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Your GitHub Repository](https://github.com/prahlad-pallav/LLM-Elevation-Platform)
- [Google AI Studio](https://aistudio.google.com) (for Gemini API key)
- [OpenRouter](https://openrouter.ai) (for OpenRouter API key)

Happy deploying! 🚀
