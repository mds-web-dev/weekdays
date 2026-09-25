from django.core.management.base import BaseCommand
from api.models import Task

class Command(BaseCommand):
    help = 'Seeds initial educational DevOps deployment tasks'

    def handle(self, *args, **kwargs):
        tasks = [
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

        count = 0
        for item in tasks:
            _, created = Task.objects.get_or_create(
                title=item["title"],
                defaults=item
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully seeded {count} educational tasks!"))
