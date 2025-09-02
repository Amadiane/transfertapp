# # from django.shortcuts import render
# from django.http import HttpResponse
# import os

# def index(request):
#     # Chemin correct vers le build frontend
#     frontend_build_path = os.path.join(os.path.dirname(__file__), "..", "..", "Administrator", "build", "index.html")
    
#     if not os.path.exists(frontend_build_path):
#         return HttpResponse("Fichier index.html introuvable.", status=404)
    
#     with open(frontend_build_path, "r", encoding="utf-8") as f:
#         return HttpResponse(f.read())
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
import os

def index(request):
    """
    Sert le fichier index.html de React pour toutes les routes,
    afin que React Router gère le routage côté client.
    """
    # Chemin absolu vers le build React
    path_to_index = os.path.join(
        os.path.dirname(__file__), "..", "..", "Administrator", "build", "index.html"
    )

    if os.path.exists(path_to_index):
        with open(path_to_index, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    else:
        return HttpResponseNotFound("index.html introuvable. Vérifie le chemin de build React.")
