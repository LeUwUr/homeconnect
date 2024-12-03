import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';

function PropertyForm({ onNext, updateFormData, initialData = {} }) {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario || 1,
    titulo: initialData.titulo || '',
    precio: initialData.precio || '',
    foto_frontal: initialData.foto_frontal || null,
    direccion: initialData.direccion || '',
    tamano_m2_terr: initialData.tamano_m2_terr || '',
    tamano_m2_const: initialData.tamano_m2_const || '',
    estado: initialData.estado || 'Nuevo',
    fecha_adquisicion: initialData.fecha_adquisicion || format(new Date(), 'yyyy-MM-dd'),
    fecha_publicacion: initialData.fecha_publicacion || format(new Date(), 'yyyy-MM-dd'),
    fecha_venta: initialData.fecha_venta || null,
    eliminado: initialData.eliminado || false,
  });

  const [previewUrl, setPreviewUrl] = useState('');

  // Efecto para mostrar la imagen inicial en el modo de edición
  useEffect(() => {
    if (initialData.foto_frontal && typeof initialData.foto_frontal === 'string') {
      setPreviewUrl(initialData.foto_frontal); // URL existente
    }
  }, [initialData.foto_frontal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        foto_frontal: file,
      }));

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateFormData(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Foto Frontal</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
            <div className="space-y-2 text-center">
              {previewUrl ? (
                <div className="relative">
                  <img
                    src={
                      previewUrl.startsWith('/media')
                        ? `http://127.0.0.1:8000/moduloac${previewUrl}`
                        : previewUrl
                    }
                    alt="Preview"
                    className="mx-auto h-40 w-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewUrl('');
                      setFormData((prev) => ({ ...prev, foto_frontal: null }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="foto-frontal"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      <span>Subir foto</span>
                      <input
                        id="foto-frontal"
                        name="foto_frontal"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handlePhotoChange}
                      />
                    </label>
                    <p className="pl-1">o arrastrar y soltar</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG hasta 10MB</p>
                </>
              )}
            </div>
          </div>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="titulo"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.titulo}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input
            type="number"
            name="precio"
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.precio}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Tamaño Terreno (m²)</label>
          <input
            type="number"
            name="tamano_m2_terr"
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.tamano_m2_terr}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Tamaño Construcción (m²)</label>
          <input
            type="number"
            name="tamano_m2_const"
            required
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.tamano_m2_const}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="estado"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Nuevo">Nuevo</option>
            <option value="Usado">Usado</option>
            <option value="En construcción">En construcción</option>
          </select>
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Adquisición</label>
          <input
            type="date"
            name="fecha_adquisicion"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.fecha_adquisicion}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <label className="block text-sm font-medium text-gray-700">Fecha de Publicación</label>
          <input
            type="date"
            name="fecha_publicacion"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.fecha_publicacion}
            onChange={handleChange}
          />
        </div>
      </div>
  
      <div>
        <label className="block text-sm font-medium text-gray-700">Dirección</label>
        <input
          type="text"
          name="direccion"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          value={formData.direccion}
          onChange={handleChange}
        />
      </div>
  
      <div className="flex justify-end">
        <button
          type="submit"
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Siguiente
        </button>
      </div>
    </form>
  );
}
export default PropertyForm;
