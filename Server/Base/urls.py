from django.contrib import admin
from .views import get_user_data, register_user, LogoutView, TransactionViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path,include
from . import views
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, register_user, get_user_data, MyTokenObtainPairView, TransactionReportView



router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'transactions', TransactionViewSet, basename='transaction')

urlpatterns = [
    path('me/', get_user_data, name='user-data'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path("logout/", LogoutView.as_view()),
    path('transactions/report/', TransactionReportView.as_view(), name='transactions-report'),
    path('', include(router.urls)), 
]














# from django.urls import path, include
# from rest_framework.routers import DefaultRouter
# from .views import (
#     UserViewSet,
#     register_user,
#     get_user_data,
#     TransactionViewSet,
#     TransactionReportView
# )

# # Création du routeur pour les vues basées sur ViewSet
# router = DefaultRouter()
# router.register(r'users', UserViewSet, basename='user')
# router.register(r'transactions', TransactionViewSet, basename='transaction')

# # Définition des routes publiques
# urlpatterns = [
#     path('register/', register_user, name='register_user'),
#     path('me/', get_user_data, name='user_data'),
#     path('transactions/report/', TransactionReportView.as_view(), name='transactions_report'),
#     path('', include(router.urls)),
# ]
