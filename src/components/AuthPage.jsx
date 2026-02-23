import React, { useState, useEffect } from 'react';
import { Sprout, Mail, Lock, User, Eye, EyeOff, ArrowRight, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';

// 1. IMPORT DATA & ASSETS
import { translations } from '../data/translations'; 
import farmerBg from '../assets/main-farmer-bg.jpeg';

function AuthPage({ onLogin }) {
  // --- LANGUAGE STATE ---
  const [lang, setLang] = useState('en');

  // Load language preference from LocalStorage
  useEffect(() => {
    const savedLang = localStorage.getItem('krishiBandhuLang');
    if (savedLang) setLang(savedLang);
  }, []);

  // Handle Language Change
  const handleLangChange = (e) => {
    const selectedLang = e.target.value;
    setLang(selectedLang);
    localStorage.setItem('krishiBandhuLang', selectedLang);
  };

  // Get translation object
  const t = translations[lang];

  // --- EXISTING FORM STATE ---
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!isLogin && !formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters required';
    if (!isLogin && formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
        // Pass data back to parent
        onLogin({ name: formData.name || 'Farmer', email: formData.email });
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4 relative"
      style={{ backgroundImage: `url(${farmerBg})` }}
    >
      
      {/* --- LANGUAGE SWITCHER (Top Right) --- */}
      <div className="absolute top-5 right-5 z-50">
        <div className="flex items-center bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md px-3 py-1.5">
          <span className="mr-2 text-lg">🌐</span>
          <select 
            value={lang} 
            onChange={handleLangChange}
            className="bg-transparent text-sm font-semibold text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="od">ଓଡିଆ (Odia)</option>
            <option value="te">తెలుగు (Telugu)</option>
          </select>
        </div>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/40 via-black/20 to-black/50 backdrop-blur-[2px]"></div>

      {/* CARD CONTAINER */}
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10 animate-fadeIn min-h-[650px]">
        
        {/* LEFT SIDE: Branding */}
        <div className="hidden lg:flex w-1/2 bg-[#0A5C36] text-white flex-col justify-between p-12 relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-yellow-200 via-green-600 to-transparent"></div>
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-10">
              <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-lg">
                <Leaf className="w-6 h-6 text-green-300" />
              </div>
              <span className="text-2xl font-bold tracking-wide font-sans">{t.brandName}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-bold leading-tight mb-6">
              {t.tagline}
            </h1>

            <p className="text-green-100/90 mb-8 leading-relaxed font-light">
              {t.heroDesc}
            </p>

            {/* Stats Cards */}
            <div className="flex gap-4 mt-8">
                <div className="flex-1 p-5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
                    <TrendingUp className="w-6 h-6 text-green-300 mb-3" />
                    <div className="text-3xl font-bold">25%</div>
                    <div className="text-xs text-green-200 uppercase tracking-wider mt-1">{t.stat1Label}</div>
                </div>
                <div className="flex-1 p-5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5 hover:bg-white/15 transition-colors">
                    <ShieldCheck className="w-6 h-6 text-green-300 mb-3" />
                    <div className="text-3xl font-bold">98%</div>
                    <div className="text-xs text-green-200 uppercase tracking-wider mt-1">{t.stat2Label}</div>
                </div>
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10 flex items-center space-x-2 text-sm text-green-200/70 mt-auto">
            <Sprout className="w-4 h-4" />
            <span>{t.trustedBy}</span>
          </div>
        </div>

        {/* RIGHT SIDE: Auth Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 bg-white flex flex-col justify-center relative">
            
            {/* Mobile Header */}
            <div className="lg:hidden mb-8">
                <div className="flex items-center space-x-2 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Leaf className="w-6 h-6 text-green-700" />
                    </div>
                    <span className="text-xl font-bold text-gray-800">{t.brandName}</span>
                </div>
            </div>

            {/* Login/Signup Toggle */}
            <div className="flex bg-gray-100 p-1.5 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => { setIsLogin(true); setErrors({}); }}
                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${isLogin ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {t.loginBtn}
                </button>
                <button
                    onClick={() => { setIsLogin(false); setErrors({}); }}
                    className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${!isLogin ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    {t.signupBtn}
                </button>
            </div>

            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    {isLogin ? t.welcome : 'Create Account'}
                </h2>
                <p className="text-gray-500 text-sm">
                    {isLogin ? t.subWelcome : 'Start your smart farming journey today'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input (Collapsed when Login) */}
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Full Name</label>
                    <div className="relative mt-1.5">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="e.g. Ramesh Kumar"
                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-xl outline-none transition-all focus:ring-4 focus:ring-green-500/10`}
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                </div>

                {/* Email Input */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">{t.emailLabel}</label>
                    <div className="relative mt-1.5">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="farmer@example.com"
                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-xl outline-none transition-all focus:ring-4 focus:ring-green-500/10`}
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                </div>

                {/* Password Input */}
                <div>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">{t.passwordLabel}</label>
                    <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-12 py-3 bg-gray-50 border ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-xl outline-none transition-all focus:ring-4 focus:ring-green-500/10`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}
                </div>

                 {/* Confirm Password (Collapsed when Login) */}
                 <div className={`transition-all duration-300 ease-in-out overflow-hidden ${!isLogin ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider ml-1">Confirm Password</label>
                    <div className="relative mt-1.5">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className={`w-full pl-12 pr-4 py-3 bg-gray-50 border ${errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-green-500'} rounded-xl outline-none transition-all focus:ring-4 focus:ring-green-500/10`}
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>}
                </div>

                {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer select-none">
                            <input type="checkbox" className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500" />
                            <span className="text-gray-600">{t.rememberMe}</span>
                        </label>
                        <button type="button" className="text-green-600 hover:text-green-700 font-medium hover:underline">{t.forgotPass}</button>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#059669] hover:bg-[#047857] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-green-500/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    {/* Switch Text based on Login state */}
                    <span>{isLogin ? t.accessBtn : 'Get Started'}</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </form>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;