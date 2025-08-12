from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('employe', 'Employé'),
    )
    email = models.EmailField(unique=True)
    ville = models.CharField(max_length=100, blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='employe')

    REQUIRED_FIELDS = ['email', 'ville', 'role']
    USERNAME_FIELD = 'username'  # ou 'email' si tu préfères l'email comme identifiant

    def __str__(self):
        return f"{self.username} ({self.role})"


#transaction

from django.db import models

class Transaction(models.Model):
    DEVISES = [
        ('USD', 'Dollar Américain'),
        ('EUR', 'Euro'),
        ('CAD', 'Dollar Canadien'),
        ('SAR', 'Riyal Saoudien'),
        ('GNF', 'Franc Guinéen'),
    ]

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,      # référence le modèle User
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='transactions_envoyees'
    )

    devise_envoyee = models.CharField(max_length=3, choices=DEVISES)
    montant_envoye = models.DecimalField(max_digits=12, decimal_places=2)
    pourcentage_gain = models.DecimalField(max_digits=5, decimal_places=2)
    montant_converti = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    devise_recue = models.CharField(max_length=3, choices=DEVISES)
    montant_remis = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    gain_transfert = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    beneficiaire_nom = models.CharField(max_length=255, blank=True, null=True)  
    numero_destinataire = models.CharField(max_length=20)
    date_transfert = models.DateTimeField(auto_now_add=True)
    remarques = models.TextField(blank=True, null=True)
    is_distribue = models.BooleanField(default=False)
    distributeur = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='transactions_distribuees')

    def __str__(self):
        return f"{self.montant_envoye} {self.devise_envoyee} → {self.devise_recue}"
