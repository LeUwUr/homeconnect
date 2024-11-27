# propiedades/models.py
from django.db import models

class Propiedad(models.Model):
    propiedad_id = models.AutoField(primary_key=True)  # Usa propiedad_id como clave primaria
    titulo = models.CharField(max_length=255)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    foto_frontal = models.TextField(null=True, blank=True)
    disponibilidad = models.CharField(max_length=50, null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    tamano_m2 = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estado = models.CharField(max_length=50, null=True, blank=True)
    fecha_adquisicion = models.DateField(null=True, blank=True)
    fecha_venta = models.DateField(null=True, blank=True)
    fecha_publicacion = models.DateField(null=True, blank=True)
    eliminado = models.BooleanField(default=False)
    recamaras = models.IntegerField(null=True, blank=True)
    pisos = models.IntegerField(null=True, blank=True)
    banos = models.IntegerField(null=True, blank=True)
    material = models.CharField(max_length=50, null=True, blank=True)

    class Meta:
        db_table = 'propiedades'  # Apunta explícitamente a la tabla existente

    def __str__(self):
        return self.titulo

