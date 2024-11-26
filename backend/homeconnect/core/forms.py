from django import forms
from .models import Oferta

# Formulario para las ofertas
class OfertaForm(forms.ModelForm):
    class Meta:
        model = Oferta
        fields = ['propiedad', 'precio_ofrecido', 'estado_oferta']

