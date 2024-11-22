from django import forms
from .models import Prestamo

class PrestamoForm(forms.ModelForm):
    class Meta:
        model = Prestamo
        fields = ["nombre", "correo", "ingreso_mensual", "monto_solicitado", "tasa_interes", "plazo_meses"]
        widgets = {
            "nombre": forms.TextInput(attrs={"placeholder": "Tu nombre completo"}),
            "correo": forms.EmailInput(attrs={"placeholder": "Tu correo electrónico"}),
            "ingreso_mensual": forms.NumberInput(attrs={"placeholder": "Ingresos mensuales (MXN)"}),
            "monto_solicitado": forms.NumberInput(attrs={"placeholder": "Monto solicitado (MXN)"}),
            "tasa_interes": forms.NumberInput(attrs={"placeholder": "Tasa de interés (%)"}),
            "plazo_meses": forms.NumberInput(attrs={"placeholder": "Plazo en meses"}),
        }