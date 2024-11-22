from django.db import models

class Prestamo(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField()
    ingreso_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    monto_solicitado = models.DecimalField(max_digits=12, decimal_places=2)
    tasa_interes = models.DecimalField(max_digits=5, decimal_places=2)
    plazo_meses = models.IntegerField()
    mensualidad = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    monto_maximo = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    fecha_solicitud = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Préstamo de {self.nombre} - {self.monto_solicitado} MXN"
