export const generateHistoricalData = () => {
  const baseCrop = 3.0;
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
  
  return years.map((year, index) => ({
    year,
    crop: (baseCrop + index * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(1),
    rainfall: Math.floor(800 + (Math.random() - 0.5) * 200)
  }));
};

export const generateSoilHealth = (formData) => {
  const phValue = parseFloat(formData.soilPh);
  const phScore = calculatePhScore(phValue);
  
  return [
    { 
      parameter: 'Nitrogen', 
      current: Math.floor(65 + Math.random() * 20), 
      optimal: 85 
    },
    { 
      parameter: 'Phosphorus', 
      current: Math.floor(60 + Math.random() * 20), 
      optimal: 80 
    },
    { 
      parameter: 'Potassium', 
      current: Math.floor(65 + Math.random() * 15), 
      optimal: 75 
    },
    { 
      parameter: 'Organic Matter', 
      current: Math.floor(55 + Math.random() * 20), 
      optimal: 70 
    },
    { 
      parameter: 'pH Balance', 
      current: phScore, 
      optimal: 85 
    }
  ];
};

const calculatePhScore = (ph) => {
  // Optimal pH is 6.5-7.5
  if (ph >= 6.5 && ph <= 7.5) {
    return 85;
  } else if (ph >= 6.0 && ph < 6.5) {
    return 75;
  } else if (ph > 7.5 && ph <= 8.0) {
    return 75;
  } else if (ph >= 5.5 && ph < 6.0) {
    return 65;
  } else if (ph > 8.0 && ph <= 8.5) {
    return 65;
  } else {
    return 50;
  }
};

export const generateWeatherImpact = (formData) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseTemp = parseFloat(formData.temperature) || 28;
  const baseRainfall = parseFloat(formData.rainfall) / 12 || 70;
  
  return months.map((month, index) => {
    const tempVariation = (Math.random() - 0.5) * 6;
    const rainfallVariation = Math.random() * 100;
    
    return {
      month,
      temp: Math.round(baseTemp + tempVariation),
      rainfall: Math.round(baseRainfall + rainfallVariation),
      crop: Math.floor(85 + index * 2.5 + Math.random() * 5)
    };
  });
};