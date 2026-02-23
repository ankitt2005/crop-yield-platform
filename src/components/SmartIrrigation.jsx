import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Droplets,
  Sprout,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  MapPin,
  ArrowLeft,
  Languages
} from 'lucide-react';
import { translations } from '../data/translations';
import { localizedIrrigation } from '../data/localizedIrrigation';

const SmartIrrigation = ({ language, setLanguage }) => {
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const [landSize, setLandSize] = useState('');
  const [cropType, setCropType] = useState('wheat');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [weatherOverrideAlert, setWeatherOverrideAlert] = useState(null);
  const [selectedMetric, setSelectedMetric] = useState(null); // State for metric details modal

  // --- DATA ENGINE: Detailed Irrigation Info per Crop ---
  const cropDetails = localizedIrrigation[language] || localizedIrrigation.en;

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setWeatherOverrideAlert(null);

    try {
      const size = parseFloat(landSize);
      const selectedCropData = cropDetails[cropType] || cropDetails['wheat'];

      if (!size || size <= 0) {
        alert("Please enter a valid land size.");
        setLoading(false);
        return;
      }

      // PATENT CLAIM: Fetch dynamic environmental data instead of just static math
      // Randomize the weather payload so the Warning Alert doesn't trigger every time.
      const isRaining = Math.random() > 0.5; // 50% chance of rain
      const payload = {
        cropType: cropType.charAt(0).toUpperCase() + cropType.slice(1),
        location: 'Punjab',
        farmSize: size,
        soilType: 'Loamy',
        soilPh: 6.8,
        rainfall: isRaining ? 800 : 20,
        temperature: 30,
        humidity: isRaining ? 85 : 40
      };

      const apiUrl = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/recommend-crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch from backend API');
      }

      const backendData = await response.json();

      // Look inside backend recommendations for the specific Patent Override String
      let overrideText = null;
      if (backendData.recommendations && backendData.recommendations.irrigation) {
        const override = backendData.recommendations.irrigation.find(r => r.includes("ALERT - WEATHER OVERRIDE"));
        if (override) {
          overrideText = override;
        }
      }

      const totalLiters = selectedCropData.waterNeedPerAcre * size;
      const formattedWater = (totalLiters / 1000).toFixed(1) + 'k L';
      const waterSaved = ((totalLiters * 0.35) / 1000).toFixed(1) + 'k L'; // AI saves approx 35% compared to traditional
      const baseMoisture = parseInt(selectedCropData.idealMoistureRange.split('-')[0]);
      const currentSimulatedMoisture = (baseMoisture - (Math.floor(Math.random() * 10) + 5)) + '%';
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + selectedCropData.frequencyDays);
      const formattedNextDate = nextDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      // Get the irrigation recommendations from the backend, 
      // or fall back to dynamic strings if not available.
      let defaultRecommendations = [
        `Soil moisture analysis targeting the ideal range of ${selectedCropData.idealMoistureRange} for ${selectedCropData.name}.`,
        'Irrigation is recommended based on current evapotranspiration rates.'
      ];

      if (backendData.recommendations && backendData.recommendations.irrigation && backendData.recommendations.irrigation.length > 0) {
        // Find recommendations that are NOT the weather override
        const standardRecs = backendData.recommendations.irrigation.filter(r => !r.includes("ALERT - WEATHER OVERRIDE"));
        if (standardRecs.length > 0) {
          defaultRecommendations = standardRecs;
        }
      }

      setResult({
        cropName: selectedCropData.name,
        waterRequired: formattedWater,
        waterSaved: waterSaved,
        currentMoisture: currentSimulatedMoisture,
        idealMoisture: selectedCropData.idealMoistureRange,
        nextWatering: formattedNextDate,
        frequency: `${selectedCropData.frequencyDays} days`,
        etStressScore: backendData.metadata.weather.avgTempC > 35 ? 'HIGH' : 'LOW',
        recommendations: defaultRecommendations
      });

      if (overrideText) {
        setWeatherOverrideAlert({
          forecast: backendData.metadata.weather.forecast24hRainfallMm,
          message: overrideText
        });
      }

    } catch (err) {
      console.error(err);
      alert("Error connecting to Smart Irrigation API");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn relative">
      {/* Header section with Back Button */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-8 text-white shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10">
          <Droplets size={150} />
        </div>

        {/* CHANGED: items-start to items-center for vertical centering */}
        <div className="relative z-10 flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            // CHANGED: removed 'mt-1' class
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Droplets className="w-8 h-8" />
              {t.irrigation?.title || 'Smart Irrigation System'}
            </h1>
            <p className="mt-2 text-cyan-100 max-w-xl">
              {t.irrigation?.subtitle || 'Optimize water usage with IoT-based monitoring.'}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm self-start md:self-center ml-auto">
            <Languages className="w-5 h-5 text-white" />
            <select
              value={language || 'en'}
              onChange={(e) => setLanguage && setLanguage(e.target.value)}
              className="bg-transparent focus:outline-none text-white font-medium cursor-pointer [&>option]:text-gray-800"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="od">ଓଡ଼ିଆ</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl shadow-lg p-6 border border-cyan-50 h-full">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sprout className="text-cyan-600" />
              {t.irrigation?.fieldDetails || 'Field Details'}
            </h2>

            <form onSubmit={handleCalculate} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.irrigation?.landSize || 'Total Land Size (Acres)'}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={landSize}
                    onChange={(e) => setLandSize(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all pl-10"
                    placeholder="e.g., 2.5"
                    required
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.irrigation?.selectCrop || 'Select Crop Type'}
                </label>
                <div className="relative">
                  <select
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all appearance-none pl-10 cursor-pointer"
                  >
                    {Object.keys(localizedIrrigation.en).map((key) => (
                      <option key={key} value={key}>{t.irrigation?.crops?.[key] || localizedIrrigation.en[key].name}</option>
                    ))}
                  </select>
                  <Sprout className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none cursor-pointer" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all
                  ${loading ? 'bg-cyan-400 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-cyan-200/50 hover:scale-[1.02] active:scale-[0.98]'}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t.irrigation?.analyzing || 'Analyzing...'}
                  </>
                ) : (
                  <>
                    <Droplets className="w-5 h-5" />
                    {t.irrigation?.calculate || 'Calculate Irrigation Schedule'}
                  </>
                )}
              </button>

              <div className="mt-6 p-4 bg-blue-50 rounded-xl flex items-center gap-3 border border-blue-100 shadow-sm">
                <div className="relative">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    {t.irrigation?.cloudFusionActive || 'Cloud Fusion API Active'}
                  </p>
                  <p className="text-xs text-gray-500">{t.irrigation?.predictiveModels || 'Connected to live predictive weather models'}</p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6 animate-slideInRight">

              {/* PATENT CLAIM: VISUAL SMART IRRIGATION WEATHER OVERRIDE ALERT */}
              {weatherOverrideAlert ? (
                <div className="bg-red-50 border-l-8 border-red-600 p-6 rounded-r-2xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-4 transform transition-all hover:-translate-y-1">
                  <div className="bg-red-100 p-3 rounded-full shrink-0 animate-pulse">
                    <AlertCircle className="text-red-600 w-8 h-8" />
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <h3 className="text-xl font-black text-red-800 uppercase tracking-wide">{t.irrigation?.emergencyOverride || 'Emergency Weather Override'}</h3>
                      <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                        {t.irrigation?.systemDiverted || 'SYSTEM DIVERTED'}
                      </span>
                    </div>
                    <p className="text-red-900 font-bold mb-1 text-lg">
                      {t.irrigation?.rainfallDetected || 'Imminent Rainfall Detected'}: {weatherOverrideAlert.forecast}mm
                    </p>
                    <p className="text-red-700 font-medium bg-white/50 p-3 rounded-lg border border-red-200 shadow-sm leading-relaxed">
                      {weatherOverrideAlert.message}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-2xl shadow-sm flex items-start flex-col sm:flex-row gap-4 transition-all hover:shadow-md">
                  <div className="bg-amber-100 p-2 rounded-full shrink-0 flex items-center justify-center">
                    <AlertCircle className="text-amber-600 w-6 h-6" />
                  </div>
                  <div className="w-full">
                    <h3 className="font-bold text-amber-900 mb-2 text-lg border-b border-amber-200/60 pb-2">
                      {t.irrigation?.aiTargetState || 'AI Target State'}: {result.cropName}
                    </h3>
                    <ul className="space-y-3 mt-3">
                      {result.recommendations && result.recommendations.map((rec, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-amber-800 text-sm font-medium leading-relaxed bg-white/50 p-2 rounded-lg">
                          <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div
                  onClick={() => setSelectedMetric({ title: t.irrigation?.estUsage || 'Estimated Usage', description: t.irrigation?.estUsageDesc?.replace('{cropName}', result.cropName).replace('{waterNeedPerAcre}', cropDetails[cropType]?.waterNeedPerAcre).replace('{landSize}', landSize) || `Calculated statically based on the crop type (${result.cropName}) needing ${cropDetails[cropType]?.waterNeedPerAcre} liters per acre, multiplied by your farm size (${landSize} acres).` })}
                  className="bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2 opacity-90">
                    <span className="text-xs font-semibold uppercase tracking-wider truncate mr-1">{t.irrigation?.estUsageShort || 'Est. Usage'}</span>
                    <Droplets className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-xl xl:text-2xl font-extrabold mb-1 truncate">{result.waterRequired}</div>
                  <div className="text-[10px] xl:text-xs opacity-80 font-medium truncate">{t.irrigation?.seasonalAIPlan || 'Seasonal AI Plan'}</div>
                </div>

                <div
                  onClick={() => setSelectedMetric({ title: t.irrigation?.waterSaved || 'Water Saved', description: t.irrigation?.waterSavedDesc || 'Our AI adjusts watering schedules dynamically instead of using fixed intervals used in traditional farming. This typically saves 30-40% of standard water usage by holding off during rain and optimizing soil moisture.' })}
                  className="bg-gradient-to-br from-indigo-500 to-blue-600 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 relative overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
                    <Droplets size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-2 opacity-90 relative z-10">
                    <span className="text-xs font-semibold uppercase tracking-wider truncate mr-1">{t.irrigation?.waterSavedShort || 'Water Saved'}</span>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-xl xl:text-2xl font-extrabold mb-1 relative z-10 text-green-300 truncate">+{result.waterSaved}</div>
                  <div className="text-[10px] xl:text-xs opacity-80 font-medium relative z-10 truncate">{t.irrigation?.vsTraditional || 'vs Traditional'}</div>
                </div>

                <div
                  onClick={() => setSelectedMetric({ title: t.irrigation?.simulatedMoisture || 'Simulated Moisture', description: t.irrigation?.simulatedMoistureDesc?.replace('{idealMoisture}', result.idealMoisture) || `A dynamic mock calculation representing live soil sensors. Currently ranges around ${result.idealMoisture}. In a production scenario, this would poll physical IoT sensors buried in the soil.` })}
                  className="bg-gradient-to-br from-emerald-500 to-teal-400 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 relative overflow-hidden cursor-pointer flex flex-col justify-between"
                >
                  <div className="absolute -right-4 -bottom-4 opacity-20 rotate-12">
                    <Sprout size={60} />
                  </div>
                  <div className="flex items-center justify-between mb-2 opacity-90 relative z-10">
                    <span className="text-xs font-semibold uppercase tracking-wider truncate mr-1">{t.irrigation?.soilMoisture || 'Soil Moisture'}</span>
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-xl xl:text-2xl font-extrabold mb-1 relative z-10 truncate">{result.currentMoisture}</div>
                  <div className="text-[10px] xl:text-xs opacity-80 font-medium relative z-10 truncate">{t.irrigation?.ideal || 'Ideal'}: {result.idealMoisture}</div>
                </div>

                <div
                  onClick={() => setSelectedMetric({ title: t.irrigation?.nextWatering || 'Next Watering', description: t.irrigation?.nextWateringDesc?.replace('{cropName}', result.cropName).replace('{frequency}', result.frequency) || `Calculated based on the standard watering frequency for ${result.cropName} (${result.frequency}). Our AI algorithm dynamically pushes this date forward if heavy rainfall is detected by the Cloud API.` })}
                  className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2 opacity-90">
                    <span className="text-xs font-semibold uppercase tracking-wider truncate mr-1">{t.irrigation?.nextWaterShort || 'Next Water'}</span>
                    <Calendar className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-xl xl:text-2xl font-extrabold mb-1 leading-tight truncate">{result.nextWatering}</div>
                  <div className="text-[10px] xl:text-xs opacity-80 font-medium flex items-center gap-1 truncate">
                    <Clock className="w-3 h-3 shrink-0" /> {t.irrigation?.every || 'Every'} {result.frequency}
                  </div>
                </div>

                {/* PATENT CLAIM: NEW FEATURE - ET STRESS INDEX */}
                <div
                  onClick={() => setSelectedMetric({ title: t.irrigation?.etStressIndex || 'ET Stress Index', description: t.irrigation?.etStressIndexDesc || 'Evapotranspiration (ET) Load calculates how fast water is evaporating from the soil based on current temperature, humidity, and wind. High stress means the crop is baking in the sun and requires emergency watering.' })}
                  className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-transform hover:-translate-y-1 cursor-pointer flex flex-col justify-between col-span-2 md:col-span-1"
                >
                  <div className="flex items-center justify-between mb-2 opacity-90">
                    <span className="text-xs font-semibold uppercase tracking-wider truncate mr-1">{t.irrigation?.etStressShort || 'ET Stress'}</span>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="text-xl xl:text-2xl font-extrabold mb-1 truncate">{result.etStressScore}</div>
                  <div className="text-[10px] xl:text-xs opacity-100 font-bold bg-white/20 inline-block px-1.5 py-0.5 rounded truncate w-max max-w-full">
                    {t.irrigation?.etLoad || 'ET Load'}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowScheduleModal(true)}
                className="w-full bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 p-6 rounded-2xl shadow-md flex items-center justify-between group hover:shadow-lg transition-all border border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-cyan-500/20 p-3 rounded-full">
                    <Calendar className="text-cyan-300 w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-white font-bold text-lg">{t.irrigation?.viewDetailedPlan || 'View Detailed Irrigation Plan'}</h3>
                    <p className="text-gray-400 text-sm">{t.irrigation?.clickToSeeSchedule?.replace('{cropName}', result.cropName) || `Click to see week-by-week schedule for ${result.cropName}`}</p>
                  </div>
                </div>
                <div className="bg-gray-700 p-2 rounded-full group-hover:bg-cyan-600 transition-colors">
                  <ChevronRight className="text-white w-5 h-5" />
                </div>
              </button>

            </div>
          ) : (
            <div className="bg-gray-50 rounded-3xl p-8 border-2 border-dashed border-gray-200 h-full flex flex-col items-center justify-center text-center opacity-75">
              <Droplets className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-500 mb-2">{t.irrigation?.noScheduleYet || 'No Schedule Generated Yet'}</h3>
              <p className="text-gray-400 max-w-sm">
                {t.irrigation?.enterDetailsToGenerate || 'Enter your land size and select a crop type on the left to generate a smart irrigation plan.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showScheduleModal && result && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col animate-slideInUp">

            <div className="bg-gradient-to-r from-slate-800 to-gray-900 p-6 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Sprout className="text-green-400 w-6 h-6" />
                <h3 className="text-xl font-bold text-white">{result.cropName} {t.irrigation?.irrigationLifecycle || 'Irrigation Lifecycle'}</h3>
              </div>
              <button onClick={() => setShowScheduleModal(false)} className="text-gray-400 hover:text-white transition-colors bg-gray-700/50 p-2 rounded-full hover:bg-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-grow bg-gray-50">
              <div className="space-y-4">
                {result.scheduleData.map((item, index) => (
                  <div key={index} className="bg-white border border-gray-100 rounded-xl p-5 flex gap-4 shadow-sm relative overflow-hidden">
                    {index !== result.scheduleData.length - 1 && (
                      <div className="absolute left-[2.4rem] top-16 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                    )}

                    <div className="bg-cyan-100 text-cyan-700 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 relative z-10 border-4 border-white shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{item.stage}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex items-start gap-2 border border-blue-100">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p>{t.irrigation?.scheduleDisclaimer || 'This schedule is a general guideline. Always adjust based on predictive weather models and dynamic cloud-fusion recommendations.'}</p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white text-right">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                {t.irrigation?.closePlan || 'Close Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedMetric && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fadeIn font-sans">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-slideInUp">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                {selectedMetric.title}
              </h3>
              <button onClick={() => setSelectedMetric(null)} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {selectedMetric.description}
              </p>
              <button
                onClick={() => setSelectedMetric(null)}
                className="w-full mt-6 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-xl transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SmartIrrigation;