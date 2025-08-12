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

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from django.utils.timezone import now
from .models import Transaction
from .serializers import TransactionSerializer

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all().order_by('-date_transfert')
    serializer_class = TransactionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['patch'])
    def distribuer(self, request, pk=None):
        transaction = self.get_object()
        if transaction.is_distribue:
            return Response({'detail': 'Transaction déjà distribuée.'}, status=status.HTTP_400_BAD_REQUEST)
        transaction.is_distribue = True
        transaction.distributeur = request.user
        transaction.date_distribution = now()
        transaction.save()
        return Response({'detail': 'Transaction distribuée avec succès.'})

    @action(detail=True, methods=['patch'], permission_classes=[IsAdminUser])
    def annuler_distribution(self, request, pk=None):
        transaction = self.get_object()
        if not transaction.is_distribue:
            return Response({"error": "La transaction n'est pas distribuée."}, status=status.HTTP_400_BAD_REQUEST)
        transaction.is_distribue = False
        transaction.distributeur = None
        transaction.date_distribution = None
        transaction.save()
        return Response({"message": "Distribution annulée avec succès"}, status=status.HTTP_200_OK)







from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now
from django.db.models import Sum, Count
from django.db.models.functions import TruncDay, TruncWeek, TruncMonth, TruncYear
from .models import Transaction
from datetime import timedelta


class TransactionReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        period = request.query_params.get('period', 'day')
        user = request.user
        # Si admin, on peut faire rapport sur toutes les transactions,
        # sinon seulement sur celles de l'utilisateur
        if user.is_staff:
            qs = Transaction.objects.all()
        else:
            qs = Transaction.objects.filter(sender=user)

        now_dt = now()

        # On tronque la date selon la période
        if period == 'day':
            qs = qs.filter(date_transfert__date=now_dt.date())
        elif period == 'week':
            # La semaine ISO (lundi-dimanche)
            # Filtrer la date entre le début de la semaine et maintenant
            start_week = now_dt - timedelta(days=now_dt.weekday())
            qs = qs.filter(date_transfert__date__gte=start_week.date())
        elif period == 'month':
            qs = qs.filter(date_transfert__year=now_dt.year, date_transfert__month=now_dt.month)
        elif period == 'year':
            qs = qs.filter(date_transfert__year=now_dt.year)
        else:
            return Response({"error": "Période invalide"}, status=400)

        total_transactions = qs.count()
        total_montant_envoye = qs.aggregate(Sum('montant_envoye'))['montant_envoye__sum'] or 0
        total_montant_remis = qs.aggregate(Sum('montant_remis'))['montant_remis__sum'] or 0
        total_gain = qs.aggregate(Sum('gain_transfert'))['gain_transfert__sum'] or 0

        data = {
            "total_transactions": total_transactions,
            "total_montant_envoye": total_montant_envoye,
            "total_montant_remis": total_montant_remis,
            "total_gain": total_gain,
        }

        return Response(data)


from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from .models import Transaction
from django.utils.timezone import now, timedelta

class TransactionReportTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(username='admin', password='pass', is_staff=True)
        self.user = User.objects.create_user(username='user', password='pass')
        # Transactions pour user
        Transaction.objects.create(sender=self.user, date_transfert=now(), montant_envoye=100, montant_remis=95, gain_transfert=5)
        Transaction.objects.create(sender=self.user, date_transfert=now() - timedelta(days=2), montant_envoye=200, montant_remis=190, gain_transfert=10)
        # Transaction pour un autre utilisateur
        other_user = User.objects.create_user(username='other', password='pass')
        Transaction.objects.create(sender=other_user, date_transfert=now(), montant_envoye=300, montant_remis=290, gain_transfert=10)

    def test_report_day_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/transactions/report/?period=day')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total_transactions'], 1)  # Seulement celle du jour

    def test_report_day_admin(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/transactions/report/?period=day')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['total_transactions'], 2)  # Transactions du jour de tous les users

    def test_report_invalid_period(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get('/api/transactions/report/?period=invalid')
        self.assertEqual(response.status_code, 400)
