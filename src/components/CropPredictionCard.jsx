import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Target, Zap } from 'lucide-react';

function CropPredictionCard({ prediction }) {
  // REMOVED TRANSLATION LOGIC

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-green-200">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: <span className="font-semibold">{entry.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-200 to-emerald-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-200 to-teal-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 mb-6">
        <div className="relative z-10 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center mb-2">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                <Award className="w-8 h-8 text-green-600 mr-3" />
                Crop Predictions
              </h2>
            </div>
            <p className="text-gray-600">Based on advanced machine learning analysis</p>
          </div>

          {/* PATENT CLAIM: AI CONFIDENCE LEVEL */}
          <div className="flex items-center space-x-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-2xl shadow border border-green-100">
            <div className="flex flex-col">
              <span className="text-xs text-green-600 font-bold uppercase tracking-wider mb-1">AI Confidence Level</span>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-500 animate-pulse" />
                <span className="text-2xl font-black text-gray-800">{prediction.suitabilityScore || 85.5}%</span>
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200" strokeWidth="4" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-green-500 transition-all duration-1000 ease-out" strokeDasharray={`${prediction.suitabilityScore || 85.5}, 100`} strokeWidth="4" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium opacity-90">Current Estimate</p>
                <Target className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-1">{prediction.currentCrop}</p>
              <p className="text-sm opacity-90">{prediction.unit}</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium opacity-90">Optimized Potential</p>
                <TrendingUp className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-1">{prediction.optimizedCrop}</p>
              <p className="text-sm opacity-90">{prediction.unit}</p>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium opacity-90">Growth Potential</p>
                <Zap className="w-5 h-5 opacity-75" />
              </div>
              <p className="text-4xl font-bold mb-1">+{prediction.improvement}%</p>
              <p className="text-sm opacity-90">potential gain</p>
            </div>
          </div>
        </div>

        <div className="mb-8 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
              Crop Comparison
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Current</span>
                  <span className="text-sm font-bold text-blue-600">{prediction.currentCrop} {prediction.unit}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out" style={{ width: '70%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Optimized</span>
                  <span className="text-sm font-bold text-green-600">{prediction.optimizedCrop} {prediction.unit}</span>
                </div>
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out glow" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 relative z-10">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full mr-3"></div>
              Historical Trends
            </h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={prediction.historicalData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRainfall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="year" stroke="#6b7280" style={{ fontSize: '12px' }} />
                <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="crop" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorYield)" name="Crop (quintals)" />
                <Area type="monotone" dataKey="rainfall" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRainfall)" name="Rainfall (mm)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropPredictionCard;