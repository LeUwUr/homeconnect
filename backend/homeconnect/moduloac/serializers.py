from rest_framework import serializers
from .models import Propiedad, FotoAdicional, ClasificacionPropiedad, Servicios
from django.contrib.auth.models import User
from django.conf import settings


class PropiedadSerializer(serializers.ModelSerializer):
    usuario_id = serializers.StringRelatedField()
    foto_frontal = serializers.ImageField(required=False)

    class Meta:
        model = Propiedad
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        if instance.foto_frontal:
            representation['foto_frontal'] = settings.MEDIA_URL + \
                str(instance.foto_frontal)

        return representation


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
        model = User
        fields = ['id', 'username', 'email', 'password',
                  'first_name', 'last_name', 'is_staff']

    def create(self, validated_data):
        # Crear usuario con contraseña encriptada
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user

    def update(self, instance, validated_data):
        # Actualizar información del usuario
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get(
            'first_name', instance.first_name)
        instance.last_name = validated_data.get(
            'last_name', instance.last_name)

        # Verificar si se está actualizando la contraseña
        password = validated_data.get('password', None)
        if password:
            instance.set_password(password)

        instance.save()
        return instance
