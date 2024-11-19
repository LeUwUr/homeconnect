// Importa las funciones necesarias desde Firebase
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDRGtjKmIk43eI9h8lr4n6ZEHq1O6L7t8Y",
  authDomain: "homeconnect-cbf96.firebaseapp.com",
  projectId: "homeconnect-cbf96",
  storageBucket: "homeconnect-cbf96.firebasestorage.app",
  messagingSenderId: "773309257989",
  appId: "1:773309257989:web:58b167fa5182615fbe7f6c",
  measurementId: "G-D2XTJB36GG",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Configuración para autenticación con Google
export const auth = getAuth(app); // Exporta la autenticación
export const googleProvider = new GoogleAuthProvider(); // Exporta el proveedor de Google
