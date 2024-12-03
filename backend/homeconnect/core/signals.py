from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Oferta, Notificacion, Favorito, Propiedad

@receiver(post_save, sender=Oferta)
def notificar_oferta(sender, instance, created, **kwargs):
    propiedad = instance.propiedad  # La propiedad relacionada con la oferta
    favoritos = Favorito.objects.filter(propiedad=propiedad)

    if created:
        # Si la oferta es nueva (creada)
        # Verificamos si no había ninguna oferta anterior
        oferta_previa = Oferta.objects.filter(propiedad=propiedad).exclude(id=instance.id).exists()

        if not oferta_previa:  # Si no había ofertas previas
            # Si esta es la primera oferta para la propiedad
            for favorito in favoritos:
                usuario = favorito.usuario
                mensaje = f"Se ha agregado una nueva oferta a la propiedad '{propiedad.titulo}'.\n" 
                mensaje += f"Descripción: {instance.descripcion}; Porcentaje de descuento: {instance.descuento}%"

                # Crear una notificación para la nueva oferta
                Notificacion.objects.create(
                    usuario=usuario,
                    tipo="Nueva Oferta",
                    mensaje=mensaje,
                    propiedad=propiedad
                )
    else:
        # Si la oferta ya existe y se está actualizando (created=False)
        oferta_original = Oferta.objects.get(id=instance.id)  # Obtener la oferta original antes de la actualización

        # Verificar si alguno de los campos relevantes ha cambiado: descripcion, descuento o fecha_expiracion
        if (oferta_original.descripcion != instance.descripcion) or \
           (oferta_original.descuento != instance.descuento) or \
           (oferta_original.fecha_expiracion != instance.fecha_expiracion):
            
            # Si alguno de los campos clave cambió, significa que la oferta fue actualizada
            for favorito in favoritos:
                usuario = favorito.usuario
                mensaje = f"La oferta de la propiedad '{propiedad.titulo}' ha sido actualizada.\n"
                mensaje += f"Descripción: {instance.descripcion}; Porcentaje de descuento: {instance.descuento}%"

                # Crear una notificación de actualización de oferta
                Notificacion.objects.create(
                    usuario=usuario,
                    tipo="Actualización de Oferta",
                    mensaje=mensaje,
                    propiedad=propiedad
                )

# Notificación de eliminación de oferta
@receiver(post_delete, sender=Oferta)
def notificar_eliminacion_oferta(sender, instance, **kwargs):
    propiedad = instance.propiedad  # La propiedad relacionada con la oferta
    favoritos = Favorito.objects.filter(propiedad=propiedad)

    # Notificar a los usuarios que tengan la propiedad en favoritos
    for favorito in favoritos:
        usuario = favorito.usuario
        mensaje = f"La oferta de la propiedad '{propiedad.titulo}' ha expirado."

        # Crear una notificación de eliminación de oferta
        Notificacion.objects.create(
            usuario=usuario,
            tipo="Eliminación de Oferta",
            mensaje=mensaje,
            propiedad=propiedad
        )
