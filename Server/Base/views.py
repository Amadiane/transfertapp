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




# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('id')
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  # uniquement utilisateurs connectés

    def list(self, request, *args, **kwargs):
        """ GET : récupérer tous les utilisateurs """
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """ PUT/PATCH : modifier un utilisateur """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        """ DELETE : supprimer un utilisateur """
        instance = self.get_object()
        instance.delete()
        return Response({"message": "Utilisateur supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)



















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


#transaction
# views.py
from rest_framework import generics, permissions
from .models import Transaction
from .serializers import TransactionSerializer

from rest_framework.permissions import IsAuthenticated

class TransactionListCreateView(generics.ListCreateAPIView):
    queryset = Transaction.objects.all().order_by('-date_transfert')
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # On force sender à être l'utilisateur connecté
        serializer.save(sender=self.request.user)


class TransactionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

#1. Afficher le résultat (transaction) juste après un POST
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_transaction(request):
    data = request.data.copy()
    data['sender'] = request.user.id  # IMPORTANT : fixe le sender à l'utilisateur connecté
    serializer = TransactionSerializer(data=data)
    if serializer.is_valid():
        serializer.save(sender=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


#A. Créer une vue pour lister toutes les transactions
@api_view(['GET'])
def list_transactions(request):
    transactions = Transaction.objects.all().order_by('-date_transfert')
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)


#Trasaction reçu à afficher chez tous les utilisateurs
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_received_transactions(request):
    # On récupère toutes les transactions reçues par tous
    # Si tu veux filtrer par utilisateur, par ex. pour un employé, tu ferais request.user
    transactions = Transaction.objects.all()
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data)

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Transaction
from .serializers import TransactionSerializer

@method_decorator(csrf_exempt, name='dispatch')
class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAdminUser]

    @action(detail=True, methods=['patch'])
    def distribuer(self, request, pk=None):
        transaction = self.get_object()
        if transaction.is_distribue:
            return Response({'detail': 'Transaction déjà distribuée.'}, status=status.HTTP_400_BAD_REQUEST)
        transaction.is_distribue = True
        transaction.save()
        return Response({'detail': 'Transaction marquée comme distribuée.'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'])
    def annuler_distribution(self, request, pk=None):
        transaction = self.get_object()
        if not transaction.is_distribue:
            return Response({'detail': 'Transaction non distribuée.'}, status=status.HTTP_400_BAD_REQUEST)
        transaction.is_distribue = False
        transaction.save()
        return Response({'detail': 'Distribution annulée.'}, status=status.HTTP_200_OK)



#Backend — Restreindre la modification uniquement aux admins

from rest_framework.permissions import IsAdminUser

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def update_transaction(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction non trouvée"}, status=404)
    
    serializer = TransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)



#modifier et supprimer une transaction

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Transaction
from .serializers import TransactionSerializer

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAdminUser])  # Seuls les admins peuvent modifier
def update_transaction(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction non trouvée"}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = TransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])  # Seuls les admins peuvent supprimer
def delete_transaction(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction non trouvée"}, status=status.HTTP_404_NOT_FOUND)

    transaction.delete()
    return Response({"message": "Transaction supprimée avec succès"}, status=status.HTTP_204_NO_CONTENT)












