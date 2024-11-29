import React, { useState, useEffect } from "react";
import { createHistorial, getHistorialList } from "../services/api"; 

const HistorialForm = () => {
  const [formData, setFormData] = useState({
    solicitud: "",
    estado_anterior: "",
    estado_nuevo: "",
    comentarios: "",
  });

  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false); 
  const [historiales, setHistoriales] = useState([]); 
  const [search, setSearch] = useState(""); 
  const [error, setError] = useState(""); // Para mostrar errores

  useEffect(() => {
    const storedHistoriales = localStorage.getItem("historiales");
    if (storedHistoriales) {
      setHistoriales(JSON.parse(storedHistoriales)); 
    } else {
      const loadHistoriales = async () => {
        try {
          const fetchedHistoriales = await getHistorialList();
          setHistoriales(fetchedHistoriales);
          localStorage.setItem("historiales", JSON.stringify(fetchedHistoriales)); 
        } catch (error) {
          console.error("Error al cargar historiales:", error);
        }
      };
      loadHistoriales();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Convertir la solicitud a número
    const solicitudId = parseInt(formData.solicitud, 10);

    // Validación de ID negativo
    if (isNaN(solicitudId) || solicitudId <= 0) {
      setError("El ID de la solicitud debe ser un número positivo.");
      setLoading(false);
      return;
    }

    // Validación de duplicados
    const isDuplicate = historiales.some(
      (historial) => historial.solicitud === solicitudId
    );
    if (isDuplicate) {
      setError("Ya existe un historial con ese ID de solicitud.");
      setLoading(false);
      return;
    }

    try {
      // Enviar el historial con solicitudId asegurado como número positivo
      const response = await createHistorial({
        ...formData,
        solicitud: solicitudId
      });

      setMensaje(`Historial creado con éxito: ID ${response.id}`);
      
      setFormData({
        solicitud: "",
        estado_anterior: "",
        estado_nuevo: "",
        comentarios: "",
      });

      const updatedHistoriales = [...historiales, response];
      setHistoriales(updatedHistoriales);
      localStorage.setItem("historiales", JSON.stringify(updatedHistoriales));

    } catch (error) {
      setMensaje(`Error al crear historial: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistoriales = historiales.filter((historial) =>
    historial.solicitud.toString().includes(search)
  );

  return (
    <div className="form-container">
      <h2 className="form-title">Crear Historial de Solicitud</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="solicitud">ID de la Solicitud:</label>
          <input
            type="number"
            name="solicitud"
            value={formData.solicitud}
            onChange={handleChange}
            required
            className="form-input"
            min={0}
          />
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="estado_anterior">Estado Anterior:</label>
          <input
            type="text"
            name="estado_anterior"
            value={formData.estado_anterior}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="estado_nuevo">Estado Nuevo:</label>
          <input
            type="text"
            name="estado_nuevo"
            value={formData.estado_nuevo}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="comentarios">Comentarios:</label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>
        <button type="submit" className="form-button" disabled={loading}>
          {loading ? "Creando..." : "Crear Historial"}
        </button>
      </form>

      {mensaje && <p className="form-message">{mensaje}</p>}

      <div className="filter-container">
        <input
          type="text"
          placeholder="Buscar por ID Solicitud"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="historial-list">
        <h3>Historiales Creados</h3>
        {filteredHistoriales.length === 0 ? (
          <p>No hay historiales disponibles.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>ID Solicitud</th>
                <th>Estado Anterior</th>
                <th>Estado Nuevo</th>
                <th>Comentarios</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistoriales.map((historial, index) => (
                <tr key={historial.id}>
                  <td>{index + 1}</td>
                  <td>{historial.solicitud}</td>
                  <td>{historial.estado_anterior}</td>
                  <td>{historial.estado_nuevo}</td>
                  <td>{historial.comentarios || "Sin comentarios"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <style jsx>{`
        .form-container {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          margin: 20px auto;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          text-align: center;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }

        .form-textarea {
          height: 100px;
        }

        .form-button {
          background-color: #4CAF50;
          color: white;
          padding: 10px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        .form-button:disabled {
          background-color: #ccc;
        }

        .form-message {
          margin-top: 10px;
          font-size: 14px;
          color: green;
          text-align: center;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }

        .historial-list {
          margin-top: 30px;
        }

        .table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }

        .table th,
        .table td {
          padding: 12px;
          border: 1px solid #ddd;
          text-align: left;
        }

        .table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .filter-container {
          margin-bottom: 20px;
          text-align: center;
        }

        .search-input {
          padding: 8px;
          width: 200px;
          border-radius: 4px;
          border: 1px solid #ddd;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default HistorialForm;