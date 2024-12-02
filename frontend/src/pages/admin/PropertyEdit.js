import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PropertyFormComponent from '../../components/admin/PropertyFormComponent';
import { getPropertyDetails, updateProperty, updateClassification, updateServices } from '../../utils/api';
import toast from 'react-hot-toast';

function PropertyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPropertyDetails();
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      const response = await getPropertyDetails(id);
      setProperty(response.data);
    } catch (error) {
      console.error('Error fetching property details:', error);
      toast.error('Error al cargar los detalles de la propiedad');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await updateProperty(id, formData.propiedad);
      if (property.clasificacion[0]) {
        await updateClassification(property.clasificacion[0].id, formData.classification);
      }
      if (property.servicios.id) {
        await updateServices(property.servicios.id, formData.services);
      }
      toast.success('Propiedad actualizada exitosamente');
      navigate('/admin/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error al actualizar la propiedad');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
      </div>

      <div className="bg-white shadow-lg rounded-lg">
        <PropertyFormComponent 
          onSubmit={handleSubmit}
          initialData={property}
          isEditing={true}
        />
      </div>
    </div>
  );
}

export default PropertyEdit;