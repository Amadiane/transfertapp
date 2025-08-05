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


#L'ajout du club

class Club(models.Model):
    name = models.CharField(max_length=100, unique=True)
    logo = models.ImageField(upload_to='club_logos/', blank=True, null=True)

    def __str__(self):
        return self.name