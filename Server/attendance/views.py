from django.shortcuts import render
from pathlib import Path
from django.conf import settings

def index(request):
    return render(request, "index.html")  # Django cherchera dans TEMPLATES['DIRS']
