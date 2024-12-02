import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Plus } from 'lucide-react';

function AdminLayout() {
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Propiedades', href: '/admin/properties', icon: Building2 },
    { name: 'Nueva Propiedad', href: '/admin/properties/new', icon: Plus },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-indigo-600">Admin Panel</h1>
          </div>
          <nav className="mt-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
                    isActive ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600' : ''
                  }`
                }
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;