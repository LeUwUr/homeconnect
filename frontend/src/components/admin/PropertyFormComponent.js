import React, { useState } from 'react';
import { Home, Building2, Sparkles, Plus, Grid, Image } from 'lucide-react';
import PropertyForm from '../PropertyForm';
import ServicesForm from '../ServicesForm';
import ClassificationForm from '../ClassificationForm';
import PhotosForm from '../PhotosForm';
import { toast, Toaster } from 'react-hot-toast';
import { registerProperty, registerServices, registerClassification, registerAdditionalPhoto } from '../../utils/api';

function PropertyFormComponent() {
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
    { number: 2, title: 'Fotos', icon: Image },
    { number: 3, title: 'Servicios', icon: Sparkles },
    { number: 4, title: 'Clasificación', icon: Building2 }
  ];

  const handleSubmit = async () => {
    try {
      const propertyFormData = new FormData();
      Object.entries(formData.propiedad).forEach(([key, value]) => {
        if (key === 'foto_frontal' && value instanceof File) {
          propertyFormData.append('foto_frontal', value);
        } else if (value !== null) {
          propertyFormData.append(key, value.toString());
        }
      });

      const propertyResponse = await registerProperty(propertyFormData);
      const propertyId = propertyResponse.id;

      await registerServices({
        propiedad: propertyId,
        ...formData.services
      });

      await registerClassification({
        propiedad: propertyId,
        ...formData.classification
      });

      for (const photo of formData.fotos_adicionales) {
        const photoFormData = new FormData();
        photoFormData.append('url_foto', photo);
        photoFormData.append('propiedad', propertyId.toString());
        await registerAdditionalPhoto(photoFormData);
      }

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
                  updateFormData={data => updateFormData('propiedad', data)}
                />
              )}
              {step === 2 && (
                <PhotosForm
                  onNext={nextStep}
                  onPrev={prevStep}
                  updateFormData={data => updateFormData('fotos_adicionales', data)}
                />
              )}
              {step === 3 && (
                <ServicesForm
                  onNext={nextStep}
                  onPrev={prevStep}
                  updateFormData={data => updateFormData('services', data)}
                />
              )}
              {step === 4 && (
                <ClassificationForm
                  onPrev={prevStep}
                  onSubmit={handleSubmit}
                  updateFormData={data => updateFormData('classification', data)}
                />
              )}
            </div>
          </div>
        </div>
      <Toaster position="top-right" />
    </div>
  );
}

export default PropertyFormComponent;
