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


class Alerta(models.Model):
    ESTADOS_ALERTA = [
        ('no_leida', 'No Leída'),
        ('leida', 'Leída'),
        ('archivada', 'Archivada'),
    ]

    tipo_alerta = models.CharField(max_length=50)
    mensaje = models.TextField()
    fecha_alerta = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(max_length=20, choices=ESTADOS_ALERTA, default='no_leida')
    usuario = models.ForeignKey(
        'Usuario',  # Relaciona con el modelo de usuario existente en tu sistema.
        on_delete=models.CASCADE,
        related_name='alertas'
    )
    propiedad = models.ForeignKey(
        'Propiedad',  # Relaciona con el modelo de propiedades.
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='alertas'
    )
    cita = models.ForeignKey(
        'Cita',  # Relaciona con el modelo de citas.
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='alertas'
    )

    class Meta:
        db_table = 'alertas'

    def __str__(self):
        return f"{self.tipo_alerta} - {self.usuario.nombre}"


class Cita(models.Model):
    ESTADOS_CITA = [
        ('pendiente', 'Pendiente'),
        ('confirmada', 'Confirmada'),
        ('cancelada', 'Cancelada'),
        ('completada', 'Completada'),
    ]

    propiedad = models.ForeignKey(
        'Propiedad',  # Relaciona con el modelo de propiedades.
        on_delete=models.CASCADE,
        related_name='citas'
    )
    cliente = models.ForeignKey(
        'Usuario',  # Usuario interesado en la propiedad (rol: comprador).
        on_delete=models.CASCADE,
        related_name='citas'
    )
    fecha = models.DateField()
    hora = models.TimeField()
    estado = models.CharField(max_length=20, choices=ESTADOS_CITA, default='pendiente')
    observaciones = models.TextField(blank=True, null=True)  # Detalles adicionales sobre la cita.

    class Meta:
        db_table = 'citas'

    def __str__(self):
        return f"Cita para {self.propiedad.titulo} con {self.cliente.nombre} el {self.fecha} a las {self.hora}"
