from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthCheckView, TaskViewSet, SeedDataView

router = DefaultRouter()
router.register(r'tasks', TaskViewSet, basename='task')

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
    path('seed/', SeedDataView.as_view(), name='seed-data'),
    path('', include(router.urls)),
]
