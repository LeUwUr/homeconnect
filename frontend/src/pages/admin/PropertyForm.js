import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropertyFormComponent from '../../components/admin/PropertyFormComponent';
import { createProperty } from '../../utils/api';
import toast from 'react-hot-toast';

function PropertyForm() {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await createProperty(formData);
      toast.success('Propiedad creada exitosamente');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error creating property:', error);
      toast.error('Error al crear la propiedad');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Nueva Propiedad</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <PropertyFormComponent onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

export default PropertyForm;