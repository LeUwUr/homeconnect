import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar elementos necesarios
ChartJS.register(ArcElement, Tooltip, Legend);

function PropertiesChart({ properties, classifications, filterType }) {
  const getChartData = () => {
    if (filterType === 'classification') {
      const classificationCounts = {};
      classifications.forEach(classification => {
        const key = classification.ubicacion || 'Sin Clasificación';
        classificationCounts[key] = (classificationCounts[key] || 0) + 1;
      });

      return {
        labels: Object.keys(classificationCounts),
        data: Object.values(classificationCounts),
        backgroundColor: generateColors(Object.keys(classificationCounts).length),
      };
    } else {
      const statusCounts = {};
      properties.forEach(property => {
        const key = property.estado || 'Sin Estado';
        statusCounts[key] = (statusCounts[key] || 0) + 1;
      });

      return {
        labels: Object.keys(statusCounts),
        data: Object.values(statusCounts),
        backgroundColor: generateColors(Object.keys(statusCounts).length),
      };
    }
  };

  const generateColors = (count) => {
    const baseColors = [
      'rgba(99, 102, 241, 0.6)',
      'rgba(251, 146, 60, 0.6)',
      'rgba(52, 211, 153, 0.6)',
      'rgba(249, 115, 22, 0.6)',
      'rgba(168, 85, 247, 0.6)',
      'rgba(34, 197, 94, 0.6)',
      'rgba(234, 179, 8, 0.6)',
      'rgba(239, 68, 68, 0.6)',
    ];
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  const chartData = getChartData();
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: filterType === 'classification' ? 'Propiedades por Clasificación' : 'Propiedades por Estado',
      },
    },
  };

  if (properties.length === 0 && classifications.length === 0) {
    return <p className="text-gray-500">No hay datos para mostrar en el gráfico.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow" aria-label="Gráfico de propiedades">
      <Pie
        data={{
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
              backgroundColor: chartData.backgroundColor,
              borderWidth: 1,
            },
          ],
        }}
        options={options}
      />
    </div>
  );
}

export default PropertiesChart;
