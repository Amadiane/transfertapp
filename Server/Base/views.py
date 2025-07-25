from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import viewsets, permissions, status, generics
from .serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView 





@method_decorator(csrf_exempt, name='dispatch')
class MyTokenObtainPairView(TokenObtainPairView):
    pass




@api_view(['POST'])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_data(request):
    user = request.user
    data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role,
    }
    return Response(data)


#LogoutView
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]  # Seuls les utilisateurs connectés peuvent se déconnecter

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]  # On récupère le refresh token du frontend
            token = RefreshToken(refresh_token)      # On instancie le token
            token.blacklist()                        # ❌ On le rend inutilisable en le mettant dans la blacklist
            return Response(status=status.HTTP_205_RESET_CONTENT)  # ✅ Déconnexion réussie
        except Exception as e:
            return Response({"detail": "Token invalide"}, status=status.HTTP_400_BAD_REQUEST)
