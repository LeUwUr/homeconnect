from .models import Notificacion

def crear_notificacion(usuario, propiedad, tipo, mensaje):
    notificacion = Notificacion(
        usuario=usuario,
        propiedad=propiedad,
        tipo=tipo,
        mensaje=mensaje
    )
    notificacion.save()
