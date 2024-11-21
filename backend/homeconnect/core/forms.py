from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Oferta, Usuario

# Formulario para las ofertas
class OfertaForm(forms.ModelForm):
    class Meta:
        model = Oferta
        fields = ['propiedad', 'precio_ofrecido', 'estado_oferta']

# Formulario para el login personalizado
#class LoginForm(forms.Form):
 #   correo_electronico = forms.EmailField(
  #      widget=forms.TextInput(attrs={'placeholder': 'Correo Electrónico'})
   # )
    #contrasena = forms.CharField(
     #   widget=forms.PasswordInput(attrs={'placeholder': 'Contraseña'})
    #)