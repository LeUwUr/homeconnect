from rest_framework import serializers
from .models import SolicitudCompra, HistorialSolicitud

class SolicitudCompraSerializer(serializers.ModelSerializer):
    class Meta:
        model = SolicitudCompra
        fields = '__all__'


class HistorialSolicitudSerializer(serializers.ModelSerializer):
    # Incluimos el detalle de la solicitud relacionada (opcional)
    solicitud_detalle = serializers.StringRelatedField(source='solicitud', read_only=True)

    class Meta:
        model = HistorialSolicitud
        fields = '__all__'