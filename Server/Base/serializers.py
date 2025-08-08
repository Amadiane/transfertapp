from rest_framework import serializers
from .models import User
from .utils import get_exchange_rates




class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'ville', 'role']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

#transaction

from rest_framework import serializers
from .models import Transaction
from decimal import Decimal, ROUND_HALF_UP
from .utils import get_exchange_rates

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('montant_converti', 'montant_remis', 'gain_transfert', 'date_transfert')

    def validate(self, data):
        devise_envoyee = data.get('devise_envoyee')
        devise_recue = data.get('devise_recue')
        montant_envoye = data.get('montant_envoye')
        pourcentage_gain = data.get('pourcentage_gain')

        rates = get_exchange_rates()

        # Validation simple
        if devise_envoyee not in rates or devise_recue not in rates:
            raise serializers.ValidationError("Devise envoyée ou reçue non prise en charge.")

        taux_envoyee = Decimal(str(rates[devise_envoyee]))
        taux_recue = Decimal(str(rates[devise_recue]))

        # Convertir montant envoyé en USD
        montant_usd = (montant_envoye / taux_envoyee).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP)

        # Convertir USD en devise reçue
        montant_converti = (montant_usd * taux_recue).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Calcul du gain en devise envoyée
        gain_envoyee = (montant_envoye * (pourcentage_gain / 100)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Convertir gain en USD
        gain_usd = (gain_envoyee / taux_envoyee).quantize(Decimal('0.0001'), rounding=ROUND_HALF_UP)

        # Convertir gain USD en devise reçue
        gain_converti = (gain_usd * taux_recue).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

        # Montant remis = montant converti + gain converti
        montant_remis = (montant_converti - gain_converti).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)


        # Affecter les valeurs calculées au validated data
        data['montant_converti'] = montant_converti
        data['gain_transfert'] = gain_converti
        data['montant_remis'] = montant_remis

        return data
