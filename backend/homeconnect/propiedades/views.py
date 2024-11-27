# propiedades/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Propiedad

from .serializers import PropiedadSerializer

class ListaPropiedadesAPIView(APIView):
    def get(self, request):
        propiedades = Propiedad.objects.all()  # Sin filtros para verificar todos los datos
        serializer = PropiedadSerializer(propiedades, many=True)
        return Response(serializer.data)

class FiltrarPropiedadesAPIView(APIView):
    def get(self, request):
        filtros = {
            'pisos': request.GET.get('pisos'),
            'recamaras': request.GET.get('recamaras'),
            'banos': request.GET.get('banos'),
            'material': request.GET.get('material'),
        }

        propiedades = Propiedad.objects.all()

        if filtros['pisos']:
            propiedades = propiedades.filter(pisos=int(filtros['pisos']))
        if filtros['recamaras']:
            propiedades = propiedades.filter(recamaras=int(filtros['recamaras']))
        if filtros['banos']:
            propiedades = propiedades.filter(banos=int(filtros['banos']))
        if filtros['material']:
            propiedades = propiedades.filter(material=filtros['material'])

        serializer = PropiedadSerializer(propiedades, many=True)
        return Response(serializer.data)
    
class BuscarPropiedadesAPIView(APIView):
    def get(self, request):
        query = request.GET.get('query', '')
        propiedades = Propiedad.objects.filter(
            Q(titulo__icontains=query) |
            Q(direccion__icontains=query) |
            Q(material__icontains=query) |
            Q(estado__icontains=query)
        )
        serializer = PropiedadSerializer(propiedades, many=True)
        return Response(serializer.data)