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
from .serializers import ClubSerializer
from .models import Club







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


#ClubView



@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def club_list_create(request):
    if request.method == 'GET':
        clubs = Club.objects.all()
        serializer = ClubSerializer(clubs, many=True, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ClubSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def club_detail(request, pk):
    try:
        club = Club.objects.get(pk=pk)
    except Club.DoesNotExist:
        return Response({'detail': 'Club not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ClubSerializer(club, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ClubSerializer(club, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        club.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
