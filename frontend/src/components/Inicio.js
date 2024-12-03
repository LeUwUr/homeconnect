import React, { useEffect, useState } from "react";
import { IoMenu } from "react-icons/io5";
import { FaSearchLocation } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { Range } from "react-range";
import ModalLogin from "./ModalLogin";

import logo from "../assets/HomeLogo.png";

const Inicio = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [propiedades, setPropiedades] = useState([]);
  const [filtros, setFiltros] = useState({
    pisos: "",
    recamaras: "",
    banos: "",
    material: "",
    rangoPrecio: [0, 9000000], // Rango de precios inicial
  });
  const [busqueda, setBusqueda] = useState("");
  const [showModal, setShowModal] = useState(false); // Estado para manejar la visibilidad de la modal

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const fetchPropiedades = async () => {
    try {
      const response = await fetch("http://localhost:8000/propiedades/");
      if (!response.ok) {
        throw new Error("Error al cargar las propiedades");
      }
      const data = await response.json();
      setPropiedades(data);
    } catch (error) {
      console.error("Error al cargar las propiedades:", error);
    }
  };

  const fetchPropiedadesFiltradas = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setShowModal(true); // Mostrar modal si el usuario no está autenticado
      return;
    }

    try {
      const params = new URLSearchParams({
        ...filtros,
        minPrecio: filtros.rangoPrecio[0],
        maxPrecio: filtros.rangoPrecio[1],
      });
      const response = await fetch(
        `http://localhost:8000/propiedades/filtrar/?${params.toString()}`
      );
      if (!response.ok) {
        throw new Error("Error al cargar las propiedades filtradas");
      }
      const data = await response.json();
      setPropiedades(data);
    } catch (error) {
      console.error("Error al cargar las propiedades filtradas:", error);
    }
  };

  const limpiarFiltrosYBusqueda = () => {
    setFiltros({
      pisos: "",
      recamaras: "",
      banos: "",
      material: "",
      rangoPrecio: [0, 9000000], // Restablecer rango completo
    });
    setBusqueda("");
    fetchPropiedades();
  };

  const handleFilterChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    fetchPropiedades();
  }, []);

  return (
    <div className="h-screen bg-white">
      {showModal && (
        <ModalLogin
          onLogin={() => {
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)} // Cierra la modal cuando se haga clic afuera o en el botón cerrar
        />
      )}

      <header className="bg-white shadow-md px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <img src={logo} alt="House Connect Logo" className="w-10 h-10" />
          <h1 className="text-2xl font-mono font-bold">House Connect</h1>
        </div>
        <div className="flex items-center border border-gray-300 rounded-full px-6 py-2 w-1/2 mx-auto bg-white shadow-md">
          <input
            type="text"
            placeholder="Busco una casa..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="focus:outline-none w-full text-left bg-transparent"
          />
          {busqueda && (
            <button onClick={limpiarFiltrosYBusqueda} className="text-gray-500 ml-2 w-4 h-4">
              <FaTimes />
            </button>
          )}
        </div>
        <div className="relative flex items-center space-x-4">
          <button className="flex items-center ml-[-10px]" onClick={onLogout}>
            <IoMenu size={45} className="text-sky-700" />
          </button>
        </div>
      </header>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Filtros</h2>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {[
            { label: "Pisos", name: "pisos", type: "number" },
            { label: "Recámaras", name: "recamaras", type: "number" },
            { label: "Baños", name: "banos", type: "number" },
          ].map((filtro) => (
            <div key={filtro.name} className="flex flex-col">
              <label className="text-sm font-bold">{filtro.label}</label>
              <input
                type={filtro.type}
                name={filtro.name}
                value={filtros[filtro.name]}
                onChange={handleFilterChange}
                className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
          <div className="flex flex-col">
            <label className="text-sm font-bold">Material</label>
            <select
              name="material"
              value={filtros.material}
              onChange={handleFilterChange}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar</option>
              <option value="Concreto">Concreto</option>
              <option value="Ladrillo">Ladrillo</option>
              <option value="Madera">Madera</option>
            </select>
          </div>
        </div>

        {/* Rango de precios */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-1/3">
            <label className="text-sm font-bold mb-2 block">Rango de Precio</label>
            <div className="w-full">
              <Range
                step={1000}
                min={0}
                max={9000000}
                values={filtros.rangoPrecio}
                onChange={(values) =>
                  setFiltros({ ...filtros, rangoPrecio: values })
                }
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    className="h-2 bg-gray-300 rounded-md"
                    style={{ width: "100%" }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    className="h-4 w-4 bg-blue-500 rounded-full shadow"
                  />
                )}
              />
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>${filtros.rangoPrecio[0].toLocaleString()}</span>
              <span>${filtros.rangoPrecio[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-4 mt-4 justify-center">
          <button
            onClick={fetchPropiedadesFiltradas}
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md"
          >
            Aplicar Filtros
          </button>
          <button
            onClick={limpiarFiltrosYBusqueda}
            className="bg-gray-300 text-black px-4 py-2 rounded-md shadow-md"
          >
            Limpiar
          </button>
        </div>
      </div>

      <div className="p-4 grid grid-cols-3 gap-6">
        {propiedades.length > 0 ? (
          propiedades.map((propiedad) => (
            <div key={propiedad.propiedad_id} className="bg-white shadow-md rounded-md overflow-hidden">
              <div className="bg-gray-300 h-40">
                <img
                  src={propiedad.foto_frontal || "https://via.placeholder.com/150"}
                  alt={propiedad.titulo}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold">{propiedad.titulo}</h3>
                <p className="text-sm text-gray-600">${propiedad.precio}</p>
                <p className="text-sm text-gray-600">{propiedad.direccion}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No se encontraron propiedades.</p>
        )}
      </div>
    </div>
  );
};

export default Inicio;
