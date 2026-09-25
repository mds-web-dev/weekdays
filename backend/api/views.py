from datetime import datetime
from django.conf import settings
from django.db import connection
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Task
from .serializers import TaskSerializer

class HealthCheckView(APIView):
    """
    Health check endpoint for Render monitoring and Vercel frontend connectivity checks.
    GET /api/health/
    """
    def get(self, request):
        db_status = "ok"
        db_error = None
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
        except Exception as e:
            db_status = "error"
            db_error = str(e)

        return Response({
            "status": "healthy" if db_status == "ok" else "degraded",
            "service": "Django REST Backend",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat(),
            "environment": "development" if settings.DEBUG else "production",
            "debug_mode": settings.DEBUG,
            "database": {
                "engine": connection.settings_dict.get('ENGINE', 'unknown').split('.')[-1],
                "status": db_status,
                "error": db_error,
            },
            "allowed_hosts": settings.ALLOWED_HOSTS,
            "cors_allowed_origins": settings.CORS_ALLOWED_ORIGINS,
            "message": "Backend is running and accessible!",
        }, status=status.HTTP_200_OK if db_status == "ok" else status.HTTP_503_SERVICE_UNAVAILABLE)


class TaskViewSet(viewsets.ModelViewSet):
    """
    Full CRUD ViewSet for student DevOps deployment checklist / tasks.
    Endpoints:
    - GET /api/tasks/
    - POST /api/tasks/
    - GET /api/tasks/{id}/
    - PUT/PATCH /api/tasks/{id}/
    - DELETE /api/tasks/{id}/
    """
    queryset = Task.objects.all().order_by('-created_at')
    serializer_class = TaskSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset


class SeedDataView(APIView):
    """
    Convenience endpoint for students to auto-seed initial educational deployment tasks.
    POST /api/seed/
    """
    SAMPLE_TASKS = [
        {
            "title": "Set up Git repository and organize backend & frontend folders",
            "description": "Organize code into separate backend/ and frontend/ folders to enable decoupled multi-platform deployment.",
            "category": "local",
            "is_completed": True,
        },
        {
            "title": "Create Web Service on Render for Django backend",
            "description": "Connect GitHub repo to Render, set Root Directory to 'backend', Build Command to './build.sh', and Start Command to 'gunicorn core.wsgi:application'.",
            "category": "render",
            "is_completed": False,
        },
        {
            "title": "Configure Render Environment Variables",
            "description": "Add SECRET_KEY, set DEBUG=False, and optionally set ALLOWED_HOSTS and DATABASE_URL in Render Dashboard.",
            "category": "render",
            "is_completed": False,
        },
        {
            "title": "Deploy React Vite frontend on Vercel",
            "description": "Import GitHub repository on Vercel, set Root Directory to 'frontend', Framework Preset to 'Vite'.",
            "category": "vercel",
            "is_completed": False,
        },
        {
            "title": "Set VITE_API_URL environment variable in Vercel",
            "description": "Point VITE_API_URL to your live Render backend URL (e.g., https://my-backend.onrender.com).",
            "category": "vercel",
            "is_completed": False,
        },
        {
            "title": "Verify CORS connectivity and test live End-to-End API",
            "description": "Confirm that Vercel frontend can call Render backend without browser CORS blocking errors.",
            "category": "devops",
            "is_completed": False,
        },
    ]

    def post(self, request):
        created_count = 0
        for task_data in self.SAMPLE_TASKS:
            if not Task.objects.filter(title=task_data["title"]).exists():
                Task.objects.create(**task_data)
                created_count += 1
        return Response({
            "message": f"Successfully seeded {created_count} educational tasks.",
            "total_tasks": Task.objects.count()
        }, status=status.HTTP_201_CREATED)
