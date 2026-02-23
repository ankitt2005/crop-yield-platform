export const generateRecommendations = (formData) => {
  const cropSpecificRec = getCropSpecificRecommendations(formData.cropType);
  const soilBasedRec = getSoilBasedRecommendations(formData.soilType, formData.soilPh);
  const weatherBasedRec = getWeatherBasedRecommendations(
    formData.rainfall,
    formData.temperature,
    formData.humidity
  );

  return {
    irrigation: [
      cropSpecificRec.irrigation,
      weatherBasedRec.irrigation,
      'Monitor soil moisture levels weekly using sensors',
      'Implement rainwater harvesting during monsoon season'
    ],
    fertilization: [
      soilBasedRec.fertilization,
      cropSpecificRec.fertilization,
      'Apply micronutrients (Zinc, Boron) based on soil test',
      'Split nitrogen application in 3 doses for better absorption'
    ],
    pestControl: [
      cropSpecificRec.pestControl,
      'Use neem-based organic pesticides as first defense',
      'Install pheromone traps to monitor pest population',
      'Practice crop rotation to break pest lifecycle'
    ]
  };
};

const getCropSpecificRecommendations = (crop) => {
  const recommendations = {
    'Rice': {
      irrigation: 'Maintain 5cm standing water during vegetative stage',
      fertilization: 'Apply urea at 120 kg/ha in split doses',
      pestControl: 'Watch for stem borers and use biological control'
    },
    'Wheat': {
      irrigation: 'Apply 5-6 irrigations at critical growth stages',
      fertilization: 'Use DAP 100 kg/ha at sowing time',
      pestControl: 'Monitor for rust diseases and aphids'
    },
    'Maize': {
      irrigation: 'Apply drip irrigation to save 40% water',
      fertilization: 'Apply 150 kg nitrogen per hectare',
      pestControl: 'Control fall armyworm with IPM practices'
    },
    'Cotton': {
      irrigation: 'Use drip irrigation for 50% water saving',
      fertilization: 'Apply potassium-rich fertilizers',
      pestControl: 'Monitor for bollworms and use Bt cotton varieties'
    },
    'Sugarcane': {
      irrigation: 'Ensure adequate moisture during grand growth phase',
      fertilization: 'Apply farmyard manure at 25 tons/ha',
      pestControl: 'Control borers through biological methods'
    }
  };

  return recommendations[crop] || {
    irrigation: `Apply drip irrigation for ${crop} to save 40% water`,
    fertilization: 'Use balanced NPK fertilizer based on soil test',
    pestControl: 'Implement integrated pest management practices'
  };
};

const getSoilBasedRecommendations = (soilType, ph) => {
  let fertilization = 'Apply NPK fertilizer in ratio 4:2:1 for optimal growth';
  
  const phValue = parseFloat(ph);
  if (phValue < 6.5) {
    fertilization = 'Add lime to increase soil pH before fertilization';
  } else if (phValue > 7.5) {
    fertilization = 'Apply gypsum to reduce soil alkalinity, then add fertilizers';
  }
  
  if (soilType === 'Sandy') {
    fertilization = 'Use slow-release fertilizers for sandy soil retention';
  } else if (soilType === 'Clay') {
    fertilization = 'Add organic matter to improve clay soil structure';
  }
  
  return { fertilization };
};

const getWeatherBasedRecommendations = (rainfall, temperature, humidity) => {
  let irrigation = 'Schedule irrigation during early morning or late evening';
  
  const rainfallValue = parseFloat(rainfall);
  if (rainfallValue < 500) {
    irrigation = 'Install drip irrigation system due to low rainfall zone';
  } else if (rainfallValue > 1200) {
    irrigation = 'Ensure proper drainage to prevent waterlogging';
  }
  
  const tempValue = parseFloat(temperature);
  if (tempValue > 35) {
    irrigation = 'Increase irrigation frequency during high temperature periods';
  }
  
  return { irrigation };
};