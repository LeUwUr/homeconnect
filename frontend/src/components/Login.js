import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Importa Firebase Hooks
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";

// Importa los recursos
import logo from "../assets/HomeLogo.png";
import casa from "../assets/house-1867187_1280.jpg";

const Login = () => {
  const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
  const navigate = useNavigate();

  // Estado para el inicio de sesión con correo y contraseña
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");

  // Redirigir al usuario a la vista SelectRegister si está autenticado
  useEffect(() => {
    if (user) {
      console.log("Correo del usuario autenticado:", user.user.email);
      // Verificar si el correo ya está registrado en Firebase
      fetchSignInMethodsForEmail(auth, user.user.email).then((methods) => {
        if (methods.length > 0) {
          navigate("/home"); // Ya registrado, redirige a Home
        } else {
          navigate("/register", {
            state: {
              name: user.user.displayName,
              email: user.user.email,
            },
          }); // No registrado, redirige al registro
        }
      });
    }
  }, [user, navigate]);

  // Maneja el inicio de sesión con Google
  const handleGoogleLogin = async () => {
    try {
      // Inicia sesión con Google
      const result = await signInWithGoogle();
  
      if (result.user) {
        const email = result.user.email;
  
        console.log("Correo autenticado con Google:", email);
  
        // Verifica si el correo ya está registrado en la base de datos
        const response = await fetch("http://127.0.0.1:8000/clientes/check-email/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });
 
        const data = await response.json();
  
        if (response.ok && data.exists) {
          // Si el correo ya está registrado, redirige a /home
          navigate("/inicio");
        } else {
          // Si el correo no está registrado, redirige al formulario de registro
          navigate("/register", {
            state: {
              name: result.user.displayName,
              email: result.user.email,
            },
          });
        }
      }
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      setEmailError("Error al conectar con Google. Intenta de nuevo.");
    }
  };
  

  // Maneja el inicio de sesión con correo y contraseña
  const handleEmailLogin = async (e) => {
    e.preventDefault();
  
    console.log("Datos enviados:", { email, password });
  
    try {
      const response = await fetch("http://127.0.0.1:8000/clientes/login/", {
        method: "POST", // Asegúrate de que este sea POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("Inicio de sesión exitoso:", data);
        navigate("/home");
      } else {
        const errorData = await response.json();
        setEmailError(errorData.message || "Correo o contraseña incorrectos.");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setEmailError("Error al conectar con el servidor.");
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
        {error && <p className="text-red-600 mb-4">Error: {error.message}</p>}

        {/* Botón de inicio de sesión con Google */}
        <div className="space-y-4 w-full max-w-sm">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Iniciar sesión con Google
          </button>
        </div>

        {/* Botón para mostrar los campos de inicio de sesión con email */}
        <div className="mt-4 w-full max-w-sm">
          {!showEmailLogin ? (
            <button
              onClick={() => setShowEmailLogin(true)}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
            >
              Iniciar sesión con Email y Contraseña
            </button>
          ) : (
            // Campos de inicio de sesión con correo y contraseña
            <form onSubmit={handleEmailLogin} className="space-y-4">
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
              {emailError && <p className="text-red-600">{emailError}</p>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                Iniciar sesión
              </button>
            </form>
          )}
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
        <img src={casa} alt="Casa" className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

export default Login;
