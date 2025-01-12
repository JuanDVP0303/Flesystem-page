from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PurchaseViewset, ProviderViewset

router = DefaultRouter()
router.register(r'orders', PurchaseViewset, basename='purchase')
router.register(r'providers', ProviderViewset, basename='providers')

urlpatterns = [
    path('', include(router.urls)),
]