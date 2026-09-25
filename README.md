# Full-Stack DevOps Classroom Project: Django (Render) + React Vite Tailwind (Vercel)

A clean, modern educational repository specifically designed for teaching students how to build, connect, and deploy decoupled web applications across **Render** (Backend) and **Vercel** (Frontend).

![DevOps Full-Stack Architecture](https://img.shields.io/badge/Backend-Django%205.2%20REST-092E20?style=for-the-badge&logo=django)
![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%208-61DAFB?style=for-the-badge&logo=react)
![Tailwind](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss)
![Render](https://img.shields.io/badge/Deploy-Render-46E3B7?style=for-the-badge&logo=render)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)

---

## 📁 Repository Structure

```text
devops/
├── backend/                        # Django REST Backend (For Render)
│   ├── build.sh                    # Automated Render build script
│   ├── render.yaml                 # Render Blueprint specification
│   ├── requirements.txt            # Python dependencies
│   ├── core/                       # Django project settings & wsgi
│   │   ├── settings.py             # Configured for WhiteNoise, CORS, and Postgres
│   │   ├── urls.py                 # API root routing
│   │   └── wsgi.py                 # Gunicorn entry point
│   ├── api/                        # App with Health Check & Tasks CRUD
│   │   ├── models.py               # Task model with categories
│   │   ├── views.py                # HealthCheckView & TaskViewSet
│   │   └── management/commands/    # seed_tasks command
│   └── .env.example
├── frontend/                       # React Vite Frontend (For Vercel)
│   ├── vercel.json                 # SPA rewrite rules to prevent 404s
│   ├── vite.config.js              # Vite config with Tailwind CSS plugin
│   ├── src/
│   │   ├── App.jsx                 # Dashboard with real-time telemetry
│   │   ├── components/             # StatusCard, DevOpsTracker, GuideModal
│   │   └── services/api.js         # API client reading VITE_API_URL
│   └── .env.example
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Start Django Backend
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python manage.py seed_tasks
python manage.py runserver 127.0.0.1:8000
```
Backend API will be live at `http://127.0.0.1:8000/api/health/`.

### 2. Start React Frontend
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173/` in your browser.

---

## ☁️ Cloud Deployment Guide

### Part 1: Deploy Backend to [Render](https://dashboard.render.com)
1. In the Render Dashboard, click **New +** → **Web Service**.
2. Connect your GitHub repository: `https://github.com/mds-web-dev/deploy`.
3. Set the following fields:
   - **Name**: `devops-django-backend`
   - **Root Directory**: `backend` *(Crucial: tells Render to only run the Python code)*
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `gunicorn core.wsgi:application`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   - `DEBUG` = `False`
   - `SECRET_KEY` = *(Click Generate or enter a random string)*
   - `ALLOWED_HOSTS` = `.onrender.com`
5. Click **Deploy Web Service** and copy your backend URL (e.g. `https://devops-django-backend.onrender.com`).

---

### Part 2: Deploy Frontend to [Vercel](https://vercel.com)
1. In Vercel, click **Add New...** → **Project**.
2. Import your GitHub repository: `https://github.com/mds-web-dev/deploy`.
3. Set the following fields:
   - **Root Directory**: Click *Edit* and choose `frontend`.
   - **Framework Preset**: `Vite` *(auto-detected)*.
   - **Build Command**: `vite build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://devops-django-backend.onrender.com` *(paste your Render backend URL)*.
5. Click **Deploy**.

---

### Part 3: Connecting Frontend & Backend (CORS Handshake)
- In Render Dashboard under **Environment Variables**, ensure:
  - `CORS_ALLOWED_ORIGINS` = `https://your-frontend.vercel.app`
- *Note:* In `backend/core/settings.py`, all `https://*.vercel.app` domains are also automatically permitted via regex!

---

## 💡 Student Troubleshooting & Common Traps

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **CORS Policy Error** | Browser blocks cross-origin fetch | Configure `django-cors-headers` and set `CORS_ALLOWED_ORIGINS` on Render |
| **30-50s First Request Delay** | Render Free Tier spins down inactive instances | Standard cloud sleep behavior; server responds rapidly once awake |
| **404 on Refresh in Vercel** | SPA client routes need fallback | Handled by `frontend/vercel.json` rewrites |
| **Admin Styling Missing** | Gunicorn does not serve static files by default | Handled by WhiteNoise and `python manage.py collectstatic --no-input` in `build.sh` |
