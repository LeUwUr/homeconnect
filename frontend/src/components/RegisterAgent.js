import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const RegisterAgent = () => {
  const location = useLocation();
  const { email } = location.state || {}; // Correo del usuario autenticado

  // Estado para otros campos
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const agentData = { name, email, phone, agency };

    // Aquí puedes enviar `agentData` al backend
    console.log("Registrando agente inmobiliario:", agentData);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6">Registro de Agente Inmobiliario</h1>
      <form
        className="w-full max-w-sm bg-white"
        onSubmit={handleSubmit}
      >
        {/* Campo: Nombre */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Campo: Correo (solo lectura) */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            readOnly
            className="w-full px-3 py-2 border bg-gray-100 rounded focus:outline-none cursor-not-allowed"
          />
        </div>

        {/* Campo: Teléfono */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
            Teléfono
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="Número de teléfono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Campo: Agencia */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="agency">
            Agencia Inmobiliaria
          </label>
          <input
            id="agency"
            type="text"
            placeholder="Nombre de la agencia"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Botón: Registrar */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Registrar Agente
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterAgent;
