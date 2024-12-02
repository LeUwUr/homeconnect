import React from 'react';
import { Calendar } from 'lucide-react';

function DateRangePicker({ onChange }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(prev => ({
      ...prev,
      [name]: value ? new Date(value) : null
    }));
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-5 w-5 text-gray-400" />
      <input
        type="date"
        name="start"
        onChange={handleChange}
        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
      <span className="text-gray-500">a</span>
      <input
        type="date"
        name="end"
        onChange={handleChange}
        className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
}

export default DateRangePicker;