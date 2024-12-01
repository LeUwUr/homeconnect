import axios from "axios";

// Base URL de la API
const API_URL = "http://127.0.0.1:8000/api/";

// Función para crear una solicitud de compra
export const createSolicitud = async (data) => {
  try {
    const response = await axios.post(`${API_URL}solicitudes/`, data);
    return response.data; // Devuelve la respuesta de la API
  } catch (error) {
    console.error("Error al crear la solicitud:", error);
    throw error;
  }
};

// Función para crear un historial
export const createHistorial = async (data) => {
    try {
      // Realizar la solicitud POST a la API para guardar el historial en la base de datos
      const response = await axios.post(`${API_URL}historial/`, data);
      return response.data; // Devuelve la respuesta de la API (generalmente, los datos guardados)
    } catch (error) {
      console.error("Error al crear el historial:", error);
      throw error; // Lanza el error para poder manejarlo en el componente
    }
  };

// Función para obtener el listado de historiales
export const getHistorialList = async () => {
    try {
      const response = await axios.get(`${API_URL}historial/`);
      return response.data; // Devuelve la lista de historiales
    } catch (error) {
      console.error("Error al obtener el listado de historiales:", error);
      throw error;
    }
  };