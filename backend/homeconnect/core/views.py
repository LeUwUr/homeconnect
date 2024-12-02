from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Usuario, Oferta, Conversacion, Mensaje
from .forms import OfertaForm, MensajeForm
from moduloac.models import Propiedad


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
        # Mostrar todas las propiedades de administradores
        propiedades = Propiedad.objects.filter(usuario__tipo_usuario='Administrador')
        template_name = 'core/lista_propiedades_comprador.html'  # Plantilla para compradores
    else:
        propiedades = Propiedad.objects.none()  # Manejo de un caso inesperado
        template_name = 'core/lista_propiedades.html'

    # Calcular precios con descuento si existen ofertas
    for propiedad in propiedades:
        if propiedad.ofertas.exists():
            oferta = propiedad.ofertas.first()
            descuento = oferta.descuento
            propiedad.precio_con_descuento = propiedad.precio * (1 - descuento / 100)
        else:
            propiedad.precio_con_descuento = propiedad.precio

    return render(request, template_name, {
        'propiedades': propiedades,
        'usuario': usuario_actual,
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

        nueva_oferta = Oferta.objects.create(
            propiedad=propiedad,
            descuento=descuento,
            descripcion=descripcion
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
    conversaciones = Conversacion.objects.filter(
        comprador=request.user
    ) | Conversacion.objects.filter(agente=request.user)

    return render(request, 'core/lista_conversaciones.html', {'conversaciones': conversaciones})


@login_required
def detalle_conversacion(request, pk):
    conversacion = get_object_or_404(Conversacion, pk=pk)

    # Verificar que el usuario sea parte de la conversación
    if request.user != conversacion.comprador and request.user != conversacion.agente:
        return redirect('lista_propiedades_comprador')  # O a una página de error

    if request.user == conversacion.agente:  # Solo el agente puede marcar los mensajes como vistos
        # Solo marcar los mensajes no vistos del comprador
        mensajes_no_vistos = conversacion.mensajes.filter(remitente=conversacion.comprador, visto=False)
        if mensajes_no_vistos.exists():
            mensajes_no_vistos.update(visto=True)  # Actualizar como visto

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