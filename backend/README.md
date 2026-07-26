---
title: GradeSense AI FastAPI Backend
emoji: 🏭
colorFrom: red
colorTo: gray
sdk: docker
app_port: 8000
---

# GradeSense AI — Honeywell Paper Machine Backend API

Python FastAPI backend featuring XGBoost risk prediction, LSTM moisture forecasts, SHAP explainability, and Honeywell MPC simulation engine.

## Hugging Face Spaces Deployment
1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. Space Name: `gradesense-ai-backend`
3. SDK: **Docker**
4. Upload all files from the `backend/` directory.
5. Live API URL: `https://YOUR_HF_USERNAME-gradesense-ai-backend.hf.space/docs`

## Render.com Deployment
1. Go to [render.com](https://render.com) ➔ New Web Service.
2. Root Directory: `backend`
3. Build Command: `pip install -r requirements.txt`
4. Start Command: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
