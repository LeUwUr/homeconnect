import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Plus } from 'lucide-react';
import { getProperties } from '../../utils/api';
import { format } from 'date-fns';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('titulo'); // Campo por el cual ordenar
  const [sortDirection, setSortDirection] = useState('asc'); // Dirección de orden
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await getProperties();
      setProperties(response.data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const sortProperties = (field) => {
    const newSortDirection = sortBy === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(field);
    setSortDirection(newSortDirection);

    const sortedProperties = [...properties].sort((a, b) => {
      if (a[field] < b[field]) return newSortDirection === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return newSortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setProperties(sortedProperties);
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
        <h1 className="text-2xl font-bold text-gray-900">Propiedades</h1>
        <button
          onClick={() => navigate('/admin/properties/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Propiedad
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span
                  onClick={() => sortProperties('titulo')}
                  className="cursor-pointer"
                >
                  Propiedad {sortBy === 'titulo' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span
                  onClick={() => sortProperties('precio')}
                  className="cursor-pointer"
                >
                  Precio {sortBy === 'precio' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span
                  onClick={() => sortProperties('estado')}
                  className="cursor-pointer"
                >
                  Estado {sortBy === 'estado' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span
                  onClick={() => sortProperties('fecha_adquisicion')}
                  className="cursor-pointer"
                >
                  Fecha {sortBy === 'fecha_adquisicion' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span
                  onClick={() => sortProperties('estado_propiedad')}
                  className="cursor-pointer"
                >
                  Status {sortBy === 'estado_propiedad' && (sortDirection === 'asc' ? '↑' : '↓')}
                </span>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={'http://127.0.0.1:8000/moduloac' + property.foto_frontal}
                        alt={property.titulo}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{property.titulo}</div>
                      <div className="text-sm text-gray-500">{property.direccion}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatPrice(property.precio)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {property.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(property.fecha_adquisicion), 'dd/MM/yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {property.estado_propiedad}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => navigate(`/admin/properties/${property.id}`)}
                    className="text-indigo-600 bg-transparent  hover:bg-indigo-900 hover:text-white"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                    className="text-indigo-600 bg-transparent hover:bg-indigo-900 hover:text-white"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PropertyList;
