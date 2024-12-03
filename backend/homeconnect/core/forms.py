from django import forms
from .models import Oferta, Mensaje

# Formulario para las ofertas
class OfertaForm(forms.ModelForm):
    class Meta:
        model = Oferta
        fields = ['propiedad', 'precio_ofrecido', 'estado_oferta', 'descuento','descripcion', 'fecha_expiracion']
        widgets = {
            'fecha_expiracion': forms.DateTimeInput(attrs={'type': 'datetime-local'}),
        }

class MensajeForm(forms.ModelForm):
    class Meta:
        model = Mensaje
        fields = ['texto']
        widgets = {
            'texto': forms.Textarea(attrs={'rows': 3}),
        }