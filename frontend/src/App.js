import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Routes
import PublicLayout from './layouts/PublicLayout';
import Home from './pages/public/Home';
import PropertyCatalog from './pages/public/PropertyCatalog';
import PropertyDetails from './pages/public/PropertyDetails';

// Admin Routes
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import PropertyList from './pages/admin/PropertyList';
import PropertyForm from './pages/admin/PropertyForm';
import PropertyEdit from './pages/admin/PropertyEdit';
import PropertyView from './pages/admin/PropertyView';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<PropertyCatalog />} />
          <Route path="property/:id" element={<PropertyDetails />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="properties" element={<PropertyList />} />
          <Route path="properties/new" element={<PropertyForm />} />
          <Route path="properties/:id/edit" element={<PropertyEdit />} />
          <Route path="properties/:id" element={<PropertyView />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;