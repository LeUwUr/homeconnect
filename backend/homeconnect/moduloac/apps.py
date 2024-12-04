from django.apps import AppConfig


class ModuloacConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'moduloac'

    def ready(self):
        import moduloac.signals
