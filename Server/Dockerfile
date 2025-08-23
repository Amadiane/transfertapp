# 1️⃣ Image de base
FROM python:3.12-slim

# 2️⃣ Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3️⃣ Créer le répertoire de l'app
WORKDIR /app

# 4️⃣ Installer les dépendances système nécessaires pour mysqlclient
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# 5️⃣ Copier requirements
COPY requirements.txt /app/

# 6️⃣ Installer les dépendances Python
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 7️⃣ Copier tout le projet
COPY . /app/

# 8️⃣ Exposer le port Django
EXPOSE 8000

# 9️⃣ Commande pour lancer le serveur
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
