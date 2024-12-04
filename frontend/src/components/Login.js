import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importa los recursos
import logo from "../assets/HomeLogo.png";
import casa from "../assets/house-1867187_1280.jpg";

const Login = () => {
  const navigate = useNavigate();

  // Estado para el inicio de sesión con correo y contraseña
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  // Maneja el inicio de sesión con correo y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/core/login/", {  // Cambié la URL al nuevo endpoint
        method: "POST", // Usamos POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ correo_electronico: email, contrasena: password }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        console.log("Inicio de sesión exitoso");
        navigate("/home");  // Redirige a la página de inicio
      } else {
        console.log(data.message);
        setEmailError(data.message || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setEmailError("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Izquierda: Formulario de inicio de sesión */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center px-10">
        {/* Logo */}
        <div className="mb-8">
          <img src={logo} alt="Logo" className="w-64 h-auto object-contain" />
        </div>

        {/* Mensajes de estado */}
        {loading && <p className="text-blue-600 mb-4">Iniciando sesión...</p>}
        {emailError && <p className="text-red-600 mb-4">{emailError}</p>}

        {/* Formulario de inicio de sesión con correo y contraseña */}
        <form onSubmit={handleEmailLogin} className="space-y-4 w-full max-w-sm">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            disabled={loading}
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace de registro */}
        <p className="mt-4 text-gray-600">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>

      {/* Derecha: Imagen de una casa */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <img src={casa} alt="Casa" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;