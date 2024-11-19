import React from "react";
import { Link } from "react-router-dom"; // Para navegación entre páginas

const SelectRegister = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Título */}
      <h1 className="text-7xl font-bold mb-20 text-gray-800">
        Registro como...
      </h1>

      {/* Botones de selección */}
      <div className="flex space-x-20">
        <Link to="/register/client">
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
            Comprador
          </button>
        </Link>
        <Link to="/register/agent">
        <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
          Agente inmobiliario
        </button>
        </Link>
      </div>

      {/* Enlace para volver al inicio de sesión */}
      <p className="mt-60 text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
};

export default SelectRegister;
