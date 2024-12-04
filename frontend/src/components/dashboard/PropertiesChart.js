import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

// Registrar los elementos necesarios para Chart.js
ChartJS.register(ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

function PropertiesChart({ properties, classifications, filterType }) {
    const getChartData = () => {
        if (filterType === 'classification') {
            const classificationCounts = {};
            classifications.forEach(classification => {
                const key = classification.ubicacion;
                classificationCounts[key] = (classificationCounts[key] || 0) + 1;
            });

            return {
                labels: Object.keys(classificationCounts),
                data: Object.values(classificationCounts),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(251, 146, 60, 0.6)',
                    'rgba(52, 211, 153, 0.6)',
                ],
            };
        } else if (filterType === 'state') {
            const stateCounts = {};
            properties.forEach(property => {
                const key = property.estado;
                stateCounts[key] = (stateCounts[key] || 0) + 1;
            });

            return {
                labels: Object.keys(stateCounts),
                data: Object.values(stateCounts),
                backgroundColor: [
                    'rgba(34, 197, 94, 0.6)',
                    'rgba(234, 179, 8, 0.6)',
                    'rgba(239, 68, 68, 0.6)',
                    'rgba(99, 102, 241, 0.6)',
                ],
            };
        } else if (filterType === 'status') {
            const statusCounts = {};
            classifications.forEach(classification => {
                const key = classification.estado_propiedad; // Aquí usamos estado_propiedad de clasificación
                statusCounts[key] = (statusCounts[key] || 0) + 1;
            });

            return {
                labels: Object.keys(statusCounts),
                data: Object.values(statusCounts),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(251, 146, 60, 0.6)',
                    'rgba(52, 211, 153, 0.6)',
                    'rgba(249, 115, 22, 0.6)',
                    'rgba(168, 85, 247, 0.6)',
                ],
            };
        } else if (filterType === 'privacy') {
            const privacyCounts = {};
            classifications.forEach(classification => {
                const key = classification.privada;  // Asegúrate de que 'privacidad' es el nombre correcto del campo
                privacyCounts[key] = (privacyCounts[key] || 0) + 1;
            });

            return {
                labels: Object.keys(privacyCounts),
                data: Object.values(privacyCounts),
                backgroundColor: [
                    'rgba(99, 102, 241, 0.6)',
                    'rgba(251, 146, 60, 0.6)',
                    'rgba(52, 211, 153, 0.6)',
                ],
            };
        }
    };

    const chartData = {
        labels: getChartData().labels,
        datasets: [
            {
                data: getChartData().data,
                backgroundColor: getChartData().backgroundColor,
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right',
            },
            title: {
                display: true,
                text: filterType === 'classification' ? 'Propiedades por Clasificación' :
                    filterType === 'state' ? 'Propiedades por Estado' :
                        filterType === 'status' ? 'Propiedades por Estado de Propiedad' :
                            'Propiedades por Privacidad',
            },
        },
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <Pie data={chartData} options={options} />
        </div>
    );
}

export default PropertiesChart;