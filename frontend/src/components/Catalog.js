import React, { useEffect, useState } from 'react';
import { Search, Home, MapPin, Calendar, DollarSign, Ruler, Eye, Filter } from 'lucide-react';
import { format } from 'date-fns';
import PropertyDetail from './PropertyDetail';
import ServiceFilters from './ServiceFilters';
import PriceFilter from './PriceFilter';
import { fetchProperties, fetchPropertyDetails } from '../utils/api';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
};

function Catalog() {
  const [properties, setProperties] = useState([]);
  const [propertyDetails, setPropertyDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [filters, setFilters] = useState({
    services: {
      electricidad: false,
      agua: false,
      gas: false,
      internet: false,
      television_cable: false,
      aire_acondicionado: false,
      calefaccion: false,
      cocina_equipada: false,
      closets_empotrados: false,
      jardin_privado: false,
      patio_privado: false,
      terraza: false,
      balcon: false,
      piscina: false,
      jacuzzi: false,
      camaras_vigilancia: false,
      alarmas: false,
      cercas_electricas: false,
      acceso_controlado: false,
      domotica: false,
      automatizacion_luces: false,
      cerraduras_inteligentes: false,
      termostato_inteligente: false,
      oficina_en_casa: false,
      estacionamiento_cubierto: false,
      cochera: false,
      cuarto_servicio: false,
      lavadero: false,
      bodega: false,
      seguridad_24_7: false,
      areas_verdes_comunes: false,
      jardines: false,
      zona_juegos_infantiles: false,
      gimnasio: false,
      area_deportiva: false,
      paneles_solares: false,
      cisterna: false,
      captacion_agua_lluvia: false,
      ventanas_doble_vidrio: false,
      aislamiento_termico: false,
      jardines_verticales: false
    },
    classification: {
      ubicacion: '',
      estado_propiedad: '',
      privada: '',
    },
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await fetchProperties();
      setProperties(data.filter((prop) => !prop.eliminado));
      
      // Fetch details for each property
      for (const property of data) {
        if (!property.eliminado) {
          const details = await fetchPropertyDetails(property.id);
          setPropertyDetails(prev => ({
            ...prev,
            [property.id]: details
          }));
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las propiedades');
      setLoading(false);
    }
  };

  const handleServiceFilterChange = (service) => {
    setFilters(prev => ({
      ...prev,
      services: {
        ...prev.services,
        [service]: !prev.services[service]
      }
    }));
  };

  const handleClassificationFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      classification: {
        ...prev.classification,
        [field]: value
      }
    }));
  };

  const handlePriceRangeChange = (range) => {
    setPriceRange(range);
  };

  const getFilteredProperties = () => {
    return properties.filter(property => {
      const details = propertyDetails[property.id];
      
      // Search filter
      const matchesSearch = 
        property.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.direccion.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      // State filter
      if (stateFilter && property.estado !== stateFilter) return false;

      // Price filter
      if (priceRange.min && parseFloat(property.precio) < parseFloat(priceRange.min)) return false;
      if (priceRange.max && parseFloat(property.precio) > parseFloat(priceRange.max)) return false;

      // Services filter
      const activeServices = Object.entries(filters.services)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      if (activeServices.length > 0 && details?.servicios) {
        const hasAllServices = activeServices.every(service => details.servicios[service]);
        if (!hasAllServices) return false;
      }

      // Classification filter
      if (details?.clasificacion?.[0]) {
        const classification = details.clasificacion[0];
        if (filters.classification.ubicacion && 
            classification.ubicacion !== filters.classification.ubicacion) return false;
        if (filters.classification.estado_propiedad && 
            classification.estado_propiedad !== filters.classification.estado_propiedad) return false;
        if (filters.classification.privada && 
            classification.privada !== filters.classification.privada) return false;
      }

      return true;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  const filteredProperties = getFilteredProperties();
  const states = [...new Set(properties.map(p => p.estado))];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className={`lg:w-80 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <PriceFilter onChange={handlePriceRangeChange} />
            
            <ServiceFilters
              filters={filters.services}
              onChange={handleServiceFilterChange}
            />

            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Clasificación</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ubicación</label>
                  <select
                    value={filters.classification.ubicacion}
                    onChange={(e) => handleClassificationFilterChange('ubicacion', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todas</option>
                    <option value="urbana">Urbana</option>
                    <option value="suburbana">Suburbana</option>
                    <option value="rural">Rural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Estado de la Propiedad</label>
                  <select
                    value={filters.classification.estado_propiedad}
                    onChange={(e) => handleClassificationFilterChange('estado_propiedad', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todos</option>
                    <option value="nueva">Nueva</option>
                    <option value="usada">Usada</option>
                    <option value="remodelada">Remodelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Privada</label>
                  <select
                    value={filters.classification.privada}
                    onChange={(e) => handleClassificationFilterChange('privada', e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Todas</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
              <h1 className="text-3xl font-bold text-gray-900">Catálogo de Propiedades</h1>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="h-5 w-5 mr-2" />
                  {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
                </button>

                <div className="flex space-x-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-none">
                    <input
                      type="text"
                      placeholder="Buscar propiedades..."
                      className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  
                  <select
                    className="flex-1 sm:flex-none border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={stateFilter}
                    onChange={(e) => setStateFilter(e.target.value)}
                  >
                    <option value="">Todos los estados</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
                >
                  <div className="relative h-48">
                    <img
                      src={property.foto_frontal.startsWith('/media') ? 
                        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop' : 
                        property.foto_frontal}
                      alt={property.titulo}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                      <Home className="h-5 w-5 text-indigo-600" />
                      {property.titulo}
                    </h3>

                    <div className="space-y-2">
                      <p className="flex items-center text-gray-600 gap-2">
                        <MapPin className="h-4 w-4" />
                        {property.direccion}
                      </p>
                      <p className="flex items-center text-gray-600 gap-2">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(property.fecha_adquisicion), 'dd/MM/yyyy')}
                      </p>
                      <p className="flex items-center text-gray-600 gap-2">
                        <Ruler className="h-4 w-4" />
                        {property.tamano_m2} m²
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                      <p className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        {formatPrice(property.precio)}
                      </p>
                      <button
                        onClick={() => setSelectedProperty(property.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedProperty && (
        <PropertyDetail
          propertyId={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
}

export default Catalog;