import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SelectRegister from "./components/SelectRegister";
import RegisterClient from "./components/RegisterClient";
import RegisterAgent from "./components/RegisterAgent";
import Home from "./components/Home";
import Inicio from "./components/Inicio";
import FrontCatalog from "./components/FrontCatalog";
import SimuladorPrestamos from './components/SimuladorPrestamos';
import SolicitudesForm from './components/SolicitudesForm';
import HistorialForm from './components/HistorialForm';

// Componente de bienvenida (Home)
const Home = () => {
  return (
    <div>
      <h2>Bienvenido al sistema</h2>
      <p>Selecciona una opción del menú para continuar.</p>
    </div>
  );
};

function App() {

  return (
    <Router>
      <Routes>
        {/* Ruta principal donde aparece un mensaje de bienvenida */}
        <Route path="/" element={<Home />} />

        {/* Ruta para el formulario de solicitudes */}
        <Route path="/solicitudes" element={<SolicitudesForm />} />

        {/* Ruta para el formulario de historial */}
        <Route path="/historial" element={<HistorialForm />} />

        {/* Ruta exclusiva para el simulador de préstamos */}
        <Route path="/simulador-prestamos" element={<SimuladorPrestamos />} />
        
        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de selección de registro */}
        <Route path="/register" element={<SelectRegister />} />

         {/* Ruta de formulario de registro */}
         <Route path="/register/client" element={<RegisterClient />} />

           {/* Ruta de formulario de registro para agente inmobiliario */}
        <Route path="/register/agent" element={<RegisterAgent />} />

          {/* Ruta para Home */}
        <Route path="/home" element={<Home />} />

          {/* Ruta para Home */}
        <Route path="/inicio" element={<Inicio />} />

        <Route path="/front-catalog" element={<FrontCatalog />} />
      </Routes>
    </Router>
  );
}

export default App;