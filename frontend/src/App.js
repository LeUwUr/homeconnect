import React, { useState } from 'react';
import { Home, Building2, Sparkles, Plus, Grid } from 'lucide-react';
import PropertyForm from './components/PropertyForm';
import ServicesForm from './components/ServicesForm';
import ClassificationForm from './components/ClassificationForm';
import Catalog from './components/Catalog';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/moduloac/propiedades/fullcreate/';
const TOKEN = '5d6d86a40448dfb53abd9ca53d222ffec7ef6c2f';

function App() {
  const [view, setView] = useState('catalog');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    propiedad: {
      usuario: 1,
      titulo: '',
      precio: '',
      foto_frontal: null,
      disponibilidad: '',
      direccion: '',
      tamano_m2: '',
      estado: '',
      fecha_adquisicion: ''
    },
    fotos_adicionales: [],
    services: {},
    classification: {}
  });

  const steps = [
    { number: 1, title: 'Propiedad', icon: Home },
    { number: 2, title: 'Servicios', icon: Sparkles },
    { number: 3, title: 'Clasificación', icon: Building2 }
  ];

  const handleSubmit = async () => {
    try {
      const submitData = new FormData();

      // Convert propiedad object to the required format
      const propertyData = {
        ...formData.propiedad,
        precio: parseFloat(formData.propiedad.precio),
        tamano_m2: parseFloat(formData.propiedad.tamano_m2)
      };

      // Add property data as JSON string
      submitData.append('propiedad', JSON.stringify(propertyData));
      
      // Add foto_frontal file
      if (formData.propiedad.foto_frontal) {
        submitData.append('foto_frontal', formData.propiedad.foto_frontal);
      }

      // Add services and classification
      submitData.append('services', JSON.stringify(formData.services));
      submitData.append('classification', JSON.stringify(formData.classification));
      
      // Add fotos_adicionales
      submitData.append('fotos_adicionales', JSON.stringify(formData.fotos_adicionales));

      const response = await axios.post(API_URL, submitData, {
        headers: {
          'Authorization': `Token ${TOKEN}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Propiedad registrada exitosamente!');
      setView('catalog');
      setStep(1);
    } catch (error) {
      toast.error('Error al registrar la propiedad');
      console.error('Error:', error);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={() => setView('catalog')}
                className={`inline-flex items-center px-4 py-2 border-b-2 ${
                  view === 'catalog' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                } hover:text-indigo-600 hover:border-indigo-300`}
              >
                <Grid className="h-5 w-5 mr-2" />
                Catálogo
              </button>
              <button
                onClick={() => setView('form')}
                className={`inline-flex items-center px-4 py-2 border-b-2 ${
                  view === 'form' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                } hover:text-indigo-600 hover:border-indigo-300`}
              >
                <Plus className="h-5 w-5 mr-2" />
                Nueva Propiedad
              </button>
            </div>
          </div>
        </div>
      </nav>

      {view === 'catalog' ? (
        <Catalog />
      ) : (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Registro de Propiedad
            </h1>

            <div className="flex justify-center mb-8">
              {steps.map((s, i) => (
                <div key={s.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full 
                    ${step >= s.number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                    <s.icon size={20} />
                  </div>
                  <div className={`text-sm ${step >= s.number ? 'text-indigo-600' : 'text-gray-500'} 
                    mx-2 hidden sm:block`}>
                    {s.title}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-12 h-1 mx-2 ${step > s.number ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8">
              {step === 1 && (
                <PropertyForm 
                  onNext={nextStep}
                  updateFormData={(data) => updateFormData('propiedad', data)}
                />
              )}
              {step === 2 && (
                <ServicesForm
                  onNext={nextStep}
                  onPrev={prevStep}
                  updateFormData={(data) => updateFormData('services', data)}
                />
              )}
              {step === 3 && (
                <ClassificationForm
                  onPrev={prevStep}
                  onSubmit={handleSubmit}
                  updateFormData={(data) => updateFormData('classification', data)}
                />
              )}
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-right" />
    </div>
  );
}

export default App;