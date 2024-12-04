from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Usuario, Oferta, Conversacion, Mensaje, Favorito, Notificacion
from .forms import OfertaForm, MensajeForm
from django.db.models import Q, Max, Count
from .utils import crear_notificacion
from datetime import datetime
from django.core.paginator import Paginator
from moduloac.models import Propiedad
from core.serializers import NotificacionSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action


def login_view(request):
    if request.method == 'POST':
        correo_electronico = request.POST['correo_electronico']
        contrasena = request.POST['contrasena']
        user = authenticate(request, correo_electronico=correo_electronico, password=contrasena)
        if user is not None:
            login(request, user)
            return redirect('lista_propiedades')  
        else:
            messages.error(request, 'Correo o contraseña incorrectos')
    return render(request, 'core/login.html')

def logout_view(request):
    request.session.flush() 
    return redirect('login')

@login_required
def home_view(request):
    return render(request, 'core/home.html', {
        'usuario': request.user.nombre,
        'tipo_usuario': request.user.tipo_usuario
    })

@login_required
def lista_propiedades(request):
    usuario_actual = request.user  # Usuario autenticado directamente

    if usuario_actual.tipo_usuario == 'Administrador':
        # Mostrar solo las propiedades del administrador actual
        propiedades = Propiedad.objects.filter(usuario=usuario_actual)
        template_name = 'core/lista_propiedades.html'  # Plantilla para administradores
    elif usuario_actual.tipo_usuario == 'Comprador':
        # Mostrar solo las propiedades disponibles de administradores
        propiedades = Propiedad.objects.filter(usuario__tipo_usuario='Administrador')
        template_name = 'core/lista_propiedades_comprador.html'  # Plantilla para compradores
    else:
        propiedades = Propiedad.objects.none()  # Manejo de un caso inesperado
        template_name = 'core/lista_propiedades.html'

    # Obtener las propiedades favoritas del usuario
    propiedades_favoritas = Favorito.objects.filter(usuario=usuario_actual).values_list('propiedad', flat=True)

    # Calcular precios con descuento si existen ofertas
    for propiedad in propiedades:
        if propiedad.ofertas.exists():
            oferta = propiedad.ofertas.first()
            descuento = oferta.descuento
            propiedad.precio_con_descuento = propiedad.precio * (1 - descuento / 100)
        else:
            propiedad.precio_con_descuento = propiedad.precio  # Si no hay oferta, el precio con descuento es igual al precio original

    # Obtener las conversaciones con el usuario actual (comprador o agente)
    conversaciones = Conversacion.objects.filter(
        Q(comprador=request.user) | Q(agente=request.user)
    ).annotate(
        ultimo_mensaje_fecha=Max('mensajes__fecha_envio'),
        mensajes_no_vistos=Count('mensajes', filter=Q(mensajes__visto=False) & ~Q(mensajes__remitente=request.user))
    ).order_by('-ultimo_mensaje_fecha', '-id')

    # Contar cuántas conversaciones tienen mensajes no vistos
    conversaciones_con_punto_rojo = sum(1 for c in conversaciones if c.mensajes_no_vistos > 0)

    # Obtener notificaciones no leídas del usuario actual
    notificaciones_no_leidas = Notificacion.objects.filter(usuario=usuario_actual, leida=False).count()

    # Obtener las últimas 5 notificaciones recientes para mostrar
    notificaciones_destacadas = Notificacion.objects.filter(usuario=usuario_actual).order_by('-fecha')[:5]

    return render(request, template_name, {
        'propiedades': propiedades,
        'usuario': usuario_actual,
        'propiedades_favoritas': propiedades_favoritas,  # Pasamos las propiedades favoritas
        'conversaciones_con_punto_rojo': conversaciones_con_punto_rojo,  # Pasamos el contador de conversaciones con punto rojo
        'notificaciones_no_leidas': notificaciones_no_leidas,  # Pasamos la cantidad de notificaciones no leídas
        'notificaciones_destacadas': notificaciones_destacadas,  # Pasamos las notificaciones recientes destacadas
    })



def agregar_oferta(request, propiedad_id):
    propiedad = get_object_or_404(Propiedad, pk=propiedad_id)

    if request.method == 'POST':
        form = OfertaForm(request.POST)
        if form.is_valid():
            oferta = form.save(commit=False)
            oferta.propiedad = propiedad
            oferta.agente_id = request.user.id
            oferta.save()
            return redirect('lista_propiedades')
    else:
        form = OfertaForm()

    return render(request, 'core/agregar_oferta.html', {'form': form, 'propiedad': propiedad})



def guardar_oferta(request, propiedad_id):
    if request.method == "POST":
        propiedad = get_object_or_404(Propiedad, id=propiedad_id)
        descuento = request.POST.get('descuento')
        descripcion = request.POST.get('descripcion')
        fecha_expiracion = request.POST.get('fecha_expiracion')  # Obtener la fecha de expiración desde el formulario

        # Crear nueva oferta con fecha de expiración
        nueva_oferta = Oferta.objects.create(
            propiedad=propiedad,
            descuento=descuento,
            descripcion=descripcion,
            fecha_expiracion=fecha_expiracion  # Asignar la fecha de expiración
        )
        nueva_oferta.save()
        return redirect('lista_propiedades')
    else:
        return redirect('lista_propiedades')

