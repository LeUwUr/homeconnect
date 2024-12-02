import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Grid } from 'lucide-react';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 border-b-2 ${
                    isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  } hover:text-indigo-600 hover:border-indigo-300`
                }
              >
                <Home className="h-5 w-5 mr-2" />
                Inicio
              </NavLink>
              <NavLink
                to="/catalog"
                className={({ isActive }) =>
                  `inline-flex items-center px-4 py-2 border-b-2 ${
                    isActive ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500'
                  } hover:text-indigo-600 hover:border-indigo-300`
                }
              >
                <Grid className="h-5 w-5 mr-2" />
                Catálogo
              </NavLink>
            </div>
            <div className="flex items-center">
              <NavLink
                to="/admin"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Panel Admin
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;