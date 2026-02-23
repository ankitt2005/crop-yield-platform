import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, ArrowLeft, AlertTriangle, Search, MapPin, Thermometer, Calendar, Clock, Umbrella } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WeatherDashboard = () => {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  
  // Interactivity States
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const [activeDetail, setActiveDetail] = useState(null); 

  const [location, setLocation] = useState({ lat: 28.6139, long: 77.2090, name: "New Delhi, India" });

  // --- Background Dynamic Logic ---
  const getPageBackground = (code) => {
    if (code === undefined) return "bg-gradient-to-br from-green-50 to-teal-100";
    if (code === 0) return "bg-gradient-to-br from-blue-400 via-orange-200 to-yellow-100"; // Sunny
    if (code >= 1 && code <= 3) return "bg-gradient-to-br from-slate-300 via-gray-200 to-blue-200"; // Cloudy
    if (code >= 45 && code <= 48) return "bg-gradient-to-br from-slate-400 via-gray-300 to-zinc-300"; // Fog
    if (code >= 51 && code <= 67) return "bg-gradient-to-br from-blue-800 via-blue-500 to-slate-400"; // Rain
    if (code >= 71 && code <= 77) return "bg-gradient-to-br from-indigo-300 via-purple-200 to-white"; // Snow
    if (code >= 95) return "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800"; // Storm
    return "bg-gradient-to-br from-green-50 to-teal-100";
  };

  const getWeatherInfo = (code) => {
    // ... (Keep existing icon logic)
    if (code === 0) return { icon: <Sun className="w-8 h-8 text-yellow-400" />, label: "Clear Sky", color: "from-orange-400 to-yellow-300" };
    if (code >= 1 && code <= 3) return { icon: <Cloud className="w-8 h-8 text-gray-200" />, label: "Cloudy", color: "from-gray-400 to-slate-500" };
    if (code >= 45 && code <= 48) return { icon: <Wind className="w-8 h-8 text-blue-200" />, label: "Foggy", color: "from-slate-400 to-gray-500" };
    if (code >= 51 && code <= 67) return { icon: <CloudRain className="w-8 h-8 text-blue-200" />, label: "Rain", color: "from-blue-500 to-cyan-600" };
    if (code >= 71 && code <= 77) return { icon: <CloudRain className="w-8 h-8 text-white" />, label: "Snow", color: "from-indigo-400 to-purple-500" };
    if (code >= 95) return { icon: <AlertTriangle className="w-8 h-8 text-red-200" />, label: "Thunderstorm", color: "from-slate-700 to-gray-900" };
    return { icon: <Sun className="w-8 h-8 text-orange-100" />, label: "Clear", color: "from-orange-400 to-amber-500" };
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setSelectedDay(null);
    setSelectedHour(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${searchQuery}&count=1&language=en&format=json`
      );
      const geoData = await geoResponse.json();

      if (!geoData.results || geoData.results.length === 0) {
        setError("Location not found.");
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoData.results[0];
      setLocation({ lat: latitude, long: longitude, name: `${name}, ${country}` });
    } catch (err) {
      setError("Network error.");
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        // UPDATED API CALL: Added windspeed_10m and precipitation_probability to hourly
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.long}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode,windspeed_10m_max&hourly=temperature_2m,weathercode,windspeed_10m,precipitation_probability&timezone=auto`
        );
        const data = await response.json();
        setWeather(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchWeather();
  }, [location]);

  // --- 1. HIGHLY DYNAMIC ADVISORY SYSTEM ---
  const getAdvisories = () => {
    if (!weather || !weather.daily) return { activeAlert: null, optimals: [] };
    
    const maxTemp = weather.daily.temperature_2m_max[0];
    const minTemp = weather.daily.temperature_2m_min[0];
    const rain = weather.daily.precipitation_sum[0];
    const wind = weather.daily.windspeed_10m_max ? weather.daily.windspeed_10m_max[0] : 0;
    const weatherCode = weather.daily.weathercode[0];
    const isCloudy = weatherCode >= 1 && weatherCode <= 3;
    const isClear = weatherCode === 0;

    let activeAlert = null;
    let optimalConditions = [];

    // --- Active Alerts (Priority Based) ---
    if (maxTemp > 40) activeAlert = { color: 'red', title: 'Extreme Heat Warning', msg: 'Critical crop stress likely. Irrigate immediately during coolest hours.' };
    else if (rain > 25) activeAlert = { color: 'blue', title: 'Flood/Waterlogging Risk', msg: 'Heavy rain expected. Ensure field drainage is clear. Halt field traffic.' };
    else if (wind > 35) activeAlert = { color: 'orange', title: 'Severe Wind Warning', msg: 'Risk of lodging in tall crops. Secure any temporary farm structures.' };
    else if (minTemp < 4) activeAlert = { color: 'indigo', title: 'Frost Risk Alert', msg: 'Temperatures near freezing. Deploy frost protection measures for sensitive crops.' };
    else if (maxTemp > 35) activeAlert = { color: 'orange', title: 'Heat Advisory', msg: 'High evaporation rates. Monitor soil moisture closely.' };
    else activeAlert = { color: 'green', title: 'Favorable Conditions', msg: 'Current weather is conducive to standard agricultural operations.' };

    // --- 3 Unique & Specific Optimal Conditions ---
    
    // Slot 1: Field Operations & Machinery
    if (rain > 2) {
        optimalConditions.push("Soils are wet: Avoid heavy machinery to prevent compaction.");
    } else if (rain === 0 && wind < 15 && isClear) {
        optimalConditions.push("Ideal conditions for mechanical weeding or sowing operations.");
    } else if (wind > 20) {
        optimalConditions.push("High winds make boom spraying inefficient and drift-prone.");
    } else {
        optimalConditions.push("Standard field access conditions apply.");
    }

    // Slot 2: Crop Health & inputs
    if (rain === 0 && wind < 10 && maxTemp < 30) {
        optimalConditions.push("Perfect window for foliar fertilizer or pesticide application.");
    } else if (rain > 5 && isCloudy) {
        optimalConditions.push("Humid conditions: Scout closely for fungal disease onset.");
    } else if (maxTemp > 32 && rain === 0) {
        optimalConditions.push("High transpiration demand: Ensure irrigation systems are running.");
    } else {
        optimalConditions.push("Monitor crops for nutrient deficiencies.");
    }

    // Slot 3: Harvest & Post-Harvest
    if (isClear && rain === 0 && maxTemp > 25) {
        optimalConditions.push("Excellent day for harvesting and sun-drying produce.");
    } else if (rain > 0) {
        optimalConditions.push("Delay harvest activities to prevent spoilage and grain moisture issues.");
    } else if (minTemp < 10) {
        optimalConditions.push("Cool temperatures are good for post-harvest storage quality.");
    } else {
        optimalConditions.push("Ensure storage facilities are ready for incoming harvest.");
    }

    return { activeAlert, optimals: optimalConditions.slice(0, 3) };
  };

  const { activeAlert, optimals } = getAdvisories();
  const currentInfo = weather ? getWeatherInfo(weather.current_weather.weathercode) : { icon: null, label: "Loading", color: "from-blue-500 to-blue-600" };
  const pageBg = weather ? getPageBackground(weather.current_weather.weathercode) : "bg-green-50";

  // --- HOURLY DATA PROCESSING (With extra data) ---
  const getHourlyForecast = () => {
    if (!weather || !weather.hourly) return [];
    const currentHour = new Date().getHours();
    const next12Hours = [];
    
    for(let i = currentHour; i < currentHour + 12; i++) {
        if (weather.hourly.time[i]) {
            next12Hours.push({
                time: new Date(weather.hourly.time[i]),
                temp: weather.hourly.temperature_2m[i],
                code: weather.hourly.weathercode[i],
                wind: weather.hourly.windspeed_10m[i], // New data
                precipProb: weather.hourly.precipitation_probability[i] // New data
            });
        }
    }
    return next12Hours;
  };

  // --- Helper for Daily Interaction Tip ---
  const getDailyTip = (index) => {
      const maxT = weather.daily.temperature_2m_max[index];
      const rain = weather.daily.precipitation_sum[index];
      const wind = weather.daily.windspeed_10m_max[index];
      const code = weather.daily.weathercode[index];

      if (rain > 10) return "Heavy rain risk. Plan drainage.";
      if (rain > 2) return "Some rain likely. Avoid spraying.";
      if (maxT > 36) return "Heat stress likely. Irrigate.";
      if (wind > 25) return "Too windy for tall crops.";
      if (code === 0 && maxT < 32) return "Ideal for sowing/harvesting.";
      return "Standard operations feasible.";
  }

  const hourlyData = getHourlyForecast();

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Cloud className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
        <p className="text-gray-500 font-bold text-xl animate-pulse">Scanning Atmosphere...</p>
    </div>
  );

  return (
    <div className={`min-h-screen ${pageBg} transition-colors duration-1000 overflow-x-hidden relative font-sans`}>
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button onClick={() => navigate('/')} className="p-3 bg-white/40 backdrop-blur-md rounded-full shadow-lg border border-white/50 hover:bg-white/60 transition-all group">
              <ArrowLeft className="w-6 h-6 text-gray-800" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight drop-shadow-sm">Weather Intelligence</h1>
              <p className="text-gray-700 font-medium">Real-time forecasts for smarter farming</p>
            </div>
          </div>

          {/* 2. ATTRACTIVE BLUE SEARCH BUTTON */}
          <form onSubmit={handleSearch} className="relative w-full md:w-96 shadow-2xl rounded-2xl group transition-all">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-xl rounded-2xl border border-white/50"></div>
            <input
              type="text"
              placeholder="Search city (e.g. Pune)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="relative w-full pl-12 pr-28 py-4 rounded-2xl bg-transparent text-gray-900 placeholder-gray-600 focus:outline-none font-medium z-10"
            />
            <Search className="absolute left-4 top-4 text-gray-700 w-5 h-5 z-10" />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 rounded-xl font-bold shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all z-10 flex items-center gap-2"
            >
              Search
            </button>
          </form>
        </div>

        {error && <div className="bg-red-100/90 backdrop-blur-md text-red-800 p-4 rounded-2xl mb-6 font-bold flex items-center gap-2 border border-red-200 shadow-lg"><AlertTriangle className="w-5 h-5"/>{error}</div>}

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* MAIN WEATHER CARD */}
          <div className={`md:col-span-2 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden bg-gradient-to-br ${currentInfo.color} transition-all duration-500 hover:shadow-2xl hover:scale-[1.005]`}>
            <div className="relative z-10 flex justify-between items-start mb-10">
              <div>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold w-fit mb-4 shadow-sm border border-white/10 hover:bg-white/30 cursor-default transition-all">
                  <MapPin className="w-4 h-4" /> {location.name}
                </div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-8xl font-black tracking-tighter drop-shadow-xl">
                      {Math.round(weather.current_weather.temperature)}°
                  </h2>
                  <span className="text-4xl font-medium opacity-90">C</span>
                </div>
                <p className="text-2xl font-bold mt-2 flex items-center gap-2 opacity-95 tracking-wide">
                  {currentInfo.label}
                </p>
              </div>
              <div className="p-6 bg-white/20 rounded-[2rem] backdrop-blur-md shadow-2xl border border-white/20 animate-blob">
                {React.cloneElement(currentInfo.icon, { className: "w-24 h-24 text-white drop-shadow-lg" })}
              </div>
            </div>

            {/* Clickable Metrics */}
            <div className="relative z-10 grid grid-cols-3 gap-4">
              {['wind', 'precip', 'temp'].map((type) => {
                  const isActive = activeDetail === type;
                  let icon, label, val, sub, desc;
                  
                  if(type === 'wind') {
                      icon = <Wind className="w-5 h-5" />; label = "WIND"; val = weather.current_weather.windspeed; sub = "km/h";
                      desc = val > 15 ? "High wind. Drift risk." : "Optimal for spraying.";
                  } else if (type === 'precip') {
                      icon = <Droplets className="w-5 h-5" />; label = "PRECIP"; val = weather.daily.precipitation_sum[0]; sub = "mm";
                      desc = val > 0 ? "Rain expected." : "Dry conditions.";
                  } else {
                      icon = <Thermometer className="w-5 h-5" />; label = "MAX"; val = weather.daily.temperature_2m_max[0]; sub = "°C";
                      desc = `Low: ${weather.daily.temperature_2m_min[0]}°C`;
                  }

                  return (
                      <div 
                          key={type}
                          onClick={() => setActiveDetail(isActive ? null : type)}
                          className={`p-4 rounded-2xl transition-all cursor-pointer border backdrop-blur-md ${isActive ? 'bg-white text-gray-800 scale-105 shadow-2xl border-white' : 'bg-white/10 text-white border-white/10 hover:bg-white/20'}`}
                      >
                          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                              {icon} {label}
                          </div>
                          <p className="text-2xl font-bold">{val} <span className="text-sm font-normal opacity-80">{sub}</span></p>
                          {isActive && <p className="text-[11px] mt-2 font-bold text-blue-600 animate-fadeIn leading-tight">{desc}</p>}
                      </div>
                  );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: ADVISORY & OPTIMAL CONDITIONS */}
          <div className="flex flex-col gap-6">
              
              {/* Active Advisory Card */}
              <div className={`rounded-3xl p-6 shadow-xl border-l-8 backdrop-blur-xl transition-all duration-300 ${
                  activeAlert?.color === 'red' ? 'bg-red-50/80 border-red-500' : 
                  activeAlert?.color === 'orange' ? 'bg-orange-50/80 border-orange-500' : 
                  activeAlert?.color === 'blue' ? 'bg-blue-50/80 border-blue-500' : 
                  activeAlert?.color === 'indigo' ? 'bg-indigo-50/80 border-indigo-500' : 
                  'bg-white/60 border-green-500'
              }`}>
                  <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-full shadow-md bg-white`}>
                          <AlertTriangle className={`w-6 h-6 ${
                              activeAlert?.color === 'red' ? 'text-red-600' : 
                              activeAlert?.color === 'green' ? 'text-green-600' : 
                              'text-blue-600'
                          }`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{activeAlert?.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-sm font-semibold pl-1">
                      {activeAlert?.msg}
                  </p>
              </div>

              {/* 1. DYNAMIC OPTIMAL CONDITIONS CARD */}
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl flex-1 border border-white/40 relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 opacity-10 rotate-12"><Sun className="w-28 h-28 text-green-600"/></div>
                  <h3 className="text-xs font-extrabold text-gray-600 uppercase tracking-widest mb-5 flex items-center gap-2 relative z-10">
                      <span className="bg-green-100 p-1 rounded-md text-green-700">✅</span> Optimal Conditions
                  </h3>
                  <ul className="space-y-4 relative z-10">
                      {optimals.map((opt, i) => (
                          <li key={i} className="flex gap-3 items-start p-3 bg-white/70 rounded-xl border border-white/60 shadow-sm hover:shadow-md transition-all">
                              <span className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 shadow-lg shadow-green-400"></span>
                              <span className="text-gray-800 text-sm font-medium leading-snug">{opt}</span>
                          </li>
                      ))}
                  </ul>
              </div>
          </div>
        </div>

        {/* 3. INFORMATIVE HOURLY FORECAST */}
        <div className="mt-12 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 drop-shadow-sm">
              <Clock className="w-6 h-6 text-gray-800" /> Hourly Forecast <span className="text-sm font-normal text-gray-600 ml-2 bg-white/40 px-2 py-1 rounded-lg backdrop-blur-sm">(Next 12 Hours)</span>
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar px-1">
              {hourlyData.map((hour, index) => {
                  const info = getWeatherInfo(hour.code);
                  const isNow = index === 0;
                  const isSelected = selectedHour === index;

                  return (
                      <div 
                          key={index} 
                          onClick={() => setSelectedHour(isSelected ? null : index)}
                          className={`min-w-[110px] p-4 rounded-3xl flex flex-col items-center justify-center border transition-all cursor-pointer backdrop-blur-md shadow-lg ${
                              isSelected || isNow 
                              ? 'bg-gray-900 text-white scale-105 border-gray-700 z-10' 
                              : 'bg-white/60 text-gray-800 border-white/40 hover:bg-white/80'
                          }`}
                      >
                          <p className={`text-xs font-bold mb-2 ${isSelected || isNow ? 'text-gray-300' : 'text-gray-500'}`}>
                              {isNow ? 'Now' : hour.time.toLocaleTimeString([], { hour: '2-digit' })}
                          </p>
                          <div className="mb-2 scale-110">
                              {React.cloneElement(info.icon, { className: isSelected || isNow ? "w-8 h-8 text-white" : "w-8 h-8 text-gray-600" })}
                          </div>
                          <p className="text-xl font-bold">{Math.round(hour.temp)}°</p>
                          
                          {/* 3. INFORMATIVE DETAILS ON CLICK */}
                          {(isSelected || isNow) && (
                              <div className="mt-3 pt-2 border-t border-white/20 w-full text-center animate-fadeIn flex flex-col gap-1">
                                  <div className="flex items-center justify-center gap-1 text-[10px] text-blue-200">
                                      <Umbrella className="w-3 h-3" /> {hour.precipProb}% Rain
                                  </div>
                                  <div className="flex items-center justify-center gap-1 text-[10px] text-gray-300">
                                      <Wind className="w-3 h-3" /> {Math.round(hour.wind)} km/h
                                  </div>
                              </div>
                          )}
                      </div>
                  )
              })}
          </div>
        </div>

        {/* 4. INFORMATIVE 7-DAY FORECAST */}
        <div className="mt-4 pb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 drop-shadow-sm">
              <Calendar className="w-6 h-6 text-gray-800" /> 7-Day Forecast
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weather.daily.time.map((date, index) => {
                  const code = weather.daily.weathercode[index];
                  const info = getWeatherInfo(code);
                  const isSelected = selectedDay === index;
                  const maxT = Math.round(weather.daily.temperature_2m_max[index]);
                  const minT = Math.round(weather.daily.temperature_2m_min[index]);
                  // Get specific tip for this day
                  const dailyTip = getDailyTip(index);

                  return (
                      <div 
                          key={date}
                          onClick={() => setSelectedDay(isSelected ? null : index)}
                          className={`p-4 rounded-3xl text-center transition-all cursor-pointer border hover:-translate-y-1 backdrop-blur-md shadow-lg relative overflow-hidden ${
                              isSelected 
                              ? 'bg-gray-900 text-white border-gray-700 scale-105 z-10' 
                              : 'bg-white/60 text-gray-700 border-white/40 hover:bg-white/90'
                          }`}
                      >
                          <p className={`text-xs font-bold uppercase mb-3 ${isSelected ? 'opacity-90' : 'opacity-60'}`}>
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </p>
                          <div className="flex justify-center mb-3 scale-110">
                              {React.cloneElement(info.icon, { className: isSelected ? "w-8 h-8 text-white" : "w-8 h-8 text-gray-600" })}
                          </div>
                          <div className="flex justify-center gap-1 items-baseline">
                              <span className="text-xl font-bold">{maxT}°</span>
                              <span className={`text-sm ${isSelected ? 'opacity-80' : 'opacity-50'}`}>{minT}°</span>
                          </div>
                          
                          {/* 4. SPECIFIC DAILY TIP ON CLICK */}
                          {isSelected && (
                              <div className="mt-3 pt-2 border-t border-white/20 animate-fadeIn">
                                  <p className="text-[10px] font-bold text-green-300 leading-tight">{dailyTip}</p>
                              </div>
                          )}
                      </div>
                  );
              })}
          </div>
        </div>

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar { height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,0,0,0.2); }
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}</style>
      </div>
    </div>
  );
};

export default WeatherDashboard;