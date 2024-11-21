from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from .models import Propiedad, Oferta, Usuario
from .forms import OfertaForm#, LoginForm  # Asegúrate de importar LoginForm

#def login_usuario(request):
#    if request.method == 'POST':
#        form = LoginForm(request.POST)
#        if form.is_valid():
#            # Aquí no autenticamos al usuario ni verificamos las credenciales
#            login(request, form.get_user())  # Usamos form.get_user() para obtener el usuario directamente
#            return redirect('lista_propiedades')  # Redirige a la lista de propiedades
#    else:
#        form = LoginForm()
#
#    return render(request, 'core/login.html', {'form': form})

# Cerrar sesión y redirigir al login
#def logout_usuario(request):
#    logout(request)
#    return redirect('login_usuario')

# Aseguramos que solo los usuarios autenticados puedan acceder a ciertas vistas
#@login_required
def lista_propiedades(request):
    propiedades = Propiedad.objects.all()

    # Calcular el precio con descuento para cada propiedad
    for propiedad in propiedades:
        if propiedad.ofertas.exists():
            # Tomamos el primer descuento disponible
            oferta = propiedad.ofertas.first()
            descuento = oferta.descuento
            propiedad.precio_con_descuento = propiedad.precio * (1 - descuento / 100)
        else:
            propiedad.precio_con_descuento = propiedad.precio

    return render(request, 'core/lista_propiedades.html', {'propiedades': propiedades})



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
