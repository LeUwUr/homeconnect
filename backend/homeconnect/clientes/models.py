from django.db import models
import bcrypt

class Cliente(models.Model):
    nombre = models.CharField(max_length=255)
    correo_electronico = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    contrasena = models.CharField(max_length=255)  # Almacena la contraseña encriptada
    fecha_registro = models.DateTimeField(auto_now_add=True)

def save(self, *args, **kwargs):
    if self.pk is None:  # Solo en nuevos registros
        self.contrasena = bcrypt.hashpw(
            self.contrasena.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")
    super().save(*args, **kwargs)


    def __str__(self):
        return self.correo_electronico
