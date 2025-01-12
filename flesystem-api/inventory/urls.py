from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductsViewset, MovementsViewset

router = DefaultRouter()
router.register(r'products', ProductsViewset)
router.register(r'movements', MovementsViewset)

urlpatterns = [
    path('', include(router.urls)),
]