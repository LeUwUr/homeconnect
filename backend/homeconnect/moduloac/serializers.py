from rest_framework import serializers
from .models import Propiedad, FotoAdicional, ClasificacionPropiedad, Servicios
from django.contrib.auth import get_user_model
from django.conf import settings

class PropiedadSerializer(serializers.ModelSerializer):
    usuario = serializers.PrimaryKeyRelatedField(queryset=get_user_model().objects.all())

    class Meta:
        model = Propiedad
        fields = '__all__'


class FotoAdicionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotoAdicional
        fields = '__all__'


class ClasificacionPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ClasificacionPropiedad
        fields = '__all__'


class ServiciosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicios
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = get_user_model()  # Asegúrate de que sea tu modelo 'Usuario'
        fields = ['usuario_id', 'nombre', 'correo_electronico', 'password', 'telefono', 'tipo_usuario', 'is_staff', 'fecha_registro', 'eliminado']

    def create(self, validated_data):
        # Crear usuario con contraseña encriptada
        user = get_user_model().objects.create_user(
            correo_electronico=validated_data['correo_electronico'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),
            telefono=validated_data.get('telefono', ''),
            tipo_usuario=validated_data.get('tipo_usuario', 'Comprador')
        )
        return user

    def update(self, instance, validated_data):
        # Actualizar información del usuario
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.correo_electronico = validated_data.get('correo_electronico', instance.correo_electronico)
        instance.telefono = validated_data.get('telefono', instance.telefono)
        instance.tipo_usuario = validated_data.get('tipo_usuario', instance.tipo_usuario)

        # Verificar si se está actualizando la contraseña
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance
