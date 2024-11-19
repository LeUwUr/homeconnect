import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import SelectRegister from "./components/SelectRegister";
import Register from "./components/Register";
import RegisterAgent from "./components/RegisterAgent";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de inicio de sesión */}
        <Route path="/login" element={<Login />} />

        {/* Ruta de selección de registro */}
        <Route path="/register" element={<SelectRegister />} />

         {/* Ruta de formulario de registro */}
         <Route path="/register/client" element={<Register />} />

           {/* Ruta de formulario de registro para agente inmobiliario */}
        <Route path="/register/agent" element={<RegisterAgent />} />
      </Routes>
    </Router>
  );
}

export default App;
