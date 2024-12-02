from django.db import models

class SolicitudCompra(models.Model):
    propiedad_id = models.IntegerField()
    usuario_id = models.IntegerField()
    estado_solicitud = models.CharField(max_length=50, choices=[
        ('Pendiente', 'Pendiente'),
        ('Aprobada', 'Aprobada'),
        ('Rechazada', 'Rechazada')
    ])
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'solicitudes_compra'

    def __str__(self):
        return f"Solicitud {self.id} - {self.estado_solicitud}"
    
class HistorialSolicitud(models.Model):
    solicitud = models.ForeignKey(SolicitudCompra, on_delete=models.CASCADE)
    fecha_cambio = models.DateTimeField(auto_now_add=True)
    estado_anterior = models.CharField(max_length=50)
    estado_nuevo = models.CharField(max_length=50)
    comentarios = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'historial_solicitudes'

    def __str__(self):
        return f"Historial {self.id} - {self.solicitud.estado_solicitud}"