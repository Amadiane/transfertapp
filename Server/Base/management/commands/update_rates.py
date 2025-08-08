from django.core.management.base import BaseCommand
from Base.utils import update_exchange_rates

class Command(BaseCommand):
    help = "Met à jour les taux de change depuis l'API externe"

    def handle(self, *args, **kwargs):
        success = update_exchange_rates()
        if success:
            self.stdout.write(self.style.SUCCESS('Taux de change mis à jour avec succès.'))
        else:
            self.stdout.write(self.style.ERROR('Échec de la mise à jour des taux.'))
