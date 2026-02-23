import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

function SoilHealthChart({ data }) {
  // REMOVED TRANSLATION LOGIC

  const healthScore = data.reduce((acc, item) => acc + item.current, 0) / data.length;
  const optimalScore = data.reduce((acc, item) => acc + item.optimal, 0) / data.length;
  const healthPercentage = (healthScore / optimalScore) * 100;

  const getHealthStatus = () => {
    if (healthPercentage >= 85) return { text: 'Excellent', color: 'green', icon: CheckCircle };
    if (healthPercentage >= 70) return { text: 'Good', color: 'blue', icon: TrendingUp };
    if (healthPercentage >= 50) return { text: 'Fair', color: 'yellow', icon: AlertCircle };
    return { text: 'Needs Attention', color: 'red', icon: AlertCircle };
  };

  const healthStatus = getHealthStatus();
  const StatusIcon = healthStatus.icon;

  return (
    <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-2xl p-6 relative overflow-hidden card-hover">
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-full mr-3"></div>
            Soil Health
          </h3>
          <div className={`flex items-center space-x-2 bg-${healthStatus.color}-100 px-4 py-2 rounded-full`}>
            <StatusIcon className={`w-5 h-5 text-${healthStatus.color}-600`} />
            <span className={`text-sm font-bold text-${healthStatus.color}-700`}>{healthStatus.text}</span>
          </div>
        </div>
        <p className="text-gray-600 text-sm">Current vs Optimal nutrient levels</p>
      </div>

      <div className="flex justify-center mb-6 relative z-10">
        <div className="relative">
          <svg className="transform -rotate-90" width="180" height="180">
            <circle cx="90" cy="90" r="70" stroke="#e5e7eb" strokeWidth="12" fill="none" />
            <circle cx="90" cy="90" r="70" stroke="url(#gradient)" strokeWidth="12" fill="none" strokeDasharray={`${2 * Math.PI * 70}`} strokeDashoffset={`${2 * Math.PI * 70 * (1 - healthPercentage / 100)}`} strokeLinecap="round" className="transition-all duration-1000" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">{healthPercentage.toFixed(0)}%</span>
            <span className="text-sm text-gray-500">Health Score</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="parameter" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 10 }} />
            <Radar name="Current" dataKey="current" stroke="#f97316" fill="#f97316" fillOpacity={0.6} strokeWidth={2} />
            <Radar name="Optimal" dataKey="optimal" stroke="#10b981" fill="#10b981" fillOpacity={0.3} strokeWidth={2} strokeDasharray="5 5" />
            <Legend wrapperStyle={{ paddingTop: '10px' }} iconType="circle" />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 relative z-10">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Nutrient Analysis</h4>
        {data.map((item, index) => {
          const percentage = (item.current / item.optimal) * 100;
          const needsImprovement = percentage < 90;
          return (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${needsImprovement ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                  <span className="font-semibold text-gray-800 text-sm">{item.parameter}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-500">Current: <span className="font-bold text-orange-600">{item.current}</span></span>
                  <span className="text-xs text-gray-500">Optimal: <span className="font-bold text-green-600">{item.optimal}</span></span>
                </div>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all duration-1000 ${needsImprovement ? 'bg-gradient-to-r from-orange-500 to-yellow-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`} style={{ width: `${percentage}%` }}></div>
                <div className="absolute top-0 right-0 w-1 h-full bg-green-600 opacity-30"></div>
              </div>
              {needsImprovement && <p className="text-xs text-orange-600 mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1" /> Needs {(item.optimal - item.current).toFixed(0)} units improvement</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SoilHealthChart;