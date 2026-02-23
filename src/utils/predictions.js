import { baseCrops, bulkCrops } from '../data/crops';
import { generateRecommendations } from './recommendations';
import { generateHistoricalData, generateSoilHealth, generateWeatherImpact } from './chartData';

export const generatePrediction = (formData) => {
  const base = baseCrops[formData.cropType] || 3.0;
  
  // Factor in environmental conditions
  const soilFactor = calculateSoilFactor(formData.soilPh, formData.soilType);
  const weatherFactor = calculateWeatherFactor(
    parseFloat(formData.rainfall),
    parseFloat(formData.temperature),
    parseFloat(formData.humidity)
  );
  
  const variation = (Math.random() - 0.5) * 0.3 * base;
  const currentCrop = (base + variation) * parseFloat(formData.farmSize || 1) * soilFactor * weatherFactor;
  const optimizedCrop = currentCrop * (1.1 + Math.random() * 0.15);

  return {
    currentCrop: currentCrop.toFixed(2),
    optimizedCrop: optimizedCrop.toFixed(2),
    improvement: ((optimizedCrop - currentCrop) / currentCrop * 100).toFixed(1),
    unit: bulkCrops.includes(formData.cropType) ? 'tons' : 'quintals',
    recommendations: generateRecommendations(formData),
    historicalData: generateHistoricalData(),
    soilHealth: generateSoilHealth(formData),
    weatherImpact: generateWeatherImpact(formData)
  };
};

const calculateSoilFactor = (ph, soilType) => {
  let factor = 1.0;
  
  // Optimal pH is 6.5-7.5
  const phValue = parseFloat(ph);
  if (phValue >= 6.5 && phValue <= 7.5) {
    factor *= 1.1;
  } else if (phValue < 5.5 || phValue > 8.5) {
    factor *= 0.85;
  }
  
  // Soil type impact
  const goodSoils = ['Alluvial', 'Black', 'Loamy'];
  if (goodSoils.includes(soilType)) {
    factor *= 1.05;
  }
  
  return factor;
};

const calculateWeatherFactor = (rainfall, temperature, humidity) => {
  let factor = 1.0;
  
  // Optimal rainfall: 600-1000mm
  if (rainfall >= 600 && rainfall <= 1000) {
    factor *= 1.1;
  } else if (rainfall < 400 || rainfall > 1500) {
    factor *= 0.85;
  }
  
  // Optimal temperature: 20-30°C
  if (temperature >= 20 && temperature <= 30) {
    factor *= 1.05;
  } else if (temperature < 10 || temperature > 40) {
    factor *= 0.9;
  }
  
  // Optimal humidity: 50-70%
  if (humidity >= 50 && humidity <= 70) {
    factor *= 1.05;
  }
  
  return factor;
};