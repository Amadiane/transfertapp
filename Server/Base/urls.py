from django.contrib import admin
from .views import get_user_data, register_user, LogoutView, create_transaction, list_transactions
from .views import MyTokenObtainPairView, TransactionListCreateView, TransactionRetrieveUpdateDestroyView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path,include
from . import views


from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, register_user, get_user_data, MyTokenObtainPairView, LogoutView
from rest_framework_simplejwt.views import TokenRefreshView


router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('me/', get_user_data, name='user-data'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name='register_user'),
    path("logout/", LogoutView.as_view()),
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionRetrieveUpdateDestroyView.as_view(), name='transaction-detail'),
    path('transactions/create/', create_transaction, name='create_transaction'),
    path('transactions/list/', list_transactions, name='list_transactions'),
    path('', include(router.urls)), 
]