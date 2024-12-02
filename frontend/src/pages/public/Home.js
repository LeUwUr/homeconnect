import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <Building2 className="h-16 w-16 text-indigo-600 mx-auto" />
          <h1 className="mt-4 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Encuentra tu propiedad ideal
          </h1>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Explora nuestra selección de propiedades y encuentra el lugar perfecto para ti
          </p>
          <div className="mt-8">
            <button
              onClick={() => navigate('/catalog')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Search className="h-5 w-5 mr-2" />
              Ver Catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;