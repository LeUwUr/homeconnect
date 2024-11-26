from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from .models import Propiedad, Oferta, Usuario
from .forms import OfertaForm
from functools import wraps


def login_view(request):
    if request.method == 'POST':
        correo_electronico = request.POST.get('correo_electronico')
        contrasena = request.POST.get('contrasena')
        

        try:
            usuario = Usuario.objects.get(correo_electronico=correo_electronico, contrasena=contrasena)
            print("Usuario encontrado:", usuario)
            request.session['usuario_id'] = usuario.id
            request.session['nombre_usuario'] = usuario.nombre
            return redirect('lista_propiedades')  # Redirige a la vista principal después del login
        except Usuario.DoesNotExist:
            messages.error(request, 'Correo o contraseña incorrectos.')

    return render(request, 'core/login.html')

def logout_view(request):
    request.session.flush()  # Limpia todos los datos de la sesión
    return redirect('login')

def login_required(view_func):
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.session.get('usuario_id'):
            return redirect('login')
        return view_func(request, *args, **kwargs)
    return wrapper

@login_required
def lista_propiedades(request):
    usuario_id = request.session.get('usuario_id')
    usuario_actual = get_object_or_404(Usuario, id=usuario_id)

    if usuario_actual.tipo_usuario == Usuario.ADMINISTRADOR:
        # Mostrar solo las propiedades del administrador actual
        propiedades = Propiedad.objects.filter(usuario_id=usuario_id)
        template_name = 'core/lista_propiedades.html'  # Plantilla para administradores
    elif usuario_actual.tipo_usuario == Usuario.COMPRADOR:
        # Mostrar todas las propiedades de administradores
        propiedades = Propiedad.objects.filter(usuario__tipo_usuario=Usuario.ADMINISTRADOR)
        template_name = 'core/lista_propiedades_comprador.html'  # Plantilla para compradores
    else:
        propiedades = Propiedad.objects.none()  # Manejo de un caso inesperado
        template_name = 'core/lista_propiedades.html'

    # Calcular precios con descuento
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
