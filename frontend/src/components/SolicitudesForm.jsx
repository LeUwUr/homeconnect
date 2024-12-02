import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import { createSolicitud } from "../services/api";

const SolicitudesForm = () => {
    const [formData, setFormData] = useState({
        propiedad_id: "",
        usuario_id: "",
        estado_solicitud: "Pendiente",
    });

    const [mensaje, setMensaje] = useState("");
    const navigate = useNavigate(); // Inicializar useNavigate

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createSolicitud(formData);
            setMensaje(`Solicitud creada: ID ${response.id}`);
            setFormData({
                propiedad_id: "",
                usuario_id: "",
                estado_solicitud: "Pendiente",
            });

            // Redireccionar al historial después de crear la solicitud
            navigate("/historial"); // Cambia esta ruta si es diferente en tu app
        } catch (error) {
            setMensaje(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f4f8',
            padding: '20px'
        }}>
            <div style={{
                background: '#ffffff',
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
                maxWidth: '500px',
                width: '100%',
                fontFamily: 'Arial, sans-serif',
                border: '1px solid #ddd',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    textAlign: 'center',
                    color: '#333',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    marginBottom: '30px'
                }}>Crear Solicitud de Compra</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px'
                        }}>Propiedad ID:</label>
                        <input
                            type="number"
                            name="propiedad_id"
                            value={formData.propiedad_id}
                            onChange={handleChange}
                            min={0}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease-in-out'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px'
                        }}>Usuario ID:</label>
                        <input
                            type="number"
                            name="usuario_id"
                            value={formData.usuario_id}
                            onChange={handleChange}
                            min={0}
                            required
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease-in-out'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#555',
                            fontSize: '14px'
                        }}>Estado de la Solicitud:</label>
                        <select
                            name="estado_solicitud"
                            value={formData.estado_solicitud}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px 15px',
                                border: '1px solid #ccc',
                                borderRadius: '6px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease-in-out'
                            }}
                        >
                            <option value="Pendiente">Pendiente</option>
                            <option value="Aprobada">Aprobada</option>
                            <option value="Rechazada">Rechazada</option>
                        </select>
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '12px 0',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease-in-out',
                        marginTop: '10px'
                    }}>Crear Solicitud</button>
                </form>
                {mensaje && <p style={{
                    textAlign: 'center',
                    fontSize: '16px',
                    marginTop: '20px',
                    color: mensaje.success ? 'green' : 'red'
                }}>{mensaje}</p>}
            </div>
        </div>
    );
};

export default SolicitudesForm;