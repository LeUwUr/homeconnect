import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { X, Check, ArrowLeft } from 'lucide-react';

function PropertyDetail({ propertyId, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/moduloac/propiedades/fullinfo/${propertyId}/`,
          {
            headers: {
              'Authorization': 'Token 5d6d86a40448dfb53abd9ca53d222ffec7ef6c2f'
            }
          }
        );
        setDetails(response.data);
        setSelectedImage(response.data.propiedad.foto_frontal);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [propertyId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!details) return null;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(price));
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
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={onClose}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Volver
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{details.propiedad.titulo}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <img
                  src={'http://127.0.0.1:8000/moduloac'+selectedImage}
                  alt={details.propiedad.titulo}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                {details.fotos_adicionales.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    <img
                      src={'http://127.0.0.1:8000/moduloac'+details.propiedad.foto_frontal}
                      alt="Frontal"
                      className={`w-full h-20 object-cover rounded cursor-pointer ${
                        selectedImage === details.propiedad.foto_frontal ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => setSelectedImage(details.propiedad.foto_frontal)}
                    />
                    {details.fotos_adicionales.map(foto => (
                      <img
                        key={foto.id}
                        src={'http://127.0.0.1:8000/moduloac'+foto.url_foto}
                        alt={`Adicional ${foto.id}`}
                        className={`w-full h-20 object-cover rounded cursor-pointer ${
                          selectedImage === foto.url_foto ? 'ring-2 ring-indigo-500' : ''
                        }`}
                        onClick={() => setSelectedImage(foto.url_foto)}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Detalles de la Propiedad</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Precio</p>
                      <p className="font-semibold">{formatPrice(details.propiedad.precio)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tamaño terreno</p>
                      <p className="font-semibold">{details.propiedad.tamano_m2_terr} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tamaño construcción</p>
                      <p className="font-semibold">{details.propiedad.tamano_m2_const} m²</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado</p>
                      <p className="font-semibold">{details.propiedad.estado}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Disponibilidad</p>
                      <p className="font-semibold">{details.propiedad.disponibilidad || 'No especificada'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Ubicación</h3>
                  <p className="mt-1">{details.propiedad.direccion}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Fechas</h3>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Adquisición</p>
                      <p className="font-semibold">
                        {format(new Date(details.propiedad.fecha_adquisicion), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    {details.propiedad.fecha_publicacion && (
                      <div>
                        <p className="text-sm text-gray-500">Publicación</p>
                        <p className="font-semibold">
                          {format(new Date(details.propiedad.fecha_publicacion), 'dd/MM/yyyy')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Servicios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(serviceCategories).map(([category, services]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-gray-900">{category}</h4>
                    <div className="space-y-1">
                      {services.map(service => (
                        <div key={service} className="flex items-center">
                          {details.servicios[service] ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          <span className="text-sm">
                            {service.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Clasificación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {details.clasificacion[0] && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Ubicación</p>
                      <p className="font-semibold">{details.clasificacion[0].ubicacion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado de la Propiedad</p>
                      <p className="font-semibold">{details.clasificacion[0].estado_propiedad}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Privada</p>
                      <p className="font-semibold">{details.clasificacion[0].privada === 'Si' ? 'Sí' : 'No'}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;