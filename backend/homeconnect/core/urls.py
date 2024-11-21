from django.urls import path
from . import views

urlpatterns = [
    # Ruta para la lista de propiedades
    path('', views.lista_propiedades, name='lista_propiedades'),
    
    # Rutas para las ofertas
    path('propiedad/<int:propiedad_id>/oferta/', views.agregar_oferta, name='agregar_oferta'),
    path('propiedad/<int:propiedad_id>/guardar_oferta/', views.guardar_oferta, name='guardar_oferta'),
    path('oferta/<int:oferta_id>/editar/', views.editar_oferta, name='editar_oferta'),
    path('oferta/<int:oferta_id>/eliminar/', views.eliminar_oferta, name='eliminar_oferta'),
    
    # Rutas para el inicio y cierre de sesión
    #path('login/', views.login_usuario, name='login_usuario'),
    #path('logout/', views.logout_usuario, name='logout_usuario'),
]