import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
        
      </Routes>
    </Router>
  );
}

export default App;