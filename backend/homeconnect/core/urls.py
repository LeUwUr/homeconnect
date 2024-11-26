from django.urls import path
from . import views

urlpatterns = [
    # Cambia la raíz al login
    path('', views.login_view, name='login'),

    # Rutas para las propiedades
    path('lista-propiedades/', views.lista_propiedades, name='lista_propiedades'),
    path('propiedad/<int:propiedad_id>/oferta/', views.agregar_oferta, name='agregar_oferta'),
    path('propiedad/<int:propiedad_id>/guardar_oferta/', views.guardar_oferta, name='guardar_oferta'),
    path('oferta/<int:oferta_id>/editar/', views.editar_oferta, name='editar_oferta'),
    path('oferta/<int:oferta_id>/eliminar/', views.eliminar_oferta, name='eliminar_oferta'),

    # Rutas para inicio y cierre de sesión
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
