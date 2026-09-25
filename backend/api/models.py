from django.db import models

class Task(models.Model):
    CATEGORY_CHOICES = [
        ('local', 'Local Setup'),
        ('render', 'Render Backend'),
        ('vercel', 'Vercel Frontend'),
        ('devops', 'CI/CD & DevOps'),
        ('general', 'General'),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{'[DONE] ' if self.is_completed else '[TODO] '}{self.title}"
