from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Cliente
import logging
import bcrypt
import json

logger = logging.getLogger(__name__)

@csrf_exempt
def register_client(request):
    """
    Vista para registrar un cliente.
    Maneja tanto GET como POST:
    - GET: Devuelve la lista de clientes registrados.
    - POST: Registra un nuevo cliente.
    """
    if request.method == 'GET':
        # Obtener todos los clientes
        clientes = Cliente.objects.all().values('nombre', 'correo_electronico', 'telefono', 'fecha_registro')
        return JsonResponse(list(clientes), safe=False, status=200)

    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            name = data.get('name')
            phone = data.get('phone')
            password = data.get('password')  # Recibe la contraseña del cliente

            # Verificar si el cliente ya existe
            if Cliente.objects.filter(correo_electronico=email).exists():
                return JsonResponse({
                    'message': 'Cliente ya registrado',
                    'redirectTo': '/home'
                }, status=200)

            # Encriptar la contraseña antes de guardarla
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

            # Crear un nuevo cliente con la contraseña encriptada
            Cliente.objects.create(
                nombre=name,
                correo_electronico=email,
                telefono=phone,
                contrasena=hashed_password
            )

            return JsonResponse({
                'message': 'Cliente registrado con éxito',
                'redirectTo': '/home'
            }, status=201)

        except Exception as e:
            return JsonResponse({'message': 'Error en el servidor', 'error': str(e)}, status=500)

    return JsonResponse({'message': 'Método no permitido'}, status=405)

@csrf_exempt
def login_client(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            logger.info(f"Datos recibidos en el backend: {data}")
            
            email = data.get("email")
            password = data.get("password")

            # Validación de campos vacíos
            if not email or not password:
                logger.warning("Faltan datos en la solicitud.")
                return JsonResponse({"message": "Correo y contraseña son obligatorios."}, status=400)

            # Verifica si el cliente existe
            cliente = Cliente.objects.filter(correo_electronico=email).first()
            if not cliente:
                logger.warning(f"Correo no encontrado: {email}")
                return JsonResponse({"message": "Correo no registrado."}, status=400)

            # Compara la contraseña
            if not bcrypt.checkpw(password.encode("utf-8"), cliente.contrasena.encode("utf-8")):
                logger.warning(f"Contraseña incorrecta para el correo: {email}")
                return JsonResponse({"message": "Contraseña incorrecta."}, status=400)

            logger.info(f"Inicio de sesión exitoso para el correo: {email}")
            return JsonResponse({"message": "Inicio de sesión exitoso."}, status=200)

        except Exception as e:
            logger.error(f"Error en login_client: {str(e)}")
            return JsonResponse({"message": "Error en el servidor.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Método no permitido."}, status=405)


@csrf_exempt
def check_email(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data.get("email")

            # Verifica si el correo existe en la base de datos
            exists = Cliente.objects.filter(correo_electronico=email).exists()

            return JsonResponse({"exists": exists}, status=200)
        except Exception as e:
            return JsonResponse({"message": "Error en el servidor.", "error": str(e)}, status=500)

    return JsonResponse({"message": "Método no permitido."}, status=405)