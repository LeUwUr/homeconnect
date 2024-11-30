import React from 'react';

function ServiceFilters({ filters, onChange }) {
  const serviceCategories = {
    'Servicios Básicos': ['electricidad', 'agua', 'gas', 'internet', 'television_cable'],
    'Comodidades': ['aire_acondicionado', 'calefaccion', 'cocina_equipada', 'closets_empotrados'],
    'Espacios Exteriores': ['jardin_privado', 'patio_privado', 'terraza', 'balcon', 'piscina', 'jacuzzi'],
    'Seguridad': ['camaras_vigilancia', 'alarmas', 'cercas_electricas', 'acceso_controlado', 'seguridad_24_7'],
    'Tecnología': ['domotica', 'automatizacion_luces', 'cerraduras_inteligentes', 'termostato_inteligente'],
    'Espacios Adicionales': ['oficina_en_casa', 'estacionamiento_cubierto', 'cochera', 'cuarto_servicio', 'lavadero', 'bodega'],
    'Áreas Comunes': ['areas_verdes_comunes', 'jardines', 'zona_juegos_infantiles', 'gimnasio', 'area_deportiva'],
    'Sustentabilidad': ['paneles_solares', 'cisterna', 'captacion_agua_lluvia', 'ventanas_doble_vidrio', 'aislamiento_termico', 'jardines_verticales']
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Servicios</h3>
      <div className="space-y-6">
        {Object.entries(serviceCategories).map(([category, services]) => (
          <div key={category}>
            <h4 className="text-sm font-medium text-gray-900 mb-2">{category}</h4>
            <div className="space-y-2">
              {services.map(service => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters[service]}
                    onChange={() => onChange(service)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    {service.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServiceFilters;