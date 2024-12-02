import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import SolicitudCompra, HistorialSolicitud
from .serializers import SolicitudCompraSerializer, HistorialSolicitudSerializer

# --------------------
# Vistas manuales
# --------------------

@method_decorator(csrf_exempt, name='dispatch')
class SolicitudCompraAPI(APIView):
    def get(self, request):
        # Obtener todas las solicitudes
        solicitudes = list(SolicitudCompra.objects.values())
        return JsonResponse(solicitudes, safe=False)

    def post(self, request):
        # Crear una nueva solicitud
        try:
            data = json.loads(request.body)
            solicitud = SolicitudCompra.objects.create(
                propiedad_id=data['propiedad_id'],
                usuario_id=data['usuario_id'],
                estado_solicitud=data['estado_solicitud']
            )
            return JsonResponse({'id': solicitud.id, 'mensaje': 'Solicitud creada correctamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


@method_decorator(csrf_exempt, name='dispatch')
class HistorialSolicitudAPI(APIView):
    def get(self, request):
        # Obtener todo el historial
        historial = list(HistorialSolicitud.objects.values())
        return JsonResponse(historial, safe=False)

    def post(self, request):
        # Crear un nuevo registro de historial
        try:
            data = json.loads(request.body)
            historial = HistorialSolicitud.objects.create(
                solicitud_id=data['solicitud_id'],
                estado_anterior=data['estado_anterior'],
                estado_nuevo=data['estado_nuevo'],
                comentarios=data.get('comentarios', '')
            )
            return JsonResponse({'id': historial.id, 'mensaje': 'Historial creado correctamente'}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)


# --------------------
# Vistas con ModelViewSet (DRF)
# --------------------

class SolicitudCompraViewSet(ModelViewSet):
    queryset = SolicitudCompra.objects.all()
    serializer_class = SolicitudCompraSerializer


class HistorialSolicitudViewSet(ModelViewSet):
    queryset = HistorialSolicitud.objects.all()
    serializer_class = HistorialSolicitudSerializer