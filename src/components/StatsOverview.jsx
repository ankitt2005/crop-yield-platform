import React from 'react';
import { Users, TrendingUp, Award, CloudSun } from 'lucide-react'; // Changed Globe to CloudSun
import { useNavigate } from 'react-router-dom';

function StatsOverview({ language }) {
  const navigate = useNavigate();

  const stats = [
    {
      icon: Users,
      value: '50K+',
      label: language === 'hi' ? 'किसान' : language === 'od' ? 'କୃଷକ' : language === 'te' ? 'రైతులు' : 'Farmers',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      value: '15%',
      label: language === 'hi' ? 'औसत वृद्धि' : language === 'od' ? 'ହାରାହାରି ବୃଦ୍ଧି' : language === 'te' ? 'సగటు పెరుగుదల' : 'Avg. Increase',
      color: 'green'
    },
    {
      icon: Award,
      value: '98%',
      label: language === 'hi' ? 'सटीकता' : language === 'od' ? 'ସଠିକତା' : language === 'te' ? 'ఖచ్చితత్వం' : 'Accuracy',
      color: 'yellow'
    },
    // REPLACED 'States' WITH 'Weather' CARD
    {
      icon: CloudSun,
      value: 'Weather',
      label: language === 'hi' ? 'पूर्वानुमान देखें' : language === 'od' ? 'ପାଣିପାଗ ଦେଖନ୍ତୁ' : language === 'te' ? 'వాతావరణం' : 'View Forecast',
      color: 'purple',
      link: '/weather', // This makes it clickable
      isInteractive: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700',
      green: 'from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700',
      yellow: 'from-yellow-500 to-yellow-600 group-hover:from-yellow-600 group-hover:to-yellow-700',
      purple: 'from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700'
    };
    return colors[color];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              onClick={() => stat.link && navigate(stat.link)}
              className={`group relative bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-scaleIn ${stat.isInteractive ? 'cursor-pointer ring-2 ring-transparent hover:ring-purple-300' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(stat.color)} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${getColorClasses(stat.color)} mb-4 transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-800 mb-1 group-hover:scale-105 transition-transform">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 font-medium flex items-center gap-1">
                  {stat.label}
                  {stat.isInteractive && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">New</span>}
                </div>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-transparent to-gray-100 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsOverview;