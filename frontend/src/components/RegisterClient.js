import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RegisterClient = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email } = location.state || {}; // Obtén el correo del estado

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/clientes/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, phone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        navigate(data.redirectTo); // Redirige a /home después del registro
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error al registrar al cliente:", error);
    }
  };

  console.log("Correo recibido en el formulario:", email);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6">Registro de Cliente</h1>
      <form className="w-full max-w-sm bg-white" onSubmit={handleSubmit}>
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
            value={email || ""}
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

        {/* Campo: Contraseña */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
          />
        </div>

        {/* Botón: Registrar */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Registrar Cliente
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterClient;
