from pathlib import Path
from datetime import timedelta
import os
from django.core.management.utils import get_random_secret_key

BASE_DIR = Path(__file__).resolve().parent.parent

# ------------------------
# Sécurité
# ------------------------
# SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())
# DEBUG = False
#ALLOWED_HOSTS = ["102.164.134.4", "127.0.0.1"]  # Ton IP publique et localhost
#ALLOWED_HOSTS = ["diallodiallotransfert.com", "www.diallodiallotransfert.com", "102.164.134.4", "127.0.0.1"]
#ALLOWED_HOSTS = ["127.0.0.1", "localhost", "102.164.134.4"]
#ALLOWED_HOSTS = ['*']
# ALLOWED_HOSTS = ['.onrender.com']


# ----------------------
# Security settings
# ----------------------
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", get_random_secret_key())
DEBUG = False
ALLOWED_HOSTS = ['.onrender.com']

SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

CSRF_TRUSTED_ORIGINS = os.getenv("CSRF_TRUSTED_ORIGINS", "https://ton-backend.onrender.com").split(',')



AUTH_USER_MODEL = 'Base.User'

# ------------------------
# CORS
# ------------------------
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # l'URL de ton frontend React
    # "http://102.164.134.4:8000",
    #"http://diallodiallotransfert.com",
]
# CORS_ALLOWED_ORIGINS = [
#     "http://102.164.134.4",  # ton IP publique
# ]





CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    #"http://102.164.134.4:3000",
    #"http://diallodiallotransfert.com",
    #"https://diallodiallotransfert.com",
]



# CSRF_TRUSTED_ORIGINS = [
#     "http://102.164.134.4",
# ]

# ------------------------
# Apps
# ------------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'Base',
    'corsheaders',
    'rest_framework_simplejwt.token_blacklist',
    'attendance',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

]

ROOT_URLCONF = 'transfert.urls'



# TEMPLATES = [
#     {
#         'BACKEND': 'django.template.backends.django.DjangoTemplates',
#         #'DIRS': [TEMPLATES_DIR],
#         "DIRS": [os.path.join(BASE_DIR, "administrator")],
#         'APP_DIRS': True,
#         'OPTIONS': {
#             'context_processors': [
#                 'django.template.context_processors.debug',
#                 'django.template.context_processors.request',
#                 'django.contrib.auth.context_processors.auth',
#                 'django.contrib.messages.context_processors.messages',
#             ],
#         },
#     },
# ]
import os

TEMPLATES_DIR = os.path.join(BASE_DIR, "..", "Administrator", "build")

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [TEMPLATES_DIR],  # c'est ici qu'on met le build de React
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]



# ------------------------
# REST & JWT
# ------------------------
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'BLACKLIST_AFTER_ROTATION': True,
    'ROTATE_REFRESH_TOKENS': True,
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_BLACKLIST_ENABLED': True,
}

WSGI_APPLICATION = 'transfert.wsgi.application'

# ------------------------
# Base de données (locale MySQL)
# ------------------------
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.mysql',
#         'NAME': 'transfertdatabase',
#         'USER': 'amadou',
#         'PASSWORD': 'amadou',
#         'HOST': '127.0.0.1',
#         'PORT': '3306',
#         'OPTIONS': {
#             'init_command': "SET sql_mode='STRICT_TRANS_TABLES'"
#         }
#     }
# }
# import os

# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': os.environ.get('DB_NAME', 'transfertdatabase'),        # nom de la DB
#         'USER': os.environ.get('DB_USER', 'postgres'),    # utilisateur
#         'PASSWORD': os.environ.get('DB_PASSWORD', 'root'),           # mot de passe
#         'HOST': os.environ.get('DB_HOST', 'localhost'),# host
#         'PORT': os.environ.get('DB_PORT', '5432'),                      # port
#     }
# }
import dj_database_url
import os

DATABASES = {
    'default': dj_database_url.config(
        default='postgresql://transfertdatabase_user:393uvjd9mqqwB8CEt1Q2BcCC4UuAUpIS@dpg-d3mp8madbo4c73etqbug-a/transfertdatabase'
    )
}



# ------------------------
# Password validation
# ------------------------
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ------------------------
# Internationalisation
# ------------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ------------------------
# Static files
# ------------------------
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "..", "Administrator", "build", "static"),
]


#STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")

#STATICFILES_DIRS = [
#    BASE_DIR / "Administrator" / "build" / "static",
#]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
