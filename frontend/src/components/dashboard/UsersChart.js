import React from 'react';
import { Line } from 'react-chartjs-2';
import { format, parseISO, subDays, subMonths, subYears } from 'date-fns';

function UsersChart({ users, timeInterval }) {
  const filterAndGroupUsers = () => {
    const buyerUsers = users.filter(user => user.tipo_usuario === 'Comprador');
    const groupedData = {};

    buyerUsers.forEach(user => {
      const date = parseISO(user.fecha_registro);
      let key;

      switch (timeInterval) {
        case 'days':
          key = format(date, 'yyyy-MM-dd');
          break;
        case 'months':
          key = format(date, 'yyyy-MM');
          break;
        case 'years':
          key = format(date, 'yyyy');
          break;
        default:
          key = format(date, 'yyyy-MM-dd');
      }

      groupedData[key] = (groupedData[key] || 0) + 1;
    });

    return groupedData;
  };

  const getDateLabels = () => {
    const today = new Date();
    const labels = [];
    const numberOfPoints = timeInterval === 'days' ? 30 : timeInterval === 'months' ? 12 : 5;

    for (let i = numberOfPoints - 1; i >= 0; i--) {
      const date = timeInterval === 'days' 
        ? subDays(today, i)
        : timeInterval === 'months'
          ? subMonths(today, i)
          : subYears(today, i);

      labels.push(
        timeInterval === 'days'
          ? format(date, 'dd/MM')
          : timeInterval === 'months'
            ? format(date, 'MM/yyyy')
            : format(date, 'yyyy')
      );
    }

    return labels;
  };

  const chartData = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Usuarios Compradores',
        data: getDateLabels().map(label => {
          const groupedData = filterAndGroupUsers();
          return groupedData[label] || 0;
        }),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Registro de Usuarios Compradores',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}

export default UsersChart;