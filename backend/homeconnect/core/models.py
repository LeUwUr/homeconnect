from django.db import models

class Usuario(models.Model):
    COMPRADOR = 'Comprador'
    ADMINISTRADOR = 'Administrador'

    TIPOS_USUARIO = [
        (COMPRADOR, 'Comprador'),
        (ADMINISTRADOR, 'Administrador'),
    ]

    nombre = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    tipo_usuario = models.CharField(max_length=15, choices=TIPOS_USUARIO)
    contrasena = models.CharField(max_length=255)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    eliminado = models.BooleanField(default=False)
    class Meta:
        db_table = 'usuarios'
    def __str__(self):
        return self.nombre



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