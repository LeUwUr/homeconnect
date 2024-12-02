from django import forms
from .models import Oferta, Mensaje

# Formulario para las ofertas
class OfertaForm(forms.ModelForm):

    class Meta:
        model = Oferta
        fields = ['propiedad', 'precio_ofrecido', 'estado_oferta']

    def __init__(self, *args, **kwargs):
        from moduloac.models import Propiedad 
        super().__init__(*args, **kwargs)


class MensajeForm(forms.ModelForm):
    class Meta:
        model = Mensaje
        fields = ['texto']
        widgets = {
            'texto': forms.Textarea(attrs={'rows': 3}),
        }