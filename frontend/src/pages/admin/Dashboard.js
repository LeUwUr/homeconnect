import React, { useState, useEffect } from 'react';
import { Calendar, Download } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getProperties } from '../../utils/api';
import { exportToExcel } from '../../utils/exportToExcel';
import StatCard from '../../components/admin/StatCard';
import DateRangePicker from '../../components/admin/DateRangePicker';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    negotiating: 0,
    sold: 0
  });

  useEffect(() => {
    fetchProperties();
  }, [dateRange]);

  const fetchProperties = async () => {
    try {
      const response = await getProperties();
      const filteredProperties = filterPropertiesByDate(response.data);
      setProperties(filteredProperties);
      calculateStats(filteredProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  };

  const filterPropertiesByDate = (props) => {
    if (!dateRange.start || !dateRange.end) return props;
    return props.filter(prop => {
      const date = new Date(prop.fecha_publicacion);
      return date >= dateRange.start && date <= dateRange.end;
    });
  };

  const calculateStats = (props) => {
    const stats = {
      total: props.length,
      active: props.filter(p => p.disponibilidad === 'Disponible').length,
      negotiating: props.filter(p => p.disponibilidad === 'En negociación').length,
      sold: props.filter(p => p.disponibilidad === 'Vendido').length
    };
    setStats(stats);
  };

  const pieChartData = {
    labels: ['Disponibles', 'En negociación', 'Vendidas'],
    datasets: [{
      data: [stats.active, stats.negotiating, stats.sold],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  const handleExport = () => {
    const data = properties.map(p => ({
      Título: p.titulo,
      Precio: p.precio,
      Estado: p.estado,
      Disponibilidad: p.disponibilidad,
      'Fecha Publicación': p.fecha_publicacion
    }));
    exportToExcel(data, 'propiedades-reporte');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-4">
          <DateRangePicker onChange={setDateRange} />
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Propiedades"
          value={stats.total}
          icon={Calendar}
          color="bg-blue-500"
        />
        <StatCard
          title="Propiedades Activas"
          value={stats.active}
          icon={Calendar}
          color="bg-green-500"
        />
        <StatCard
          title="En Negociación"
          value={stats.negotiating}
          icon={Calendar}
          color="bg-yellow-500"
        />
        <StatCard
          title="Propiedades Vendidas"
          value={stats.sold}
          icon={Calendar}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Distribución de Propiedades</h2>
        <div className="w-full max-w-md mx-auto">
          <Pie data={pieChartData} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;