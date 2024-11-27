from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.authtoken.views import obtain_auth_token
from .views import (
    PropiedadCompletaCreateView,
    UserCreateView,
    UserListView,
    UserDetailView,
    UserUpdateView,
    UserDeleteView,
    PropiedadCreateView, PropiedadListView, PropiedadDetailView, PropiedadUpdateView, PropiedadDeleteView,
    PropiedadCompletaCreateView, PropiedadDetalleAPIView,
    registrar_foto, listar_fotos, detalles_foto, actualizar_foto, eliminar_foto,
    registrar_clasificacion, listar_clasificaciones, detalles_clasificacion, actualizar_clasificacion, eliminar_clasificacion,
    registrar_servicios, listar_servicios, detalles_servicios, actualizar_servicios, eliminar_servicios
)

urlpatterns = [
    path('login/', obtain_auth_token, name='api_token_auth'),

    path('users/', UserListView.as_view(), name='user-list'),
    path('users/register/', UserCreateView.as_view(), name='user-register'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),
    path('users/<int:pk>/update/', UserUpdateView.as_view(), name='user-update'),
    path('users/<int:pk>/delete/', UserDeleteView.as_view(), name='user-delete'),

    path('propiedades/', PropiedadListView.as_view(), name='propiedad-list'),
    path('propiedades/create/', PropiedadCreateView.as_view(), name='propiedad-create'),
    path('propiedades/<int:pk>/', PropiedadDetailView.as_view(), name='propiedad-detail'),
    path('propiedades/<int:pk>/update/', PropiedadUpdateView.as_view(), name='propiedad-update'),
    path('propiedades/<int:pk>/delete/', PropiedadDeleteView.as_view(), name='propiedad-delete'),

    path('fotos/', listar_fotos),
    path('fotos/registrar/', registrar_foto),
    path('fotos/<int:foto_id>/', detalles_foto),
    path('fotos/<int:foto_id>/actualizar/', actualizar_foto),
    path('fotos/<int:foto_id>/eliminar/', eliminar_foto),

    path('clasificaciones/', listar_clasificaciones),
    path('clasificaciones/registrar/', registrar_clasificacion),
    path('clasificaciones/<int:clasificacion_id>/', detalles_clasificacion),
    path('clasificaciones/<int:clasificacion_id>/actualizar/', actualizar_clasificacion),
    path('clasificaciones/<int:clasificacion_id>/eliminar/', eliminar_clasificacion),

    path('servicios/', listar_servicios),
    path('servicios/registrar/', registrar_servicios),
    path('servicios/<int:servicio_id>/', detalles_servicios),
    path('servicios/<int:servicio_id>/actualizar/', actualizar_servicios),
    path('servicios/<int:servicio_id>/eliminar/', eliminar_servicios),

    path('propiedades/fullcreate/', PropiedadCompletaCreateView.as_view(), name='propiedad-full-create'),
    path('propiedades/fullinfo/<int:propiedad_id>/', PropiedadDetalleAPIView.as_view(), name='propiedad-detalle'),
]  + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
