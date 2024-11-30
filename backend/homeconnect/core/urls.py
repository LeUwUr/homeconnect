from django.urls import path
from . import views

urlpatterns = [
    path('', views.login_view, name='login'),
    path('home/', views.home_view, name='home'), 
    path('logout/', views.logout_view, name='logout'),
    path('propiedades/', views.lista_propiedades, name='lista_propiedades'),
    path('propiedad/<int:propiedad_id>/oferta/', views.agregar_oferta, name='agregar_oferta'),
    path('propiedad/<int:propiedad_id>/guardar_oferta/', views.guardar_oferta, name='guardar_oferta'),
    path('oferta/<int:oferta_id>/editar/', views.editar_oferta, name='editar_oferta'),
    path('oferta/<int:oferta_id>/eliminar/', views.eliminar_oferta, name='eliminar_oferta'),
    path('conversacion/<int:propiedad_id>/', views.abrir_chat, name='abrir_chat'),
    path('detalle_conversacion/<int:pk>/', views.detalle_conversacion, name='detalle_conversacion'),
    path('conversaciones/', views.lista_conversaciones, name='lista_conversaciones'),

]