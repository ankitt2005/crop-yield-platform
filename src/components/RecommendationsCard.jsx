import React, { useState } from 'react';
import { Droplets, Sprout, Bug, ChevronDown, ChevronUp, Star, CheckCircle } from 'lucide-react';

function RecommendationsCard({ recommendations }) {
  // REMOVED TRANSLATION LOGIC
  const [expandedSection, setExpandedSection] = useState('irrigation');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    {
      id: 'irrigation',
      title: 'Irrigation Plan', // Hardcoded English
      icon: Droplets,
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      items: recommendations.irrigation,
      priority: 'High'
    },
    {
      id: 'fertilization',
      title: 'Fertilizer Guide', // Hardcoded English
      icon: Sprout,
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50',
      items: recommendations.fertilization,
      priority: 'High'
    },
    {
      id: 'pestControl',
      title: 'Pest Control', // Hardcoded English
      icon: Bug,
      color: 'red',
      gradient: 'from-red-500 to-pink-500',
      bgGradient: 'from-red-50 to-pink-50',
      items: recommendations.pestControl,
      priority: 'Medium'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full opacity-20 blur-3xl"></div>

      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mr-3 shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            Smart Recommendations
          </h2>
          <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
            <CheckCircle className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">AI Generated</span>
          </div>
        </div>
        <p className="text-gray-600">Personalized action plan for optimal crop prediction</p>
      </div>

      <div className="space-y-4 relative z-10">
        {sections.map((section, sectionIndex) => {
          const Icon = section.icon;
          const isExpanded = expandedSection === section.id;

          return (
            <div key={section.id} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeIn" style={{ animationDelay: `${sectionIndex * 0.1}s` }}>
              <button onClick={() => toggleSection(section.id)} className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 bg-gradient-to-br ${section.gradient} rounded-xl shadow-md transform transition-transform ${isExpanded ? 'scale-110' : ''}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center">
                      {section.title}
                      <span className={`ml-3 text-xs font-semibold px-2 py-1 rounded-full ${section.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{section.priority} Priority</span>
                    </h3>
                    <p className="text-sm text-gray-500">{section.items.length} recommendations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {isExpanded ? <ChevronUp className={`w-5 h-5 text-${section.color}-600 transition-transform`} /> : <ChevronDown className={`w-5 h-5 text-${section.color}-600 transition-transform`} />}
                </div>
              </button>

              {isExpanded && (
                <div className={`bg-gradient-to-br ${section.bgGradient} p-5 border-t-2 border-${section.color}-200 animate-fadeIn`}>
                  <ul className="space-y-3">
                    {section.items.map((rec, idx) => (
                      <li key={idx} className="flex items-start space-x-3 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 animate-slideInLeft" style={{ animationDelay: `${idx * 0.05}s` }}>
                        <div className="flex-shrink-0 mt-1">
                          <div className={`w-6 h-6 rounded-full border-2 border-${section.color}-400 flex items-center justify-center cursor-pointer hover:bg-${section.color}-50 transition-colors`}>
                            <div className={`w-3 h-3 rounded-full bg-${section.color}-400 opacity-0 hover:opacity-100 transition-opacity`}></div>
                          </div>
                        </div>
                        <div className="flex-grow">
                          <p className="text-gray-700 leading-relaxed">{rec}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecommendationsCard;