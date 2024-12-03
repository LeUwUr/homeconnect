import React from "react";
import { useNavigate } from "react-router-dom";

const ModalLogin = ({ onClose }) => {
  const navigate = useNavigate(); // Hook para manejar la navegación

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirige al usuario a la página de inicio de sesión
    onClose(); // Opcional: cerrar la modal después de redirigir
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Detectar clic en el fondo
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-80 sm:w-96 relative"
        onClick={(e) => e.stopPropagation()} // Prevenir cierre cuando se hace clic dentro del modal
      >
        {/* Botón de cerrar en la esquina superior derecha */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 focus:outline-none"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4">¡Inicia sesión o regístrate!</h2>
        <p className="text-center text-sm text-gray-600 mb-4">
          Para aplicar filtros y acceder a más servicios, necesitas estar autenticado.
        </p>
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={handleLoginRedirect}
            className="bg-blue-500 text-white px-6 py-2 rounded-md w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md w-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalLogin;
