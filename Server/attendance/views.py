# from django.shortcuts import render
from django.http import HttpResponse
import os

def index(request):
    # Chemin correct vers le build frontend
    frontend_build_path = os.path.join(os.path.dirname(__file__), "..", "..", "Administrator", "build", "index.html")
    
    if not os.path.exists(frontend_build_path):
        return HttpResponse("Fichier index.html introuvable.", status=404)
    
    with open(frontend_build_path, "r", encoding="utf-8") as f:
        return HttpResponse(f.read())
