import axios from 'axios';

export const API_BASE_URL = 'http://127.0.0.1:8000/moduloac';
export const TOKEN = '5d6d86a40448dfb53abd9ca53d222ffec7ef6c2f';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': `Token ${TOKEN}`
  }
});

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