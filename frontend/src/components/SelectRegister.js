import React from "react";
import { useLocation, Link } from "react-router-dom";

const SelectRegister = () => {
  const location = useLocation();
  const { name, email } = location.state || {}; // Datos del usuario

  console.log("Estado recibido:", location.state);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido, {name || "Usuario"}!
      </h1>
      <p className="text-gray-600  mb-40">
        Por favor, selecciona tu rol para continuar.
      </p>

      {/* Botones para seleccionar rol */}
      <div className="flex space-x-4">
        <Link to="/register/client" state={{ email }}>
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
            Comprador
          </button>
        </Link>
        {/* <Link to="/register/agent" state={{ email }}>
          <button className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700">
            Agente Inmobiliario
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default SelectRegister;
