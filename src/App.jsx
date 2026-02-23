import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';

// --- COMPONENTS ---
import AuthPage from './components/AuthPage';
import Header from './components/Header';
import InputForm from './components/InputForm';
import PredictionResults from './components/PredictionResults'; // Uses backend API result
import StatsOverview from './components/StatsOverview';
import FarmingTips from './components/FarmingTips';
import SettingsPage from './components/SettingsPage';
import WeatherDashboard from './components/WeatherDashboard';
import DiseaseDetection from './components/DiseaseDetection';
import ExpenseTracker from './components/ExpenseTracker';
import GovernmentSchemes from './components/GovernmentSchemes';
import AIChatbot from './components/AIChatbot';
import Marketplace from './components/Marketplace';
import SmartIrrigation from './components/SmartIrrigation';
import CommunityForum from './components/CommunityForum';
import { DollarSign, Landmark, ShoppingCart, Droplets, Users } from 'lucide-react';

// --- SUB-COMPONENT: DASHBOARD CONTENT ---
const DashboardContent = ({ user, language, setLanguage, handleLogout }) => {
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showExpenseTracker, setShowExpenseTracker] = useState(false);

  const handlePrediction = async (formData) => {
    try {
      setLoading(true);

      const apiUrl = import.meta.env.VITE_NODE_API_URL || 'http://localhost:5001';
      const response = await fetch(`${apiUrl}/api/recommend-crops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch prediction from server');
      }

      const result = await response.json();
      setPrediction(result);

      // Scroll to results
      setTimeout(() => {
        const resultsElement = document.getElementById('prediction-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error(error);
      alert('Unable to get prediction from server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Pass 'en' directly if StatsOverview expects a language */}
      <StatsOverview language="en" />

      {/* FEATURE GRID */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Expense Tracker */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => setShowExpenseTracker(!showExpenseTracker)} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-purple-50 hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-purple-400 to-pink-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-200" style={{ transform: 'translateZ(30px)' }}><DollarSign className="w-6 h-6" /></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded-full w-max mb-1">Financial</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">{showExpenseTracker ? 'Hide' : 'Show'} Tracker</h3>
                </div>
              </div>
            </button>
          </Tilt>

          {/* AI Crop Doctor */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => navigate('/disease-detection')} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-red-50 hover:shadow-xl hover:shadow-red-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-orange-400 to-red-600 p-4 rounded-2xl text-white shadow-lg shadow-red-200" style={{ transform: 'translateZ(30px)' }}><span className="text-2xl">📸</span></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-1 rounded-full w-max mb-1">AI Feature</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">AI Crop Doctor</h3>
                </div>
              </div>
            </button>
          </Tilt>

          {/* Schemes */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => navigate('/schemes')} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-blue-50 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-blue-400 to-indigo-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200" style={{ transform: 'translateZ(30px)' }}><Landmark className="w-6 h-6" /></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded-full w-max mb-1">Support</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">Schemes & Loans</h3>
                </div>
              </div>
            </button>
          </Tilt>

          {/* Marketplace */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => navigate('/marketplace')} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-orange-50 hover:shadow-xl hover:shadow-orange-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 p-4 rounded-2xl text-white shadow-lg shadow-orange-200" style={{ transform: 'translateZ(30px)' }}><ShoppingCart className="w-6 h-6" /></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-orange-600 bg-orange-100 px-2 py-1 rounded-full w-max mb-1">Commerce</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">Marketplace</h3>
                </div>
              </div>
            </button>
          </Tilt>

          {/* Smart Irrigation */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => navigate('/irrigation')} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-cyan-50 hover:shadow-xl hover:shadow-cyan-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-cyan-400 to-sky-600 p-4 rounded-2xl text-white shadow-lg shadow-cyan-200" style={{ transform: 'translateZ(30px)' }}><Droplets className="w-6 h-6" /></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-cyan-600 bg-cyan-100 px-2 py-1 rounded-full w-max mb-1">IoT Tools</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">Smart Irrigation</h3>
                </div>
              </div>
            </button>
          </Tilt>

          {/* Community Forum */}
          <Tilt glareEnable={true} glareMaxOpacity={0.4} scale={1.05} transitionSpeed={2500}>
            <button onClick={() => navigate('/forum')} className="relative w-full bg-white p-6 rounded-3xl shadow-md border-2 border-teal-50 hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 group text-left h-32 flex items-center" style={{ transformStyle: 'preserve-3d' }}>
              <div className="flex items-center gap-4 w-full" style={{ transform: 'translateZ(20px)' }}>
                <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-4 rounded-2xl text-white shadow-lg shadow-teal-200" style={{ transform: 'translateZ(30px)' }}><Users className="w-6 h-6" /></div>
                <div style={{ transform: 'translateZ(20px)' }}>
                  <span className="block text-[10px] font-extrabold uppercase tracking-wider text-teal-600 bg-teal-100 px-2 py-1 rounded-full w-max mb-1">Social</span>
                  <h3 className="font-bold text-gray-900 text-lg leading-tight">Community Forum</h3>
                </div>
              </div>
            </button>
          </Tilt>
        </div>
      </div>

      {showExpenseTracker && (
        <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
          <ExpenseTracker language={language} setLanguage={setLanguage} />
        </div>
      )}

      {/* MAIN PREDICTION AREA */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 animate-slideInLeft">
            <InputForm language={language} onSubmit={handlePrediction} loading={loading} />
            <div className="mt-8"><FarmingTips language={language} /></div>
          </div>

          <div className="lg:col-span-2 animate-slideInRight" id="prediction-results">
            {/* Using the safe PredictionResults component */}
            <PredictionResults prediction={prediction} loading={loading} />
          </div>
        </div>
      </div>
    </>
  );
};

// --- MAIN APP COMPONENT ---
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    const loggedInUser = localStorage.getItem('cropYieldLoggedInUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('cropYieldLoggedInUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('cropYieldLoggedInUser');
  };

  if (!isAuthenticated) {
    return <AuthPage onLogin={handleLogin} />;
  }

  // ✅ FIX: REMOVED <LanguageProvider> WRAPPER
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden font-sans">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Header language={language} setLanguage={setLanguage} user={user} onLogout={handleLogout} />

        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<DashboardContent user={user} language={language} setLanguage={setLanguage} handleLogout={handleLogout} />} />
            <Route path="/weather" element={<WeatherDashboard />} />
            <Route path="/disease-detection" element={<DiseaseDetection language={language} setLanguage={setLanguage} />} />
            <Route path="/schemes" element={<GovernmentSchemes language={language} setLanguage={setLanguage} />} />
            <Route path="/marketplace" element={<Marketplace language={language} setLanguage={setLanguage} />} />
            <Route path="/irrigation" element={<SmartIrrigation language={language} setLanguage={setLanguage} />} />
            <Route path="/forum" element={<CommunityForum language={language} setLanguage={setLanguage} />} />
            <Route path="/settings" element={<SettingsPage user={user} language={language} setLanguage={setLanguage} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <footer className="bg-white mt-auto py-8 shadow-inner relative z-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-600">© 2025 AI Crop Prediction Platform</p>
          </div>
        </footer>
      </div>
      <AIChatbot />
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
}

export default App;