# from . import views 
# from django.conf import settings 
# from django.urls import path, include 
# from django.conf.urls.static import static

# urlpatterns = [ path('', views.index, name='index'), ]
from . import views
from django.urls import re_path
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # toutes les routes non gérées par Django vont vers React
    re_path(r'^.*$', views.index, name='index'),
]

# si tu as des fichiers statiques à servir en développement
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
