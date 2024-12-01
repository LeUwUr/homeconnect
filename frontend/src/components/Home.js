import React from "react";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-4">Bienvenido a HomeConnect</h1>
      <p className="text-lg text-gray-600">
        ¡Has iniciado sesión exitosamente! Explora tus opciones de compra o gestiona tus propiedades.
      </p>
      <button
        className="mt-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        onClick={() => alert("Funcionalidad futura aquí.")}
      >
        Ir a Mis Propiedades
      </button>
    </div>
  );
};

export default Home;
