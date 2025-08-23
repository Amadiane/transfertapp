# Étape 0 : build React
FROM node:20-alpine as react-build
WORKDIR /app
COPY Administrator/package*.json ./
RUN npm install
COPY Administrator/ ./
RUN npm run build

# Étape 1 : Django
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dépendances système
RUN apt-get update && apt-get install -y \
    default-libmysqlclient-dev \
    build-essential \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Copier requirements et installer Python
COPY Server/requirements.txt /app/
RUN pip install --upgrade pip
RUN pip install -r requirements.txt
RUN pip install gunicorn

# Copier projet Django
COPY Server /app

# Copier build React depuis l’étape 0
COPY --from=react-build /app/build /app/Administrator/build

# Collecte fichiers statiques
RUN python manage.py collectstatic --noinput

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "transfert.wsgi:application"]