def editar_oferta(request, oferta_id):
    oferta = get_object_or_404(Oferta, pk=oferta_id)

    if request.method == 'POST':
        oferta.descuento = request.POST.get('descuento')
        oferta.descripcion = request.POST.get('descripcion')
        oferta.fecha_expiracion = request.POST.get('fecha_expiracion')  # Asegurarse de guardar la fecha de expiración
        oferta.save()
        return redirect('lista_propiedades')

    return render(request, 'core/editar_oferta.html', {'oferta': oferta})


def eliminar_oferta(request, oferta_id):
    oferta = get_object_or_404(Oferta, pk=oferta_id)
    oferta.delete()  # Eliminar la oferta
    return redirect('lista_propiedades')











@login_required
def abrir_chat(request, propiedad_id):
    propiedad = get_object_or_404(Propiedad, pk=propiedad_id)
    administrador = propiedad.usuario  # Usuario que publicó la propiedad

    # Crear o recuperar la conversación
    conversacion, created = Conversacion.objects.get_or_create(
        comprador=request.user,
        agente=administrador,
        propiedad=propiedad
    )

    # Redirigir al detalle de la conversación si no hay errores
    return redirect('detalle_conversacion', pk=conversacion.pk)

@login_required
def lista_conversaciones(request):
    # Obtener todas las conversaciones donde el usuario actual es comprador o agente
    conversaciones = Conversacion.objects.filter(
        Q(comprador=request.user) | Q(agente=request.user)
    ).annotate(
        ultimo_mensaje_fecha=Max('mensajes__fecha_envio'),
        mensajes_no_vistos=Count('mensajes', filter=Q(mensajes__visto=False) & ~Q(mensajes__remitente=request.user))
    ).order_by('-ultimo_mensaje_fecha', '-id')

    return render(request, 'core/lista_conversaciones.html', {
        'conversaciones': conversaciones,
        'usuario_actual': request.user
    })



@login_required
def detalle_conversacion(request, pk):
    conversacion = get_object_or_404(Conversacion, pk=pk)

    # Verificar que el usuario sea parte de la conversación
    if request.user != conversacion.comprador and request.user != conversacion.agente:
        return redirect('lista_propiedades_comprador')  # O a una página de error

    # Marcar todos los mensajes no vistos del usuario que no ha enviado el mensaje como visto
    if request.user == conversacion.comprador:
        mensajes_no_vistos = conversacion.mensajes.filter(remitente=conversacion.agente, visto=False)
        if mensajes_no_vistos.exists():
            mensajes_no_vistos.update(visto=True)
    elif request.user == conversacion.agente:
        mensajes_no_vistos = conversacion.mensajes.filter(remitente=conversacion.comprador, visto=False)
        if mensajes_no_vistos.exists():
            mensajes_no_vistos.update(visto=True)

    # Manejo del formulario de nuevo mensaje
    if request.method == 'POST':
        form = MensajeForm(request.POST)
        if form.is_valid():
            mensaje = form.save(commit=False)
            mensaje.conversacion = conversacion
            mensaje.remitente = request.user
            mensaje.save()
            return redirect('detalle_conversacion', pk=conversacion.pk)  # Para evitar reenvío en POST
    else:
        form = MensajeForm()

    mensajes = conversacion.mensajes.all()
    return render(request, 'core/detalle_conversacion.html', {
        'conversacion': conversacion,
        'mensajes': mensajes,
        'form': form
    })





@login_required
def agregar_favorito(request, propiedad_id):
    propiedad = get_object_or_404(Propiedad, pk=propiedad_id)
    favorito, created = Favorito.objects.get_or_create(usuario=request.user, propiedad=propiedad)
    return redirect('lista_propiedades')  # Redirige a la página de propiedades

@login_required
def quitar_favorito(request, propiedad_id):
    propiedad = get_object_or_404(Propiedad, pk=propiedad_id)
    favorito = Favorito.objects.filter(usuario=request.user, propiedad=propiedad).first()
    if favorito:
        favorito.delete()
    return redirect('lista_favoritos')  # Redirige a la página de propiedades

@login_required
def lista_favoritos(request):
    favoritos = Favorito.objects.filter(usuario=request.user)
    propiedades_favoritas = [favorito.propiedad for favorito in favoritos]
    return render(request, 'core/lista_favoritos.html', {'propiedades': propiedades_favoritas})

