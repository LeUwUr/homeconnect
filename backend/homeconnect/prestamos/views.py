from django.shortcuts import render
from .models import Prestamo
from .forms import PrestamoForm

def simulador_prestamos(request):
    resultados = None

    if request.method == "POST":
        form = PrestamoForm(request.POST)
        if form.is_valid():
            ingreso_mensual = form.cleaned_data["ingreso_mensual"]
            monto_solicitado = form.cleaned_data["monto_solicitado"]
            plazo_meses = form.cleaned_data["plazo_meses"]
            tasa_interes = form.cleaned_data["tasa_interes"]

            # Cálculo del monto máximo y mensualidad
            monto_maximo = ingreso_mensual * 40  # Ejemplo: Puedes prestar hasta 40 veces tu ingreso mensual
            if monto_solicitado > monto_maximo:
                monto_solicitado = monto_maximo  # Limitar el préstamo al monto máximo permitido

            tasa_mensual = tasa_interes / 100 / 12
            mensualidad = (monto_solicitado * tasa_mensual) / (1 - (1 + tasa_mensual) ** -plazo_meses)

            # Guardar en la base de datos
            prestamo = form.save(commit=False)
            prestamo.monto_maximo = monto_maximo
            prestamo.mensualidad = mensualidad
            prestamo.save()

            resultados = {
                "monto_maximo": monto_maximo,
                "monto_prestamo": monto_solicitado,
                "mensualidad": mensualidad,
            }
    else:
        form = PrestamoForm()

    return render(request, 'prestamos/simulador_prestamos.html', {
        "form": form,
        "resultados": resultados,
    })