# propiedades/serializers.py
from rest_framework import serializers
from .models import Propiedad

class PropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = ['propiedad_id', 'titulo', 'precio', 'foto_frontal', 'direccion', 'tamano_m2']
