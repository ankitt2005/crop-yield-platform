import React, { useState } from 'react';
import { BarChart3, Map, Cloud, TrendingUp, Thermometer, Droplets, Activity } from 'lucide-react';
import { translations } from '../data/translations';
import { crops, soilTypes } from '../data/crops';

function InputForm({ language, onSubmit, loading }) {
  const t = translations[language];
  
  const [formData, setFormData] = useState({
    cropType: '',
    location: '',
    farmSize: '',
    soilType: '',
    soilPh: '',
    rainfall: '',
    temperature: '',
    humidity: ''
  });

  const [focusedField, setFocusedField] = useState(null);
  const [formProgress, setFormProgress] = useState(0);

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Calculate form completion progress
    const filledFields = Object.values(newFormData).filter(val => val !== '').length;
    const progress = (filledFields / 8) * 100;
    setFormProgress(progress);
  };

  const handleSubmit = () => {
    if (!formData.cropType || !formData.location || !formData.farmSize || 
        !formData.soilType || !formData.soilPh || !formData.rainfall || 
        !formData.temperature || !formData.humidity) {
      alert('Please fill all fields');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 relative overflow-hidden card-hover">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
      
      {/* Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mr-3 shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            {t.farmDetails}
          </h2>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Form Progress</span>
            <span className="text-sm font-semibold text-green-600">{Math.round(formProgress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out"
              style={{ width: `${formProgress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5 relative z-10">
        {/* Crop Type */}
        <div className={`transition-all duration-300 ${focusedField === 'cropType' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Activity className="w-4 h-4 mr-2 text-green-600" />
            {t.cropType}
          </label>
          <div className="relative">
            <select
              name="cropType"
              value={formData.cropType}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('cropType')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">{t.selectCrop}</option>
              {crops.map(crop => (
                <option key={crop} value={crop}>{crop}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className={`transition-all duration-300 ${focusedField === 'location' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Map className="w-4 h-4 mr-2 text-green-600" />
            {t.location}
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('location')}
            onBlur={() => setFocusedField(null)}
            placeholder="e.g., Bhubaneswar, Odisha"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
          />
        </div>

        {/* Farm Size */}
        <div className={`transition-all duration-300 ${focusedField === 'farmSize' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.farmSize}
          </label>
          <div className="relative">
            <input
              type="number"
              name="farmSize"
              value={formData.farmSize}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('farmSize')}
              onBlur={() => setFocusedField(null)}
              step="0.1"
              placeholder="e.g., 5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">acres</span>
          </div>
        </div>

        {/* Soil Type */}
        <div className={`transition-all duration-300 ${focusedField === 'soilType' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.soilType}
          </label>
          <div className="relative">
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('soilType')}
              onBlur={() => setFocusedField(null)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white appearance-none cursor-pointer"
            >
              <option value="">{t.selectSoil}</option>
              {soilTypes.map(soil => (
                <option key={soil} value={soil}>{soil}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Soil pH */}
        <div className={`transition-all duration-300 ${focusedField === 'soilPh' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {t.soilPh}
          </label>
          <div className="relative">
            <input
              type="number"
              name="soilPh"
              value={formData.soilPh}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('soilPh')}
              onBlur={() => setFocusedField(null)}
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.5"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
            />
            {formData.soilPh && (
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                  formData.soilPh >= 6.5 && formData.soilPh <= 7.5 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {formData.soilPh >= 6.5 && formData.soilPh <= 7.5 ? 'Optimal' : 'Adjust'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rainfall */}
        <div className={`transition-all duration-300 ${focusedField === 'rainfall' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Cloud className="w-4 h-4 mr-2 text-blue-600" />
            {t.rainfall}
          </label>
          <div className="relative">
            <input
              type="number"
              name="rainfall"
              value={formData.rainfall}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('rainfall')}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g., 800"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">mm</span>
          </div>
        </div>

        {/* Temperature */}
        <div className={`transition-all duration-300 ${focusedField === 'temperature' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Thermometer className="w-4 h-4 mr-2 text-red-600" />
            {t.temperature}
          </label>
          <div className="relative">
            <input
              type="number"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('temperature')}
              onBlur={() => setFocusedField(null)}
              step="0.1"
              placeholder="e.g., 28"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">°C</span>
          </div>
        </div>

        {/* Humidity */}
        <div className={`transition-all duration-300 ${focusedField === 'humidity' ? 'transform scale-105' : ''}`}>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Droplets className="w-4 h-4 mr-2 text-blue-600" />
            {t.humidity}
          </label>
          <div className="relative">
            <input
              type="number"
              name="humidity"
              value={formData.humidity}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('humidity')}
              onBlur={() => setFocusedField(null)}
              min="0"
              max="100"
              placeholder="e.g., 65"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all bg-gray-50 hover:bg-white"
            />
            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">%</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:cursor-not-allowed btn-ripple"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5" />
              <span>{t.predict}</span>
            </>
          )}
        </button>
      </div>

      {/* Bottom Info */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <p className="text-xs text-gray-600 text-center">
          🔒 Your data is secure and used only for predictions
        </p>
      </div>
    </div>
  );
}

export default InputForm;