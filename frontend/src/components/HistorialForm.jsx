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
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHistoriales = async () => {
      try {
        const fetchedHistoriales = await getHistorialList();
        setHistoriales(fetchedHistoriales);
      } catch (error) {
        console.error("Error al cargar historiales:", error);
      }
    };
    loadHistoriales();
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

    const solicitudId = parseInt(formData.solicitud, 10);

    if (isNaN(solicitudId) || solicitudId <= 0) {
      setError("El ID de la solicitud debe ser un número positivo.");
      setLoading(false);
      return;
    }

    const isDuplicate = historiales.some(
      (historial) => historial.solicitud === solicitudId
    );
    if (isDuplicate) {
      setError("Ya existe un historial con ese ID de solicitud.");
      setLoading(false);
      return;
    }

    try {
      const response = await createHistorial({
        ...formData,
        solicitud: solicitudId,
      });

      setMensaje(`Historial creado con éxito: ID ${response.id}`);
      setFormData({
        solicitud: "",
        estado_anterior: "",
        estado_nuevo: "",
        comentarios: "",
      });

      const updatedHistoriales = await getHistorialList();
      setHistoriales(updatedHistoriales);
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
      <style>
        {`
          .form-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .form-title {
            text-align: center;
            font-size: 1.5rem;
            margin-bottom: 20px;
          }
          .form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }
          .form-group {
            display: flex;
            flex-direction: column;
          }
          .form-input, .form-textarea, .search-input {
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
          }
          .form-button {
            background-color: #007bff;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .form-button:disabled {
            background-color: #cccccc;
          }
          .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          .table th, .table td {
            padding: 10px;
            border: 1px solid #ddd;
          }
          .table th {
            background-color: #f4f4f4;
          }
          .error-message {
            color: red;
            font-size: 0.9rem;
          }
        `}
      </style>

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
    </div>
  );
};

export default HistorialForm;