from django.urls import path
from .views import (
    ListaPropiedadesAPIView,
    FiltrarPropiedadesAPIView,
    BuscarPropiedadesAPIView,
)

urlpatterns = [
    path('', ListaPropiedadesAPIView.as_view(), name='lista_propiedades'),
    path('filtrar/', FiltrarPropiedadesAPIView.as_view(), name='filtrar_propiedades'),
    path('buscar/', BuscarPropiedadesAPIView.as_view(), name='buscar_propiedades'),
]