@login_required
def agregar_favorito(request, propiedad_id):
    propiedad = Propiedad.objects.get(id=propiedad_id)
    usuario = request.user

    # Verificar si la propiedad ya está en favoritos
    if not Favorito.objects.filter(usuario=usuario, propiedad=propiedad).exists():
        Favorito.objects.create(usuario=usuario, propiedad=propiedad)
        
        # Crear una notificación
        crear_notificacion(
            usuario,
            propiedad,
            Notificacion.TIPO_GUARDADO_FAVORITO,
            f"La propiedad '{propiedad.titulo}' ha sido guardada en tus favoritos."
        )

    return redirect('lista_propiedades')

def cambiar_precio_propiedad(request, propiedad_id, nuevo_precio):
    propiedad = Propiedad.objects.get(id=propiedad_id)
    antiguo_precio = propiedad.precio
    propiedad.precio = nuevo_precio
    propiedad.save()

    # Crear una notificación sobre el cambio de precio
    crear_notificacion(
        propiedad.usuario,  # Notificar al propietario de la propiedad
        propiedad,
        Notificacion.TIPO_CAMBIO_PRECIO,
        f"El precio de la propiedad '{propiedad.titulo}' ha cambiado de ${antiguo_precio} a ${nuevo_precio}."
    )

    return redirect('detalle_propiedad', propiedad_id=propiedad.id)

def verificar_ofertas_vencidas():
    ofertas = Oferta.objects.filter(fecha_expiracion__lt=datetime.now(), activa=True)
    
    for oferta in ofertas:
        oferta.activa = False
        oferta.save()
        
        # Crear una notificación
        crear_notificacion(
            oferta.propiedad.usuario,  # Notificar al propietario
            oferta.propiedad,
            Notificacion.TIPO_VENCIMIENTO_OFERTA,
            f"La oferta en la propiedad '{oferta.propiedad.titulo}' ha vencido."
        )

@login_required
def lista_notificaciones(request):
    usuario = request.user
    notificaciones_list = Notificacion.objects.filter(usuario=usuario).order_by('-fecha')

    # Paginación: 15 notificaciones por página
    paginator = Paginator(notificaciones_list, 15)
    page_number = request.GET.get('page')  # Obtener el número de página actual desde la URL
    page_obj = paginator.get_page(page_number)  # Obtener las notificaciones de la página actual

    return render(request, 'core/lista_notificaciones.html', {
        'page_obj': page_obj  # Pasamos el objeto de paginación a la plantilla
    })

@login_required
def marcar_notificacion_leida(request, notificacion_id):
    notificacion = get_object_or_404(Notificacion, id=notificacion_id, usuario=request.user)
    
    # Marcar la notificación como leída
    notificacion.leida = True
    notificacion.save()
    
    # Redirigir de nuevo a la lista de notificaciones
    return redirect('lista_notificaciones')



@login_required
def eliminar_notificacion(request, notificacion_id):
    # Obtener la notificación o lanzar error 404 si no existe
    notificacion = get_object_or_404(Notificacion, id=notificacion_id, usuario=request.user)

    # Eliminar la notificación
    notificacion.delete()

    # Redirigir al usuario a la lista de notificaciones
    return redirect('lista_notificaciones')  # Ajusta 'todas_notificaciones' si tu URL tiene otro nombre

@login_required
def eliminar_todas_notificaciones(request):
    """Elimina todas las notificaciones del usuario actual"""
    Notificacion.objects.filter(usuario=request.user).delete()
    return redirect('lista_notificaciones')


@login_required
def marcar_todas_como_leidas(request):
    usuario = request.user
    # Marcar todas las notificaciones como leídas para el usuario
    Notificacion.objects.filter(usuario=usuario, leida=False).update(leida=True)
    return redirect('lista_notificaciones')






############# API NOTIFICACIONES ################

class NotificacionViewSet(viewsets.ViewSet):
    """
    API para listar, obtener, marcar como leída y eliminar notificaciones
    del usuario con ID 3.
    """
    def list(self, request):
        # Filtrar notificaciones solo del usuario con ID 3
        queryset = Notificacion.objects.filter(usuario_id=3)
        serializer = NotificacionSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        # Obtener una notificación específica solo si pertenece al usuario con ID 3
        notificacion = Notificacion.objects.filter(pk=pk, usuario_id=3).first()
        if notificacion:
            serializer = NotificacionSerializer(notificacion)
            return Response(serializer.data)
        return Response({"detail": "Notificación no encontrada."}, status=404)

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        # Marcar como leída solo si pertenece al usuario con ID 3
        notificacion = Notificacion.objects.filter(pk=pk, usuario_id=3).first()
        if notificacion:
            notificacion.leida = True
            notificacion.save()
            return Response({"detail": "Notificación marcada como leída."})
        return Response({"detail": "Notificación no encontrada."}, status=404)

    @action(detail=True, methods=['delete'])
    def delete(self, request, pk=None):
        # Eliminar la notificación solo si pertenece al usuario con ID 3
        notificacion = Notificacion.objects.filter(pk=pk, usuario_id=3).first()
        if notificacion:
            notificacion.delete()
            return Response({"detail": "Notificación eliminada."})
        return Response({"detail": "Notificación no encontrada."}, status=404)