from django.contrib import admin
from .views import get_user_data, register_user, LogoutView
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path,include

urlpatterns = [
    path('me/', get_user_data, name='user-data'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path("logout/", LogoutView.as_view()),

]