# Complete DevOps Deployment Guide: Django (Render) + React Vite (Vercel)

> **Course Level**: Beginner to Intermediate Full-Stack & DevOps  
> **Backend Platform**: [Render](https://render.com) (Python Web Service)  
> **Frontend Platform**: [Vercel](https://vercel.com) (Edge CDN / Single Page Application)  
> **Stack**: Django 5.2 + Django REST Framework + Gunicorn + WhiteNoise + React 19 + Vite 8 + Tailwind CSS

---

## Table of Contents
1. [Why Decouple Frontend and Backend?](#1-why-decouple-frontend-and-backend)
2. [Full-Stack Architecture Overview](#2-full-stack-architecture-overview)
3. [Local Development Setup](#3-local-development-setup)
4. [Preparing Your Git Repository](#4-preparing-your-git-repository)
5. [Deploying Backend to Render](#5-deploying-backend-to-render)
6. [Deploying Frontend to Vercel](#6-deploying-frontend-to-vercel)
7. [Connecting Frontend to Backend (The Handshake)](#7-connecting-frontend-to-backend-the-handshake)
8. [The 4 Classic Student Pitfalls & How to Avoid Them](#8-the-4-classic-student-pitfalls--how-to-avoid-them)
9. [Classroom Exercise & Verification](#9-classroom-exercise--verification)

---

## 1. Why Decouple Frontend and Backend?

In traditional monolithic web development (e.g., standard Django templates or PHP), the backend server generates HTML and sends it directly to the browser.

In modern cloud engineering, we **decouple** the client and server:
- **Frontend (Vercel)**: Static HTML, JavaScript, and CSS files deployed to **Edge CDNs** worldwide. Ultra-fast initial load times with zero server maintenance.
- **Backend (Render)**: A REST API microservice dedicated strictly to business logic, authentication, and database operations.
- **Communication**: The frontend makes asynchronous `fetch` or `axios` HTTP calls over JSON to the backend.

---

## 2. Full-Stack Architecture Overview

```
                      ┌────────────────────────────┐
                      │       User's Browser       │
                      └──────────────┬─────────────┘
                                     │
           1. Initial Page Load      │  2. REST API Requests
             (Fast Global CDN)       │     (JSON Over HTTPS)
                                     │
         ▼                           ▼
┌──────────────────┐       ┌────────────────────────────────┐
│   VERCEL (CDN)   │       │         RENDER (Server)        │
│  React Vite SPA  │       │     Django + Gunicorn WSGI     │
│   (Static Files) │       │   /api/health/ & /api/tasks/   │
└──────────────────┘       └────────────────┬───────────────┘
                                            │
                                            ▼
                                   ┌────────────────┐
                                   │    DATABASE    │
                                   │ Postgres/SQLite│
                                   └────────────────┘
```

---

## 3. Local Development Setup

To test everything locally before deploying:

### Backend Setup (Django)
```bash
# 1. Open a terminal and enter the backend directory
cd backend

# 2. Create and activate a Python virtual environment
# Windows:
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
python3 -m venv venv
source venv/bin/activate

# 3. Install required packages
pip install -r requirements.txt

# 4. Run database migrations and seed classroom checklist data
python manage.py makemigrations
python manage.py migrate
python manage.py seed_tasks

# 5. Start the local Django development server
python manage.py runserver 127.0.0.1:8000
```
Backend will be live at `http://127.0.0.1:8000/`. You can test:
- API Root: `http://127.0.0.1:8000/`
- Health Check: `http://127.0.0.1:8000/api/health/`
- Task List: `http://127.0.0.1:8000/api/tasks/`
- Django Admin: `http://127.0.0.1:8000/admin/`

### Frontend Setup (React Vite + Tailwind)
```bash
# 1. Open a second terminal window and enter the frontend directory
cd frontend

# 2. Install Node dependencies
npm install

# 3. Start Vite dev server
npm run dev
```
Frontend will be live at `http://127.0.0.1:5173/`. Notice the live **Render Connected** badge indicating successful communication with the local backend!

---

## 4. Preparing Your Git Repository

Push the repository to GitHub:
```bash
git init
git add .
git commit -m "Initial commit of full-stack devops project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/devops-lab.git
git push -u origin main
```

---

## 5. Deploying Backend to Render

Render is a modern cloud hosting platform capable of running Docker containers, web services, and databases.

### Step 1: Sign up and connect GitHub
1. Go to [dashboard.render.com](https://dashboard.render.com) and create a free account.
2. Click **New +** in the top right, then select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub repository.

### Step 2: Configure the Web Service
Fill in the following fields:

| Setting | Recommended Value | Explanation |
| :--- | :--- | :--- |
| **Name** | `devops-django-backend` | Unique identifier for your service |
| **Region** | Oregon (US West) or closest | Select the region closest to you |
| **Branch** | `main` | Production branch |
| **Root Directory** | `backend` | **Crucial:** Tells Render to look in the `backend/` folder |
| **Runtime** | `Python 3` | Environment runtime |
| **Build Command** | `./build.sh` | Executes dependencies, static collection, migrations |
| **Start Command** | `gunicorn core.wsgi:application` | Runs production WSGI server |
| **Instance Type** | `Free` | $0/month free tier |

### Step 3: Add Environment Variables
Under the **Environment Variables** section on Render, add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `PYTHON_VERSION` | `3.13.11` | Ensures consistent Python version |
| `DEBUG` | `False` | **Never** run `DEBUG=True` in production |
| `SECRET_KEY` | *(Click "Generate" or type a random 50-char string)* | Protects sessions and cryptographic signing |
| `ALLOWED_HOSTS` | `.onrender.com` | Allows your Render subdomain to receive requests |

### Step 4: Click "Deploy Web Service"
Watch the Render build logs. You will see:
1. `pip install -r requirements.txt`
2. `python manage.py collectstatic --no-input` (WhiteNoise processes assets)
3. `python manage.py migrate` (Database schema applied)
4. `python manage.py seed_tasks` (Pre-seeds checklist tasks)
5. `gunicorn core.wsgi:application` (Server listens on port 10000)

Once live, Render will give you a public URL such as:
`https://devops-django-backend.onrender.com`

Verify it by opening `https://devops-django-backend.onrender.com/api/health/` in your browser.

---

## 6. Deploying Frontend to Vercel

Vercel is the creator of Next.js and the premier hosting platform for React and Vite applications.

### Step 1: Sign up and Import Repo
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** → **Project**.
3. Select your GitHub repository.

### Step 2: Configure Build Settings
In the configuration screen:

| Setting | Value | Why It Matters |
| :--- | :--- | :--- |
| **Framework Preset** | `Vite` | Auto-detects Vite build configuration |
| **Root Directory** | `frontend` | **Crucial:** Click "Edit" and choose the `frontend` folder |
| **Build Command** | `vite build` (default) | Compiles React JSX and Tailwind CSS into `dist/` |
| **Output Directory** | `dist` (default) | Contains static assets served by Vercel CDN |

### Step 3: Set Environment Variable
Expand the **Environment Variables** section:

| Name | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://devops-django-backend.onrender.com` |

> ⚠️ **IMPORTANT**: In Vite, all client-exposed environment variables **must** start with `VITE_`. If you name it `API_URL`, Vite will refuse to bundle it for security reasons!

### Step 4: Click "Deploy"
In 15–30 seconds, Vercel will deploy your site and provide a live URL such as:
`https://devops-lab-frontend.vercel.app`

---

## 7. Connecting Frontend to Backend (The Handshake)

Now that both are deployed, ensure Cross-Origin Resource Sharing (CORS) is enabled so the browser allows the Vercel domain to call the Render domain.

### In Render Dashboard:
1. Go to your Render Web Service → **Environment**.
2. Add or update `CORS_ALLOWED_ORIGINS`:
   ```
   CORS_ALLOWED_ORIGINS = https://devops-lab-frontend.vercel.app
   ```
3. *Note*: In `core/settings.py`, we also included:
   ```python
   CORS_ALLOWED_ORIGIN_REGEXES = [
       r"^https:\/\/.*\.vercel\.app$",
   ]
   ```
   This regex pattern automatically permits any Vercel preview or production deployment without manual configuration!

---

## 8. The 4 Classic Student Pitfalls & How to Avoid Them

### Pitfall 1: "CORS policy: No 'Access-Control-Allow-Origin' header is present"
- **Why it happens**: For security, browsers block JavaScript running on `site-a.com` from reading responses from `site-b.com` unless `site-b.com` explicitly consents.
- **The Fix**: 
  1. Install `django-cors-headers`.
  2. Put `corsheaders.middleware.CorsMiddleware` at the very top of `MIDDLEWARE` in `settings.py` (right after `SecurityMiddleware`).
  3. Ensure your frontend domain is in `CORS_ALLOWED_ORIGINS`.

### Pitfall 2: Render Free Tier "Cold Start" Delay
- **Why it happens**: Free instances on Render spin down to 0 after 15 minutes of inactivity to save energy and cost.
- **The Effect**: The very first request after sleeping takes **30–50 seconds** while Render spins up the container.
- **The Fix**:
  - Do not panic! This is standard cloud behavior on free tiers.
  - Our React frontend features an automatic timeout handler and "Pinging..." status pill that informs students the server is waking up.

### Pitfall 3: 404 Error on Page Refresh in Vercel
- **Why it happens**: Single Page Applications (SPAs) use client-side routing. When a user refreshes `https://app.vercel.app/tasks`, the Vercel web server looks for a physical file named `/tasks/index.html` which does not exist.
- **The Fix**: Include `vercel.json` in the frontend root with rewrite rules:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```

### Pitfall 4: Missing Admin CSS / WhiteNoise 500 Error
- **Why it happens**: Gunicorn is a WSGI application server, not a static web server. Out of the box, it does not serve CSS or JavaScript files.
- **The Fix**:
  1. Install `whitenoise[brotli]`.
  2. Add `whitenoise.middleware.WhiteNoiseMiddleware` right below `SecurityMiddleware`.
  3. Run `python manage.py collectstatic --no-input` in `build.sh`.

---

## 9. Classroom Exercise & Verification

Have students perform this 5-minute validation exercise:
1. Open the live Vercel app on a phone or laptop.
2. Verify the top badge reads **Render Connected**.
3. Inspect the **Telemetry Card** and note down:
   - Database Engine
   - Django DEBUG status (should be `False`)
   - Roundtrip API Latency in milliseconds
4. Click **Add Custom Step** and add a personal task.
5. Toggle the checkbox to mark it complete.
6. Open browser DevTools (`F12`) → **Network Tab** → Inspect the `PATCH /api/tasks/{id}/` request:
   - Request Headers: Notice the `Origin: https://...vercel.app`
   - Response Headers: Notice `access-control-allow-origin: https://...vercel.app`
   - Status Code: `200 OK`
