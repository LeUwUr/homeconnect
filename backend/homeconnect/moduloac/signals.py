from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Propiedad
from core.models import Notificacion, Favorito

@receiver(pre_save, sender=Propiedad)
def notificar_cambio_precio(sender, instance, **kwargs):
    try:
        propiedad_original = Propiedad.objects.get(pk=instance.pk)
        
        # Detectar cambio de precio
        if propiedad_original.precio != instance.precio:
            favoritos = Favorito.objects.filter(propiedad=instance)
            for favorito in favoritos:
                usuario = favorito.usuario
                mensaje = f"El precio de la propiedad '{instance.titulo}' ha cambiado."
                mensaje += f"\nPrecio anterior: ${propiedad_original.precio}"
                mensaje += f"\nNuevo precio: ${instance.precio}"

                # Crear una notificación en el modelo Notificacion
                Notificacion.objects.create(
                    usuario=usuario,
                    tipo="Cambio de Precio",
                    mensaje=mensaje,
                    propiedad=instance
                )
    except Propiedad.DoesNotExist:
        pass