from django.shortcuts import render
from django.http import HttpResponse
import os

def index(request):
    with open(os.path.join(os.path.dirname(__file__), "..", "Administrator", "build", "index.html")) as f:
        return HttpResponse(f.read())
