from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "project": "DevOps Teaching API - Django Backend",
        "description": "Educational backend built for deployment on Render, connecting with React Vite on Vercel.",
        "status": "online",
        "endpoints": {
            "health": "/api/health/",
            "tasks": "/api/tasks/",
            "seed_data": "/api/seed/",
            "admin": "/admin/",
        },
        "documentation": "See README.md in project root for deployment instructions."
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('', api_root, name='api-root'),
]
