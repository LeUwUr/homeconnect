from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings

class UsuarioManager(BaseUserManager):
    def create_user(self, correo_electronico, nombre, contrasena=None, **extra_fields):
        if not correo_electronico:
            raise ValueError('El correo electrónico es obligatorio')
        correo_electronico = self.normalize_email(correo_electronico)
        extra_fields.setdefault('is_active', True)
        user = self.model(correo_electronico=correo_electronico, nombre=nombre, **extra_fields)
        user.set_password(contrasena)
        user.save(using=self._db)
        return user

    def create_superuser(self, correo_electronico, nombre, contrasena=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(correo_electronico, nombre, contrasena, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    usuario_id = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    tipo_usuario = models.CharField(
        max_length=20,
        choices=[('Comprador', 'Comprador'), ('Administrador', 'Administrador')],
    )
    contrasena = models.CharField(max_length=255)  # No se usará directamente
    fecha_registro = models.DateTimeField(auto_now_add=True)
    eliminado = models.BooleanField(default=False)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = 'correo_electronico'
    REQUIRED_FIELDS = ['nombre']

    class Meta:
        db_table = 'usuarios'

    def __str__(self):
        return self.correo_electronico

class Propiedad(models.Model):
    titulo = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    foto_frontal = models.TextField(blank=True, null=True)
    disponibilidad = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=255)
    tamano_m2 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    estado = models.CharField(max_length=50, blank=True, null=True)
    fecha_adquisicion = models.DateField(blank=True, null=True)
    fecha_venta = models.DateField(blank=True, null=True)
    fecha_publicacion = models.DateField(blank=True, null=True)
    eliminado = models.BooleanField(default=False)
    usuario = models.ForeignKey('Usuario', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        db_table = 'propiedades'

    def __str__(self):
        return self.titulo

class Oferta(models.Model):
    propiedad = models.ForeignKey('Propiedad', on_delete=models.CASCADE, related_name='ofertas')
    descuento = models.DecimalField(max_digits=5, decimal_places=2, null=False, default=0.00)
    descripcion = models.TextField(default='La oferta se cerrará dentro de poco',null=False)
    precio_ofrecido = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  
    estado_oferta = models.CharField(
        max_length=20,
        choices=[('pendiente', 'Pendiente'), ('aceptada', 'Aceptada'), ('rechazada', 'Rechazada')],
        default='pendiente'
    )  
    fecha_oferta = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.propiedad.nombre} - {self.descuento}%"

    class Meta:
        db_table = 'ofertas'


class Conversacion(models.Model):
    comprador = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='conversaciones_comprador'
    )
    agente = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='conversaciones_agente'
    )
    propiedad = models.ForeignKey('Propiedad', on_delete=models.CASCADE)  
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'conversaciones'

    def __str__(self):
        return f"Conversación entre {self.comprador} y {self.agente} sobre {self.propiedad.titulo}"

class Mensaje(models.Model):
    conversacion = models.ForeignKey(Conversacion, on_delete=models.CASCADE, related_name='mensajes')
    remitente = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    texto = models.TextField()
    fecha_envio = models.DateTimeField(auto_now_add=True)
    visto = models.BooleanField(default=False)

    class Meta:
        db_table = 'mensajes'

    def __str__(self):
        return f"Mensaje de {self.remitente} en {self.fecha_envio.strftime('%Y-%m-%d %H:%M:%S')}"
