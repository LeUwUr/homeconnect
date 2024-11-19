import React from "react";
import { Link } from "react-router-dom"; // Para navegación entre páginas

const RegisterAgent = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      {/* Título */}
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Regístrate como Agente Inmobiliario</h1>

      {/* Formulario */}
      <form className="space-y-6 w-full max-w-sm">
        {/* Campo: Nombre */}
        <div>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Campo: Correo electrónico */}
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Campo: Teléfono */}
        <div>
          <input
            type="tel"
            placeholder="Teléfono"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Campo: Agencia inmobiliaria */}
        <div>
          <input
            type="text"
            placeholder="Agencia inmobiliaria"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Campo: Contraseña
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div> */}

        {/* Botón: Registrarse */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Registrate
        </button>
      </form>

      {/* Enlace para iniciar sesión */}
      <p className="mt-8 text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Iniciar Sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterAgent;
