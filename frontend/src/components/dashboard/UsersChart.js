import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { format, parseISO, eachDayOfInterval, eachMonthOfInterval, eachYearOfInterval } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Registrar los elementos necesarios
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function UsersChart({ users }) {
  // Estado para el filtro de fechas
  const [startDate, setStartDate] = useState(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState(new Date());

  // Estado para la granularidad (días, meses o años)
  const [timeInterval, setTimeInterval] = useState('months');

  // Función para agrupar los usuarios según la fecha
  const filterAndGroupUsers = () => {
    const buyerUsers = users.filter(user => user.tipo_usuario === 'Comprador');
    const groupedData = {};

    buyerUsers.forEach(user => {
      const date = parseISO(user.fecha_registro);
      if (date >= startDate && date <= endDate) {  // Filtra los usuarios según el rango de fechas
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
      }
    });

    return groupedData;
  };

  // Función para generar las etiquetas de la gráfica según el intervalo de tiempo
  const getDateLabels = () => {
    let labels = [];
    switch (timeInterval) {
      case 'days':
        labels = eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM-dd'));
        break;
      case 'months':
        labels = eachMonthOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM'));
        break;
      case 'years':
        labels = eachYearOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy'));
        break;
      default:
        labels = eachDayOfInterval({ start: startDate, end: endDate }).map(date => format(date, 'yyyy-MM-dd'));
    }

    return labels;
  };

  // Obtener los datos para la gráfica
  const chartData = {
    labels: getDateLabels(),
    datasets: [
      {
        label: 'Usuarios Compradores',
        data: getDateLabels().map(label => {
          const groupedData = filterAndGroupUsers();
          return groupedData[label] || 0;  // Si no hay datos, se coloca 0
        }),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Opciones para la gráfica
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
      {/* Filtro de fecha */}
      <div className="mb-4 flex items-center">
        <label htmlFor="startDate" className="mr-2 flex items-center">Fecha de inicio:</label>
        <DatePicker
          id="startDate"
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded mr-4"
        />

        <label htmlFor="endDate" className="mr-2 flex items-center">Fecha de fin:</label>
        <DatePicker
          id="endDate"
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border p-2 rounded"
        />
      </div>

      {/* Selector de intervalo de tiempo */}
      <div className="mb-4">
        <label className="mr-2">Ver por:</label>
        <select
          value={timeInterval}
          onChange={(e) => setTimeInterval(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="days">Días</option>
          <option value="months">Meses</option>
          <option value="years">Años</option>
        </select>
      </div>

      {/* Gráfico */}
      <div style={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}

export default UsersChart;