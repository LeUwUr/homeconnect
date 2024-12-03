import React, { useState } from 'react';
import { Home, Building2, Sparkles, Plus, Grid, Image } from 'lucide-react';
import PropertyForm from '../PropertyForm';
import ServicesForm from '../ServicesForm';
import ClassificationForm from '../ClassificationForm';
import PhotosForm from '../PhotosForm';
import { toast, Toaster } from 'react-hot-toast';
import { registerProperty, registerServices, registerClassification, registerAdditionalPhoto } from '../../utils/api';

function PropertyFormComponent({ onSubmit, initialData = {}, isEditing = false }) {
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
      fecha_adquisicion: '',
      ...initialData.propiedad, // Carga datos iniciales si existen
    },
    fotos_adicionales: initialData.fotos_adicionales || [],
    services: initialData.servicios || {},
    classification: initialData.clasificacion[0] || {},
  });

  const steps = [
    { number: 1, title: 'Propiedad', icon: Home },
    { number: 2, title: 'Fotos', icon: Image },
    { number: 3, title: 'Servicios', icon: Sparkles },
    { number: 4, title: 'Clasificación', icon: Building2 },
  ];

  // Funciones auxiliares para avanzar y retroceder pasos
  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data,
    }));
  };

  console.log(initialData)

  // Actualiza el manejo del envío
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

      if (isEditing) {
        // Lógica para actualizar la propiedad existente
        await onSubmit(formData);
        toast.success('Propiedad actualizada exitosamente!');
      } else {
        // Lógica para crear una nueva propiedad
        const propertyResponse = await registerProperty(propertyFormData);
        const propertyId = propertyResponse.id;

        await registerServices({ propiedad: propertyId, ...formData.services });
        await registerClassification({ propiedad: propertyId, ...formData.classification });

        for (const photo of formData.fotos_adicionales) {
          const photoFormData = new FormData();
          photoFormData.append('url_foto', photo);
          photoFormData.append('propiedad', propertyId.toString());
          await registerAdditionalPhoto(photoFormData);
        }

        toast.success('Propiedad registrada exitosamente!');
      }

      setView('catalog');
      setStep(1);
    } catch (error) {
      toast.error('Error al registrar/actualizar la propiedad');
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            {isEditing ? 'Editar Propiedad' : 'Registro de Propiedad'}
          </h1>

          {/* Barra de pasos */}
          <div className="flex justify-center mb-8">
            {steps.map((s, i) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full 
                  ${step >= s.number ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                >
                  <s.icon size={20} />
                </div>
                <div
                  className={`text-sm ${step >= s.number ? 'text-indigo-600' : 'text-gray-500'} 
                  mx-2 hidden sm:block`}
                >
                  {s.title}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${step > s.number ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Contenido del paso */}
          <div className="mt-8">
            {step === 1 && (
              <PropertyForm
                onNext={nextStep}
                updateFormData={data => updateFormData('propiedad', data)}
                initialData={formData.propiedad} // Pasar datos iniciales
              />
            )}
            {step === 2 && (
              <PhotosForm
                onNext={nextStep}
                onPrev={prevStep}
                updateFormData={data => updateFormData('fotos_adicionales', data)}
                initialData={formData.fotos_adicionales} // Pasar datos iniciales
              />
            )}
            {step === 3 && (
              <ServicesForm
                onNext={nextStep}
                onPrev={prevStep}
                updateFormData={data => updateFormData('services', data)}
                initialData={formData.services} // Pasar datos iniciales
              />
            )}
            {step === 4 && (
              <ClassificationForm
                onPrev={prevStep}
                onSubmit={handleSubmit}
                updateFormData={data => updateFormData('classification', data)}
                initialData={formData.classification} // Pasar datos iniciales
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
