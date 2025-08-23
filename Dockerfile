# 1️⃣ Image de base
FROM python:3.12-slim

# 2️⃣ Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3️⃣ Créer le répertoire de l'app
WORKDIR /app

# 4️⃣ Installer dépendances système
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 5️⃣ Copier requirements
COPY Server/requirements.txt /app/

# 6️⃣ Installer dépendances Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn

# 7️⃣ Copier tout le projet Django
COPY Server /app

# 8️⃣ Copier le build React
# Assure-toi que le build React est dans Administrator/build
COPY Administrator/build /app/Administrator/build

# 9️⃣ Collecte des fichiers statiques Django
RUN python manage.py collectstatic --noinput

# 🔟 Exposer le port Django
EXPOSE 8000

# 1️⃣1️⃣ Lancer le serveur avec Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "transfert.wsgi:application"]
