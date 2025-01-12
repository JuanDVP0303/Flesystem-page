from django.urls import path
from . import views

urlpatterns = [
    path('create-user/', views.CreateUserView.as_view(), name='create-user'),
    path('login/', views.LoginUserView.as_view(), name='login'),
    path('logout/', views.LogoutUserView.as_view(), name='login'),
    # path('countries/', views.CountryList.as_view(), name='countries'),
    path('users/', views.UsersViewset.as_view(), name='users'),
    path('token/refresh/', views.TokenRefreshCustomView.as_view(), name='token_refresh'),
]