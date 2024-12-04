from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from django.db import transaction
from django.contrib.auth import get_user_model
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
from rest_framework.parsers import MultiPartParser, JSONParser

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
    #permission_classes = [IsAdminUser]

    def get(self, request):
        users = get_user_model().objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

# Obtener detalles de un usuario específico


class UserDetailView(APIView):
#    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user)
        return Response(serializer.data)

# Actualizar un usuario


class UserUpdateView(APIView):
 #   permission_classes = [IsAuthenticated]

    def put(self, request, pk):
        user = get_object_or_404(get_user_model(), pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Eliminar un usuario


class UserDeleteView(APIView):
  #  permission_classes = [IsAdminUser]

    def delete(self, request, pk):
        user = get_object_or_404(get_user_model(), pk=pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

### 2. CRUD para Propiedad ###


class PropiedadCreateView(APIView):
   # permission_classes = [IsAuthenticated]

    def post(self, request): 
        print(request.data['usuario'])
        serializer = PropiedadSerializer(data=request.data)
       
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Listar propiedades


class PropiedadListView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        # Usamos prefetch_related con el nombre correcto de la relación 'clasificacion'
        propiedades = Propiedad.objects.prefetch_related(
            'clasificacion'  # Aquí usamos el 'related_name' que definimos en el modelo
        ).all()

        # Serializar las propiedades
        propiedad_data = []
        for propiedad in propiedades:
            # Obtenemos la clasificación asociada a la propiedad
            clasificacion = propiedad.clasificacion.first()  # Accedemos al primer elemento relacionado
            estado_propiedad = clasificacion.estado_propiedad if clasificacion else None
            propiedad_serialized = PropiedadSerializer(propiedad).data
            propiedad_serialized['estado_propiedad'] = estado_propiedad
            propiedad_data.append(propiedad_serialized)

        return Response(propiedad_data)

# Detalle de propiedad


class PropiedadDetailView(APIView):
 #   permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        propiedad = get_object_or_404(Propiedad, pk=pk)
        serializer = PropiedadSerializer(propiedad)
        return Response(serializer.data)

# Actualizar propiedad


class PropiedadUpdateView(APIView):
#    permission_classes = [IsAuthenticated]

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
 #   permission_classes = [IsAuthenticated]

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
  #  permission_classes = [IsAuthenticated]
   # parser_classes = [MultiPartParser, JSONParser]

    @transaction.atomic
    def post(self, request):
        # Procesar la propiedad como JSON
        propiedad_blob = request.data.get("propiedad")
        if not propiedad_blob:
            return Response({"error": "El campo 'propiedad' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            propiedad_data = json.loads(propiedad_blob.read().decode("utf-8"))
        except json.JSONDecodeError:
            return Response({"error": "El campo 'propiedad' no es un JSON válido."}, status=status.HTTP_400_BAD_REQUEST)

        # Extraer y validar otros datos del request
        foto_frontal = request.data.get("foto_frontal")
        servicios_data = request.data.get("services", None)
        classification_data = request.data.get("classification", None)
        fotos_adicionales_data = request.data.get("fotos_adicionales", None)

        # Insertar Propiedad
        propiedad_serializer = PropiedadSerializer(data={
            **propiedad_data,
            "usuario": request.user.id,
        })

        if not propiedad_serializer.is_valid():
            return Response(propiedad_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        propiedad = propiedad_serializer.save(foto_frontal=foto_frontal)

        # Insertar Servicios
        if servicios_data:
            servicios = json.loads(servicios_data)
            servicios_serializer = ServiciosSerializer(
                data={**servicios, "propiedad_id": propiedad.id})
            if not servicios_serializer.is_valid():
                raise transaction.Rollback
            servicios_serializer.save()

        # Insertar Clasificación
        if classification_data:
            classification = json.loads(classification_data)
            classification_serializer = ClasificacionSerializer(
                data={**classification, "propiedad_id": propiedad.id})
            if not classification_serializer.is_valid():
                raise transaction.Rollback
            classification_serializer.save()

        # Insertar Fotos Adicionales
        if fotos_adicionales_data:
            fotos = json.loads(fotos_adicionales_data)
            for foto in fotos:
                foto_serializer = FotoAdicionalSerializer(
                    data={**foto, "propiedad_id": propiedad.id})
                if not foto_serializer.is_valid():
                    raise transaction.Rollback
                foto_serializer.save()

        return Response({"message": "Propiedad creada con éxito."}, status=status.HTTP_201_CREATED)


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
