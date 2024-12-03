import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { fetchProperties, fetchUsers, fetchClassifications } from '../../utils/api';
import StatCard from '../../components/dashboard/StatCard';
import UsersChart from '../../components/dashboard/UsersChart';
import PropertiesChart from '../../components/dashboard/PropertiesChart';

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [users, setUsers] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeInterval, setTimeInterval] = useState('months');
  const [chartFilter, setChartFilter] = useState('status');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [propertiesData, usersData, classificationsData] = await Promise.all([
          fetchProperties(),
          fetchUsers(),
          fetchClassifications(),
        ]);

        setProperties(propertiesData);
        setUsers(usersData);
        setClassifications(classificationsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Ocurrió un error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const stats = React.useMemo(() => {
    return {
      totalUsers: users.filter(user => user.tipo_usuario === 'Comprador').length,
      totalProperties: properties.length,
      activeProperties: classifications.filter(c => c.estado_propiedad === 'Activa').length,
      negotiatingProperties: classifications.filter(c => c.estado_propiedad === 'En negociación').length,
      soldProperties: classifications.filter(c => c.estado_propiedad === 'Negociada').length,
    };
  }, [users, properties]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Usuarios"
          value={stats.totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Propiedades"
          value={stats.totalProperties}
          icon={Building2}
          color="bg-indigo-500"
        />
        <StatCard
          title="Propiedades Activas"
          value={stats.activeProperties}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="En Negociación"
          value={stats.negotiatingProperties}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Propiedades Negociadas"
          value={stats.soldProperties}
          icon={DollarSign}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Usuarios Registrados</h2>
            <label>
              <span className="sr-only">Filtrar usuarios por:</span>
              <select
                value={timeInterval}
                onChange={(e) => setTimeInterval(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="days">Por Días</option>
                <option value="months">Por Meses</option>
                <option value="years">Por Años</option>
              </select>
            </label>
          </div>
          <UsersChart users={users} timeInterval={timeInterval} />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Propiedades</h2>
            <label>
              <span className="sr-only">Filtrar propiedades por:</span>
              <select
                value={chartFilter}
                onChange={(e) => setChartFilter(e.target.value)}
                className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="status">Por Status</option>
                <option value="classification">Por Ubicación</option>
                <option value="state">Por Estado</option>
                <option value="privacy">Por Tipo de privada</option>
              </select>
            </label>
          </div>
          <PropertiesChart
            properties={properties}
            classifications={classifications}
            filterType={chartFilter}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
