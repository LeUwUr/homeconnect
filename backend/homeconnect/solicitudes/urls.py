from rest_framework.routers import DefaultRouter
from .views import SolicitudCompraViewSet, HistorialSolicitudViewSet

router = DefaultRouter()
router.register(r'solicitudes', SolicitudCompraViewSet, basename='solicitudes')
router.register(r'historial', HistorialSolicitudViewSet, basename='historial')

urlpatterns = router.urls