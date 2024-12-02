from django.db import models
from django.contrib.auth import get_user_model

class Propiedad(models.Model):
    usuario = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='propiedades')
    titulo = models.CharField(max_length=191)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    foto_frontal = models.ImageField(upload_to='propiedades/fotos_frontal/', blank=True, null=True) 
    disponibilidad = models.CharField(max_length=50, blank=True, null=True)
    direccion = models.CharField(max_length=191, blank=True, null=True)
    tamano_m2 = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    estado = models.CharField(max_length=50, blank=True, null=True)
    fecha_adquisicion = models.DateField(blank=True, null=True)
    fecha_venta = models.DateField(blank=True, null=True)
    fecha_publicacion = models.DateField(blank=True, null=True)
    eliminado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo

class FotoAdicional(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key numérica
    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE, related_name='fotos_adicionales')
    url_foto = models.ImageField(upload_to='propiedades/fotos_adicionales/')

    def __str__(self):
        return f"Foto de {self.propiedad.titulo}"

class ClasificacionPropiedad(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key numérica
    UBICACION_CHOICES = [
        ('Urbana', 'Urbana'),
        ('Rural', 'Rural'),
        ('En Fraccionamiento', 'En Fraccionamiento'),
    ]

    ESTADO_PROPIEDAD_CHOICES = [
        ('En negociación', 'En negociación'),
        ('Negociada', 'Negociada'),
        ('En espera', 'En espera'),
        ('Cancelada', 'Cancelada'),
        ('Activa', 'Activa'),
    ]

    PRIVADA_CHOICES = [
        ('Cerrada', 'Cerrada'),
        ('Abierta', 'Abierta'),
        ('No Aplica', 'No aplica'),
    ]

    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE, related_name='clasificacion')
    ubicacion = models.CharField(max_length=20, choices=UBICACION_CHOICES)
    estado_propiedad = models.CharField(max_length=20, choices=ESTADO_PROPIEDAD_CHOICES)
    privada = models.CharField(max_length=20, choices=PRIVADA_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.ubicacion} - {self.estado_propiedad}"

class Servicios(models.Model):
    id = models.AutoField(primary_key=True)  # Primary Key numérica
    propiedad = models.OneToOneField(Propiedad, on_delete=models.CASCADE, related_name='servicios')
    
    # Campos de servicios
    electricidad = models.BooleanField(default=False)
    agua = models.BooleanField(default=False)
    gas = models.BooleanField(default=False)
    internet = models.BooleanField(default=False)
    television_cable = models.BooleanField(default=False)
    aire_acondicionado = models.BooleanField(default=False)
    calefaccion = models.BooleanField(default=False)
    cocina_equipada = models.BooleanField(default=False)
    closets_empotrados = models.BooleanField(default=False)
    jardin_privado = models.BooleanField(default=False)
    patio_privado = models.BooleanField(default=False)
    terraza = models.BooleanField(default=False)
    balcon = models.BooleanField(default=False)
    piscina = models.BooleanField(default=False)
    jacuzzi = models.BooleanField(default=False)
    camaras_vigilancia = models.BooleanField(default=False)
    alarmas = models.BooleanField(default=False)
    cercas_electricas = models.BooleanField(default=False)
    acceso_controlado = models.BooleanField(default=False)
    domotica = models.BooleanField(default=False)
    automatizacion_luces = models.BooleanField(default=False)
    cerraduras_inteligentes = models.BooleanField(default=False)
    termostato_inteligente = models.BooleanField(default=False)
    oficina_en_casa = models.BooleanField(default=False)
    estacionamiento_cubierto = models.BooleanField(default=False)
    cochera = models.BooleanField(default=False)
    cuarto_servicio = models.BooleanField(default=False)
    lavadero = models.BooleanField(default=False)
    bodega = models.BooleanField(default=False)
    seguridad_24_7 = models.BooleanField(default=False)
    areas_verdes_comunes = models.BooleanField(default=False)
    jardines = models.BooleanField(default=False)
    zona_juegos_infantiles = models.BooleanField(default=False)
    gimnasio = models.BooleanField(default=False)
    area_deportiva = models.BooleanField(default=False)
    paneles_solares = models.BooleanField(default=False)
    cisterna = models.BooleanField(default=False)
    captacion_agua_lluvia = models.BooleanField(default=False)
    ventanas_doble_vidrio = models.BooleanField(default=False)
    aislamiento_termico = models.BooleanField(default=False)
    jardines_verticales = models.BooleanField(default=False)

    def __str__(self):
        return f"Servicios de {self.propiedad.titulo}"
