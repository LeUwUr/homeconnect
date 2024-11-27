import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SelectRegister from "./components/SelectRegister";
import RegisterClient from "./components/RegisterClient";
import RegisterAgent from "./components/RegisterAgent";
import Home from "./components/Home";
import Inicio from "./components/Inicio";


function App() {
  return (
    <Router>
      <Routes>
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
      </Routes>
    </Router>
  );
}

export default App;
