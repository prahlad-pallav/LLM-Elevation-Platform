# 🚀 LLM Evaluation Platform - Render Deployment Guide

## 📋 Prerequisites

1. **GitHub Account** - Your code needs to be on GitHub
2. **Render Account** - Sign up at [render.com](https://render.com) (free)
3. **API Keys** - You'll need:
   - Gemini API Key (from Google AI Studio)
   - OpenRouter API Key (for Llama 3.3, GPT-OSS, DeepSeek)

## 🔧 Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: LLM Evaluation Platform"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/LLM-Elevation-Platform.git
git push -u origin main
```

### 1.2 Verify File Structure
Your repository should have this structure:
```
LLM-Elevation-Platform/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   └── routes/
│   │       ├── datasets.py
│   │       └── evaluation.py
│   ├── requirements.txt
│   └── render.yaml
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── package-lock.json
└── README.md
```

## 🌐 Step 2: Deploy Backend on Render

### 2.1 Create Backend Service
1. Go to [render.com](https://render.com) and sign in
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select your repository: `LLM-Elevation-Platform`

### 2.2 Configure Backend Service
- **Name**: `llm-evaluation-backend`
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Root Directory**: `backend`

### 2.3 Set Environment Variables
In the Render dashboard, go to **Environment** tab and add:

| Key | Value | Description |
|-----|-------|-------------|
| `GEMINI_API_KEY` | `your_gemini_api_key` | From Google AI Studio |
| `OPENROUTER_API_KEY` | `your_openrouter_api_key` | From OpenRouter |

### 2.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. **Copy the backend URL** (e.g., `https://llm-evaluation-backend.onrender.com`)

## 🎨 Step 3: Deploy Frontend on Render

### 3.1 Create Frontend Service
1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect the same GitHub repository
3. Select your repository: `LLM-Elevation-Platform`

### 3.2 Configure Frontend Service
- **Name**: `llm-evaluation-frontend`
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/build`
- **Root Directory**: Leave empty (root)

### 3.3 Set Environment Variables
In the **Environment** tab, add:

| Key | Value | Description |
|-----|-------|-------------|
| `REACT_APP_API_URL` | `https://your-backend-url.onrender.com` | Your backend URL from Step 2.4 |

### 3.4 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete (5-10 minutes)
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
1. Commit and push the changes
2. Render will automatically redeploy

## ✅ Step 5: Test Your Deployment

### 5.1 Test Frontend
1. Visit your frontend URL
2. Try the "Multi-Model Compare" feature
3. Test individual model chats

### 5.2 Check Backend Health
Visit: `https://your-backend-url.onrender.com/docs` to see the API documentation

## 🐛 Troubleshooting

### Common Issues:

#### 1. **Build Failures**
- Check that all dependencies are in `requirements.txt`
- Verify Node.js version compatibility
- Check build logs in Render dashboard

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

## 📊 Monitoring

### Render Dashboard
- Monitor service health
- View logs and metrics
- Check deployment status

### Free Tier Limits
- **Backend**: 750 hours/month
- **Frontend**: Unlimited static hosting
- **Sleep**: Services sleep after 15 minutes of inactivity

## 🔄 Updates and Maintenance

### Updating Your App
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Render automatically redeploys

### Environment Variables
- Update in Render dashboard
- No code changes needed
- Services restart automatically

## 🎉 Success!

Your LLM Evaluation Platform is now live! Share your frontend URL with users to start evaluating AI models.

### Your URLs:
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend API**: `https://your-backend-url.onrender.com`
- **API Docs**: `https://your-backend-url.onrender.com/docs`

## 📞 Support

If you encounter issues:
1. Check Render documentation
2. Review build logs in Render dashboard
3. Test locally first
4. Check environment variables

Happy deploying! 🚀
