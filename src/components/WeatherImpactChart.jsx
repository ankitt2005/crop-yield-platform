import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Cloud, Thermometer, Droplets, Sun, CloudRain } from 'lucide-react';

function WeatherImpactChart({ data }) {
  // REMOVED TRANSLATION LOGIC

  const avgTemp = (data.reduce((acc, item) => acc + item.temp, 0) / data.length).toFixed(1);
  const avgRainfall = (data.reduce((acc, item) => acc + item.rainfall, 0) / data.length).toFixed(0);
  const avgYield = (data.reduce((acc, item) => acc + item.crop, 0) / data.length).toFixed(0);

  const getWeatherCondition = () => {
    if (parseFloat(avgTemp) > 35) return { status: 'Hot', color: 'red', icon: Sun };
    if (parseFloat(avgTemp) > 25) return { status: 'Warm', color: 'orange', icon: Sun };
    if (parseFloat(avgTemp) > 15) return { status: 'Moderate', color: 'green', icon: Cloud };
    return { status: 'Cool', color: 'blue', icon: CloudRain };
  };

  const weatherCondition = getWeatherCondition();
  const WeatherIcon = weatherCondition.icon;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-2xl border-2 border-blue-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4 mb-1">
              <span className="text-sm" style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-sm" style={{ color: entry.color }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const barColors = {
    temp: ['#ef4444', '#f97316', '#fb923c', '#fbbf24', '#fcd34d', '#fde047'],
    rainfall: ['#3b82f6', '#60a5fa', '#93c5fd', '#2563eb', '#1d4ed8', '#1e40af'],
    crop: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857', '#065f46']
  };

  return (
    <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-6 relative overflow-hidden card-hover">
      <div className="absolute top-0 right-0 w-56 h-56 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-200 to-blue-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full mr-3"></div>
            Weather Impact
          </h3>
          <div className={`flex items-center space-x-2 bg-${weatherCondition.color}-100 px-4 py-2 rounded-full`}>
            <WeatherIcon className={`w-5 h-5 text-${weatherCondition.color}-600`} />
            <span className={`text-sm font-bold text-${weatherCondition.color}-700`}>{weatherCondition.status}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">Monthly weather patterns and crop correlation</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
        <div className="bg-gradient-to-br from-red-500 to-orange-500 rounded-xl p-4 text-white shadow-lg transform hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Thermometer className="w-6 h-6" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">AVG</span>
          </div>
          <p className="text-3xl font-bold">{avgTemp}°C</p>
          <p className="text-xs opacity-90 mt-1">Temperature</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg transform hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Droplets className="w-6 h-6" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">AVG</span>
          </div>
          <p className="text-3xl font-bold">{avgRainfall}</p>
          <p className="text-xs opacity-90 mt-1">Rainfall (mm)</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white shadow-lg transform hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-2">
            <Cloud className="w-6 h-6" />
            <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded">AVG</span>
          </div>
          <p className="text-3xl font-bold">{avgYield}</p>
          <p className="text-xs opacity-90 mt-1">Crop Index</p>
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px', fontWeight: 500 }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
              <Bar dataKey="temp" name="Temperature (°C)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => <Cell key={`cell-temp-${index}`} fill={barColors.temp[index % barColors.temp.length]} />)}
              </Bar>
              <Bar dataKey="rainfall" name="Rainfall (mm)" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => <Cell key={`cell-rain-${index}`} fill={barColors.rainfall[index % barColors.rainfall.length]} />)}
              </Bar>
              <Bar dataKey="crop" name="Crop Index" radius={[8, 8, 0, 0]}>
                {data.map((entry, index) => <Cell key={`cell-crop-${index}`} fill={barColors.crop[index % barColors.crop.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default WeatherImpactChart;