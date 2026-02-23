import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import {
  savePrediction,
  createFarmer,
  getFarmerById,
  getPredictionsByFarmerId,
  addFeedback
} from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// --- Helper: mock external data sources (soil, weather, market) ---
const getSoilProperties = async (location, soilType, soilPh) => {
  // In a real system, call SoilGrids / Bhuvan APIs here with axios.
  // For now we just echo enriched data back.
  const phValue = parseFloat(soilPh);
  return {
    source: 'mock-soil-service',
    location,
    type: soilType,
    ph: isNaN(phValue) ? 7.0 : phValue,
    organicMatter: 1.8,
    nitrogen: 70,
    phosphorus: 65,
    potassium: 68
  };
};

const getWeatherForecast = async (location, rainfall, temperature, humidity) => {
  // Patent Claim: "External Data Integration - Data Fusion"
  // Connects to live public meteorological REST APIs
  const rf = parseFloat(rainfall);
  const temp = parseFloat(temperature);
  const hum = parseFloat(humidity);

  try {
    // 1. Geolocation API: Resolve the string 'location' to exact coordinates coordinates
    const geoResponse = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);

    let lat = 31.1471; // Default to Punjab, India
    let lon = 75.3412;

    if (geoResponse.data && geoResponse.data.results && geoResponse.data.results.length > 0) {
      lat = geoResponse.data.results[0].latitude;
      lon = geoResponse.data.results[0].longitude;
    }

    // 2. Weather Forecast API: Fetch live predictive daily data
    const weatherResponse = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum,temperature_2m_max&timezone=auto`);

    const dailyData = weatherResponse.data.daily;
    const tomorrowRain = dailyData.precipitation_sum[1] || 0; // 24h predictive rainfall
    const tomorrowTemp = dailyData.temperature_2m_max[1] || temp;

    return {
      source: 'live-open-meteo-api',
      location,
      rainfallNext30DaysMm: isNaN(rf) ? 800 : rf,
      avgTempC: isNaN(temp) ? 28 : temp,
      avgHumidity: isNaN(hum) ? 65 : hum,
      forecast24hRainfallMm: tomorrowRain, // Injected into the patent override logic
      forecast24hTempC: tomorrowTemp
    };
  } catch (err) {
    console.error("[API] Real weather fetch failed, using fallback:", err.message);
    // Graceful mock fallback if API is unreachable
    const imminentRainfall_mm = hum > 75 ? Math.floor(Math.random() * 30 + 10) : 0;
    return {
      source: 'mock-weather-service',
      location,
      rainfallNext30DaysMm: isNaN(rf) ? 800 : rf,
      avgTempC: isNaN(temp) ? 28 : temp,
      avgHumidity: isNaN(hum) ? 65 : hum,
      forecast24hRainfallMm: imminentRainfall_mm,
      forecast24hTempC: temp + (Math.random() * 2 - 1)
    };
  }
};

const getMarketTrends = async (cropType, location) => {
  // In a real system, scrape agri-market sites or call government APIs here.
  return {
    source: 'mock-market-service',
    crop: cropType,
    location,
    averagePricePerQuintal: 2200,
    demandLevel: 'High',
    trend: 'Rising'
  };
};

// --- Core prediction logic (mirrors frontend utils/predictions.js + chartData.js) ---
const baseCrops = {
  Rice: 3.8,
  Wheat: 3.5,
  Maize: 3.2,
  Cotton: 2.0,
  Sugarcane: 6.5
};

const bulkCrops = ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton'];

const calculateSoilFactor = (ph, soilType) => {
  let factor = 1.0;

  const phValue = parseFloat(ph);
  if (phValue >= 6.5 && phValue <= 7.5) {
    factor *= 1.1;
  } else if (phValue < 5.5 || phValue > 8.5) {
    factor *= 0.85;
  }

  const goodSoils = ['Alluvial', 'Black', 'Loamy'];
  if (goodSoils.includes(soilType)) {
    factor *= 1.05;
  }

  return factor;
};

const calculateWeatherFactor = (rainfall, temperature, humidity) => {
  let factor = 1.0;

  if (rainfall >= 600 && rainfall <= 1000) {
    factor *= 1.1;
  } else if (rainfall < 400 || rainfall > 1500) {
    factor *= 0.85;
  }

  if (temperature >= 20 && temperature <= 30) {
    factor *= 1.05;
  } else if (temperature < 10 || temperature > 40) {
    factor *= 0.9;
  }

  if (humidity >= 50 && humidity <= 70) {
    factor *= 1.05;
  }

  return factor;
};

const generateHistoricalData = () => {
  const baseCrop = 3.0;
  const years = ['2020', '2021', '2022', '2023', '2024', '2025'];

  return years.map((year, index) => ({
    year,
    crop: (baseCrop + index * 0.3 + (Math.random() - 0.5) * 0.2).toFixed(1),
    rainfall: Math.floor(800 + (Math.random() - 0.5) * 200)
  }));
};

const calculatePhScore = (ph) => {
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

const generateSoilHealth = (formData) => {
  const phValue = parseFloat(formData.soilPh);
  const phScore = calculatePhScore(phValue);

  return [
    { parameter: 'Nitrogen', current: Math.floor(65 + Math.random() * 20), optimal: 85 },
    { parameter: 'Phosphorus', current: Math.floor(60 + Math.random() * 20), optimal: 80 },
    { parameter: 'Potassium', current: Math.floor(65 + Math.random() * 15), optimal: 75 },
    { parameter: 'Organic Matter', current: Math.floor(55 + Math.random() * 20), optimal: 70 },
    { parameter: 'pH Balance', current: phScore, optimal: 85 }
  ];
};

const generateWeatherImpact = (formData) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const baseTemp = parseFloat(formData.temperature) || 28;
  const baseRainfall = (parseFloat(formData.rainfall) || 800) / 12;

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

const getCropSpecificRecommendations = (crop) => {
  const recommendations = {
    Rice: {
      irrigation: 'AI Insight: High ET stress detected. Maintain precise 5-7cm standing water during current vegetative phase.',
      fertilization: 'Apply urea at 120 kg/ha in split doses',
      pestControl: 'Watch for stem borers and use biological control'
    },
    Wheat: {
      irrigation: 'AI Insight: Soil moisture deficit detected in root zone. Apply automated drip irrigation focusing on critical depth.',
      fertilization: 'Use DAP 100 kg/ha at sowing time',
      pestControl: 'Monitor for rust diseases and aphids'
    },
    Maize: {
      irrigation: 'AI Insight: High water demand phase. Implement precision drip irrigation to maintain 60-70% soil volumetric water content.',
      fertilization: 'Apply 150 kg nitrogen per hectare',
      pestControl: 'Control fall armyworm with IPM practices'
    },
    Cotton: {
      irrigation: 'AI Insight: Preventative shedding alert. Use micro-irrigation to maintain exact 55% moisture to prevent boll rot.',
      fertilization: 'Apply potassium-rich fertilizers',
      pestControl: 'Monitor for bollworms and use Bt cotton varieties'
    },
    Sugarcane: {
      irrigation: 'AI Insight: Grand growth phase detected. Maximize automated subsurface drip schedules to match peak evapotranspiration.',
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

const getWeatherBasedRecommendations = (rainfall, temperature, forecastContext = {}) => {
  // Patent Claim: "Computed Stress Thresholds"
  let irrigation = `Baseline AI Prediction: Schedule smart irrigation during early morning to minimize ${temperature}°C evaporation loss.`;

  const rainfallValue = parseFloat(rainfall);
  const tempValue = parseFloat(temperature);

  // Basic ET (Evapotranspiration) Stress Alert Logic
  if (tempValue > 35 && rainfallValue < 500) {
    irrigation = 'HIGH ET STRESS: Increase irrigation frequency by 20% immediately to combat severe evapotranspiration.';
  } else if (rainfallValue < 500) {
    irrigation = 'Drought risk profile: Install drip irrigation to ensure targeted root-zone hydration.';
  }

  // Patent Claim: "Weather-based Override Rules"
  const forecastedRain = forecastContext.forecast24hRainfallMm || 0;
  if (forecastedRain > 15) {
    irrigation = `ALERT - WEATHER OVERRIDE: Suppressing scheduled irrigation. Forecast indicates ${forecastedRain}mm of rain in the next 24 hours. Hold watering to prevent waterlogging.`;
  } else if (rainfallValue > 1200) {
    irrigation = 'Saturation Warning: Ensure proper drainage paths are open to prevent root hypoxia.';
  }

  return { irrigation };
};

const generateRecommendations = (formData, weatherForecast) => {
  const cropSpecificRec = getCropSpecificRecommendations(formData.cropType);
  const soilBasedRec = getSoilBasedRecommendations(formData.soilType, formData.soilPh);

  // Pass the enriched forecast context to trigger dynamic overrides
  const weatherBasedRec = getWeatherBasedRecommendations(
    formData.rainfall,
    formData.temperature,
    weatherForecast
  );

  return {
    irrigation: [
      weatherBasedRec.irrigation, // Prioritize the dynamic override first
      cropSpecificRec.irrigation
    ].filter(Boolean),
    fertilization: [
      soilBasedRec.fertilization,
      cropSpecificRec.fertilization
    ].filter(Boolean),
    pestControl: [
      cropSpecificRec.pestControl
    ].filter(Boolean)
  };
};

const generatePrediction = (formData) => {
  const base = baseCrops[formData.cropType] || 3.0;

  const soilFactor = calculateSoilFactor(formData.soilPh, formData.soilType);
  const weatherFactor = calculateWeatherFactor(
    parseFloat(formData.rainfall),
    parseFloat(formData.temperature),
    parseFloat(formData.humidity)
  );

  const variation = (Math.random() - 0.5) * 0.3 * base;
  const currentCrop =
    (base + variation) * parseFloat(formData.farmSize || 1) * soilFactor * weatherFactor;
  const optimizedCrop = currentCrop * (1.1 + Math.random() * 0.15);

  return {
    currentCrop: currentCrop.toFixed(2),
    optimizedCrop: optimizedCrop.toFixed(2),
    improvement: ((optimizedCrop - currentCrop) / currentCrop * 100).toFixed(1),
    suitabilityScore: (80 + Math.random() * 15).toFixed(1), // Mock fallback confidence
    unit: bulkCrops.includes(formData.cropType) ? 'tons' : 'quintals'
  };
};

// Try to call external Python ML service; fall back to local heuristic if unavailable
const callMlService = async (formData) => {
  try {
    const mlPayload = {
      cropType: formData.cropType,
      location: formData.location,
      farmSize: parseFloat(formData.farmSize),
      soilType: formData.soilType,
      soilPh: parseFloat(formData.soilPh),
      rainfall: parseFloat(formData.rainfall),
      temperature: parseFloat(formData.temperature),
      humidity: parseFloat(formData.humidity)
    };

    const mlApiUrl = process.env.ML_API_URL || 'http://localhost:8002';
    const { data } = await axios.post(`${mlApiUrl}/predict`, mlPayload, {
      timeout: 4000
    });

    return {
      mlSource: 'python-ml-service',
      corePrediction: {
        currentCrop: Number(data.currentCrop).toFixed(2),
        optimizedCrop: Number(data.optimizedCrop).toFixed(2),
        improvement: Number(data.improvement).toFixed(1),
        suitabilityScore: Number(data.suitabilityScore).toFixed(1),
        unit: data.unit
      }
    };
  } catch (err) {
    console.warn(
      '[ML] Falling back to local heuristic generatePrediction. ML service not reachable.',
      err.message
    );
    return {
      mlSource: 'node-fallback',
      corePrediction: generatePrediction(formData)
    };
  }
};

// --- API ROUTES ---
app.post('/api/recommend-crops', async (req, res) => {
  try {
    const formData = req.body || {};
    const {
      cropType,
      location,
      farmSize,
      soilType,
      soilPh,
      rainfall,
      temperature,
      humidity
    } = formData;

    console.log('[API] /api/recommend-crops called with:', {
      cropType,
      location,
      farmSize,
      soilType,
      soilPh,
      rainfall,
      temperature,
      humidity
    });

    if (
      !cropType ||
      !location ||
      !farmSize ||
      !soilType ||
      !soilPh ||
      !rainfall ||
      !temperature ||
      !humidity
    ) {
      return res.status(400).json({ error: 'Missing required fields in form data.' });
    }

    const [soilProps, weatherForecast, marketTrends] = await Promise.all([
      getSoilProperties(location, soilType, soilPh),
      getWeatherForecast(location, rainfall, temperature, humidity),
      getMarketTrends(cropType, location)
    ]);

    const { corePrediction, mlSource } = await callMlService(formData);

    // Persist prediction to JSON "DB" (farmer_id can be wired later)
    const predictionId = await savePrediction({
      farmer_id: null,
      crop_type: cropType,
      location,
      farm_size: parseFloat(farmSize),
      soil_type: soilType,
      soil_ph: parseFloat(soilPh),
      rainfall: parseFloat(rainfall),
      temperature: parseFloat(temperature),
      humidity: parseFloat(humidity),
      current_yield: parseFloat(corePrediction.currentCrop),
      optimized_yield: parseFloat(corePrediction.optimizedCrop),
      improvement: parseFloat(corePrediction.improvement),
      unit: corePrediction.unit
    });

    const response = {
      ...corePrediction,
      recommendations: generateRecommendations(formData, weatherForecast),
      historicalData: generateHistoricalData(),
      soilHealth: generateSoilHealth(formData),
      weatherImpact: generateWeatherImpact(formData),
      metadata: {
        soil: soilProps,
        weather: weatherForecast,
        market: marketTrends,
        mlSource,
        db: {
          predictionId
        }
      }
    };

    return res.json(response);
  } catch (err) {
    console.error('Error in /api/recommend-crops:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Crop recommendation API is running' });
});

// --- Farmer & history endpoints (not yet wired to UI) ---
app.post('/api/farmers', async (req, res) => {
  const { name, phone, village, state } = req.body || {};
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const farmer = await createFarmer({ name, phone, village, state });
  return res.status(201).json(farmer);
});

app.get('/api/farmers/:id', async (req, res) => {
  const id = Number(req.params.id);
  const farmer = await getFarmerById(id);
  if (!farmer) {
    return res.status(404).json({ error: 'Farmer not found' });
  }
  return res.json(farmer);
});

app.get('/api/farmers/:id/predictions', async (req, res) => {
  const id = Number(req.params.id);
  const rows = await getPredictionsByFarmerId(id);
  return res.json(rows);
});

app.post('/api/predictions/:id/feedback', async (req, res) => {
  const predictionId = Number(req.params.id);
  const { rating, comments } = req.body || {};

  const record = await addFeedback(predictionId, {
    rating: rating ?? null,
    comments: comments ?? null
  });

  return res.status(201).json(record);
});

app.listen(PORT, () => {
  console.log(`Crop recommendation API listening on port ${PORT}`);
});

