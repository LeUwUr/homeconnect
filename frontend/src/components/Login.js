import React from "react";
import { Link } from "react-router-dom";

// Importa el hook para iniciar sesión con Google desde Firebase Hooks
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig"; // Importa la configuración de Firebase

// Importa los recursos
import logo from "../assets/HomeLogo.png"; // Logo de la aplicación
import casa from "../assets/house-1867187_1280.jpg"; // Imagen de la casa

const Login = () => {
  // Hook para manejar inicio de sesión con Google
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);

  // Maneja el inicio de sesión con Google
  const handleGoogleLogin = () => {
    signInWithGoogle();
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
        {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}

        {/* Botones de inicio de sesión */}
        <div className="space-y-4 w-full max-w-sm">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Iniciar sesión con Google
          </button>
        </div>

        {/* Enlace de registro */}
        <p className="mt-4 text-gray-600">
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>

      {/* Derecha: Imagen de una casa */}
      <div className="w-1/2 bg-gray-200 flex items-center justify-center">
        <img
          src={casa}
          alt="Casa"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
