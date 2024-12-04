from django.urls import path
from . import views
from core.views import NotificacionViewSet  # Importa la vista API

# API REST para notificaciones usando DRF
notificacion_list = NotificacionViewSet.as_view({'get': 'list'})
notificacion_detail = NotificacionViewSet.as_view({'get': 'retrieve'})
notificacion_mark_as_read = NotificacionViewSet.as_view({'post': 'mark_as_read'})
notificacion_delete = NotificacionViewSet.as_view({'delete': 'delete'})

urlpatterns = [
    # Rutas normales (ya existentes)
    path('login/', views.login_view, name='login'),
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
    path('agregar_favorito/<int:propiedad_id>/', views.agregar_favorito, name='agregar_favorito'),
    path('quitar_favorito/<int:propiedad_id>/', views.quitar_favorito, name='quitar_favorito'),
    path('favoritos/', views.lista_favoritos, name='lista_favoritos'),
    path('notificaciones/', views.lista_notificaciones, name='lista_notificaciones'),
    path('notificacion/<int:notificacion_id>/marcar_leida/', views.marcar_notificacion_leida, name='marcar_notificacion_leida'),
    path('eliminar_notificacion/<int:notificacion_id>/', views.eliminar_notificacion, name='eliminar_notificacion'),
    path('eliminar_todas_notificaciones/', views.eliminar_todas_notificaciones, name='eliminar_todas_notificaciones'),
    path('marcar_todas_como_leidas/', views.marcar_todas_como_leidas, name='marcar_todas_como_leidas'),

    # Rutas API REST para Notificaciones
    path('api/notificaciones/', notificacion_list, name='api-notificacion-list'),
    path('api/notificaciones/<int:pk>/', notificacion_detail, name='api-notificacion-detail'),
    path('api/notificaciones/<int:pk>/marcar-leida/', notificacion_mark_as_read, name='api-notificacion-mark-as-read'),
    path('api/notificaciones/<int:pk>/eliminar/', notificacion_delete, name='api-notificacion-delete'),
]
