import React, { useState } from 'react';

interface ClassificationFormProps {
  onPrev: () => void;
  onSubmit: () => void;
  updateFormData: (data: any) => void;
}

const ClassificationForm: React.FC<ClassificationFormProps> = ({ onPrev, onSubmit, updateFormData }) => {
  const [classification, setClassification] = useState({
    ubicacion: '',
    estado_propiedad: '',
    privada: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setClassification(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData(classification);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Ubicación</label>
          <select
            name="ubicacion"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={classification.ubicacion}
            onChange={handleChange}
          >
            <option value="">Seleccione ubicación</option>
            <option value="urbana">Urbana</option>
            <option value="suburbana">Suburbana</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Estado de la Propiedad</label>
          <select
            name="estado_propiedad"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={classification.estado_propiedad}
            onChange={handleChange}
          >
            <option value="">Seleccione estado</option>
            <option value="nueva">Nueva</option>
            <option value="usada">Usada</option>
            <option value="remodelada">Remodelada</option>
            <option value="en_construccion">En Construcción</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
          <select
            name="privada"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={classification.privada}
            onChange={handleChange}
          >
            <option value="">Seleccione tipo</option>
            <option value="si">Privada</option>
            <option value="no">No Privada</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Anterior
        </button>
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Registrar Propiedad
        </button>
      </div>
    </form>
  );
};

export default ClassificationForm;