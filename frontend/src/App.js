import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Routes
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import PropertyCatalog from './pages/public/PropertyCatalog';
import PropertyDetails from './pages/public/PropertyDetails';

// Admin Routes
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PropertyList from './pages/admin/PropertyList';
import PropertyForm from './pages/admin/PropertyForm';
import PropertyEdit from './pages/admin/PropertyEdit';
import PropertyView from './pages/admin/PropertyView';
import Login from "./components/Login";
import SelectRegister from "./components/SelectRegister";
import RegisterClient from "./components/RegisterClient";
import RegisterAgent from "./components/RegisterAgent";
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
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<PropertyCatalog />} />
          <Route path="property/:id" element={<PropertyDetails />} />
        </Route>
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

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />
          <Route path="properties/:id" element={<PropertyView />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;