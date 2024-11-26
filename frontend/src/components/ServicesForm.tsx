import React, { useState } from 'react';

interface ServicesFormProps {
  onNext: () => void;
  onPrev: () => void;
  updateFormData: (data: any) => void;
}

const ServicesForm: React.FC<ServicesFormProps> = ({ onNext, onPrev, updateFormData }) => {
  const [services, setServices] = useState({
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setServices(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData(services);
    onNext();
  };

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
    <form onSubmit={handleSubmit} className="space-y-6">
      {Object.entries(serviceCategories).map(([category, items]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(service => (
              <div key={service} className="flex items-center">
                <input
                  type="checkbox"
                  id={service}
                  name={service}
                  checked={services[service as keyof typeof services]}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor={service} className="ml-2 block text-sm text-gray-900">
                  {service.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

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
          Siguiente
        </button>
      </div>
    </form>
  );
};

export default ServicesForm;