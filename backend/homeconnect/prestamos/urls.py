from django.urls import path
from .views import simulador_prestamos
from django.http import HttpResponse

urlpatterns = [
    path('simulador/', simulador_prestamos, name='simulador_prestamos'),

    # Otra ruta que puede ser el inicio, o simplemente puedes redirigir
    path('', lambda request: HttpResponse("Bienvenido a mi aplicación. Usa /simulador/ para acceder al simulador.")),
]