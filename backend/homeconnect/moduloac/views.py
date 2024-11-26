from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.db import transaction
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.parsers import MultiPartParser, JSONParser
from .models import Propiedad, FotoAdicional, ClasificacionPropiedad, Servicios
from .serializers import (
    PropiedadSerializer,
    FotoAdicionalSerializer,
    ClasificacionPropiedadSerializer,
    ServiciosSerializer, UserSerializer,
)
import json

### 1. CRUD para Usuario ###


class UserCreateView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar todos los usuarios


class UserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# Obtener detalles de un usuario específico


class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

# Actualizar un usuario


class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar un usuario


class UserDeleteView(APIView):
    permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

### 2. CRUD para Propiedad ###


class PropiedadCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.data['usuario'] = request.user.id
        serializer = PropiedadSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar propiedades


class PropiedadListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        propiedades = Propiedad.objects.all()
        serializer = PropiedadSerializer(propiedades, many=True)
        return Response(serializer.data)

# Detalle de propiedad


class PropiedadDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        serializer = PropiedadSerializer(propiedad)
        return Response(serializer.data)

# Actualizar propiedad


class PropiedadUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        serializer = PropiedadSerializer(
            propiedad, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar propiedad


class PropiedadDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        propiedad.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

### 3. CRUD para FotoAdicional ###

# Registrar foto adicional


@api_view(['POST'])
def registrar_foto(request):
    serializer = FotoAdicionalSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar fotos adicionales


@api_view(['GET'])
def listar_fotos(request):
    fotos = FotoAdicional.objects.all()
    serializer = FotoAdicionalSerializer(fotos, many=True)
    return Response(serializer.data)

# Detalles foto adicional


@api_view(['GET'])
def detalles_foto(request, foto_id):
    foto = get_object_or_404(FotoAdicional, id=foto_id)
    serializer = FotoAdicionalSerializer(foto)
    return Response(serializer.data)

# Actualizar foto adicional


@api_view(['PUT', 'PATCH'])
def actualizar_foto(request, foto_id):
    foto = get_object_or_404(FotoAdicional, id=foto_id)
    serializer = FotoAdicionalSerializer(foto, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar foto adicional


@api_view(['DELETE'])
def eliminar_foto(request, foto_id):
    foto = get_object_or_404(FotoAdicional, id=foto_id)
    foto.delete()
    return Response({"message": "Foto eliminada exitosamente."}, status=status.HTTP_204_NO_CONTENT)


### 4. CRUD para ClasificacionPropiedad ###

# Registrar clasificación
@api_view(['POST'])
def registrar_clasificacion(request):
    serializer = ClasificacionPropiedadSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar clasificaciones


@api_view(['GET'])
def listar_clasificaciones(request):
    clasificaciones = ClasificacionPropiedad.objects.all()
    serializer = ClasificacionPropiedadSerializer(clasificaciones, many=True)
    return Response(serializer.data)

# Detalles clasificación


@api_view(['GET'])
def detalles_clasificacion(request, clasificacion_id):
    clasificacion = get_object_or_404(
        ClasificacionPropiedad, id=clasificacion_id)
    serializer = ClasificacionPropiedadSerializer(clasificacion)
    return Response(serializer.data)

# Actualizar clasificación


@api_view(['PUT', 'PATCH'])
def actualizar_clasificacion(request, clasificacion_id):
    clasificacion = get_object_or_404(
        ClasificacionPropiedad, id=clasificacion_id)
    serializer = ClasificacionPropiedadSerializer(
        clasificacion, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar clasificación


@api_view(['DELETE'])
def eliminar_clasificacion(request, clasificacion_id):
    clasificacion = get_object_or_404(
        ClasificacionPropiedad, id=clasificacion_id)
    clasificacion.delete()
    return Response({"message": "Clasificación eliminada exitosamente."}, status=status.HTTP_204_NO_CONTENT)


### 5. CRUD para Servicios ###

# Registrar servicios
@api_view(['POST'])
def registrar_servicios(request):
    serializer = ServiciosSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar servicios


@api_view(['GET'])
def listar_servicios(request):
    servicios = Servicios.objects.all()
    serializer = ServiciosSerializer(servicios, many=True)
    return Response(serializer.data)

# Detalles servicios


@api_view(['GET'])
def detalles_servicios(request, servicio_id):
    servicio = get_object_or_404(Servicios, id=servicio_id)
    serializer = ServiciosSerializer(servicio)
    return Response(serializer.data)

# Actualizar servicios


@api_view(['PUT', 'PATCH'])
def actualizar_servicios(request, servicio_id):
    servicio = get_object_or_404(Servicios, id=servicio_id)
    serializer = ServiciosSerializer(servicio, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar servicios


@api_view(['DELETE'])
def eliminar_servicios(request, servicio_id):
    servicio = get_object_or_404(Servicios, id=servicio_id)
    servicio.delete()
    return Response({"message": "Servicios eliminados exitosamente."}, status=status.HTTP_204_NO_CONTENT)


# CREAR PROPIEDADD COMPLETA
class PropiedadCompletaCreateView(APIView):
    """
    Crea una propiedad con sus fotos adicionales, clasificaciones y servicios.
    """
    parser_classes = (
        MultiPartParser, JSONParser)  # Permite manejar archivos y JSON

    @transaction.atomic
    def post(self, request):
        try:
            # Extraer y procesar la información de la propiedad
            propiedad_data = request.data.get('propiedad')
            if not propiedad_data:
                return Response({'error': 'El campo "propiedad" es obligatorio.'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Convertir string JSON a dict
                propiedad_data = json.loads(propiedad_data)
            except Exception as e:
                return Response({'error': f'Error al procesar "propiedad": {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

            propiedad_serializer = PropiedadSerializer(data=propiedad_data)
            propiedad_serializer.is_valid(raise_exception=True)
            propiedad = propiedad_serializer.save()

            # Procesar fotos adicionales
            fotos_data = request.data.getlist(
                'fotos_adicionales')  # Manejar múltiples archivos
            for foto_file in fotos_data:
                foto_serializer = FotoAdicionalSerializer(
                    data={'propiedad': propiedad.id, 'foto': foto_file})
                foto_serializer.is_valid(raise_exception=True)
                foto_serializer.save()

            # Procesar clasificaciones
            clasificaciones_data = request.data.get('clasificacion', [])
            if isinstance(clasificaciones_data, str):
                clasificaciones_data = json.loads(clasificaciones_data)
            for clasificacion in clasificaciones_data:
                clasificacion['propiedad'] = propiedad.id
                clasificacion_serializer = ClasificacionPropiedadSerializer(
                    data=clasificacion)
                clasificacion_serializer.is_valid(raise_exception=True)
                clasificacion_serializer.save()

            # Procesar servicios
            servicios_data = request.data.get('servicios')
            if servicios_data:
                if isinstance(servicios_data, str):
                    servicios_data = json.loads(servicios_data)
                servicios_data['propiedad'] = propiedad.id
                servicios_serializer = ServiciosSerializer(data=servicios_data)
                servicios_serializer.is_valid(raise_exception=True)
                servicios_serializer.save()

            # Estructurar la respuesta
            response_data = {
                'propiedad': propiedad_serializer.data,
                'fotos_adicionales': [f.foto.url for f in propiedad.fotos_adicionales.all()],
                'clasificacion': clasificaciones_data,
                'servicios': servicios_data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)

        except Exception as e:
            transaction.set_rollback(True)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PropiedadDetalleAPIView(APIView):
    """
    Devuelve toda la información relacionada con una propiedad, dada su ID.
    """

    def get(self, request, propiedad_id):
        # Obtener la propiedad o devolver un error 404 si no existe
        propiedad = get_object_or_404(Propiedad, id=propiedad_id)

        # Serializar la información principal de la propiedad
        propiedad_serializer = PropiedadSerializer(propiedad)

        # Serializar las fotos adicionales
        fotos_adicionales = propiedad.fotos_adicionales.all()
        fotos_serializer = FotoAdicionalSerializer(
            fotos_adicionales, many=True)

        # Serializar la clasificación
        clasificacion = propiedad.clasificacion.all()
        clasificacion_serializer = ClasificacionPropiedadSerializer(
            clasificacion, many=True)

        # Serializar los servicios (si existen)
        servicios = getattr(propiedad, 'servicios', None)
        servicios_serializer = ServiciosSerializer(
            servicios).data if servicios else None

        # Estructurar la respuesta
        response_data = {
            'propiedad': propiedad_serializer.data,
            'fotos_adicionales': fotos_serializer.data,
            'clasificacion': clasificacion_serializer.data,
            'servicios': servicios_serializer,
        }

        return Response(response_data, status=status.HTTP_200_OK)
