import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/moduloac';
export const TOKEN = '5d6d86a40448dfb53abd9ca53d222ffec7ef6c2f';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Token ${TOKEN}`
  }
});

// Property endpoints
export const getProperties = () => api.get('/propiedades/');
export const getPropertyDetails = (id) => api.get(`/propiedades/fullinfo/${id}/`);
export const createProperty = (data) => api.post('/propiedades/fullcreate/', data);
export const updateProperty = (id, data) => api.put(`/propiedades/${id}/update/`, data);

// Classification endpoints
export const updateClassification = (id, data) => api.put(`/clasificaciones/${id}/actualizar/`, data);

// Services endpoints
export const updateServices = (id, data) => api.put(`/servicios/${id}/actualizar/`, data);

// Photos endpoints
export const addPhoto = (data) => api.post('/fotos/registrar/', data);
export const updatePhoto = (id, data) => api.put(`/fotos/${id}/actualizar/`, data);
export const deletePhoto = (id) => api.delete(`/fotos/${id}/eliminar/`);


export const registerProperty = async (propertyData) => {
  try {
    const response = await api.post('/propiedades/create/', propertyData);
    return response.data;
  } catch (error) {
    throw new Error('Error registering property');
  }
};

export const registerServices = async (servicesData) => {
  try {
    const response = await api.post('/servicios/registrar/', servicesData);
    return response.data;
  } catch (error) {
    throw new Error('Error registering services');
  }
};

export const registerClassification = async (classificationData) => {
  try {
    const response = await api.post('/clasificaciones/registrar/', classificationData);
    return response.data;
  } catch (error) {
    throw new Error('Error registering classification');
  }
};

export const registerAdditionalPhoto = async (photoData) => {
  try {
    const response = await api.post('/fotos/registrar/', photoData);
    return response.data;
  } catch (error) {
    throw new Error('Error registering additional photo');
  }
};

export const fetchProperties = async () => {
  try {
    const response = await api.get('/propiedades/');
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const fetchPropertyDetails = async (id) => {
  try {
    const response = await api.get(`/propiedades/fullinfo/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property details:', error);
    throw error;
  }
};

export const fetchClassifications = async () => {
  try {
    const response = await api.get('/clasificaciones/');
    return response.data;
  } catch (error) {
    console.error('Error fetching classifications:', error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await api.get('/users/');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

