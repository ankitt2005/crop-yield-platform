import React, { useState, useEffect } from 'react';
import { User, Globe, Bell, Save } from 'lucide-react';

const SettingsPage = ({ user, language, setLanguage }) => {
  // 1. Create local state to manage the form inputs
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // 2. Load user data into the form when the page loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "Farmer",
        email: user.email || "farmer@example.com"
      });
    }
  }, [user]);

  // 3. Handle typing in the input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    alert("Profile updated successfully!");
    // Here you would typically send the 'formData' to your backend API
    console.log("Saving data:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <span className="p-2 bg-green-100 rounded-lg text-green-600">⚙️</span>
        Settings
      </h1>

      <div className="grid gap-8">
        
        {/* --- 1. PROFILE SECTION (NOW EDITABLE) --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Profile Information
            </h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name} 
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">Email Address</label>
              <input 
                type="email" 
                name="email"
                value={formData.email} 
                onChange={handleInputChange}
                className="w-full p-3 bg-white border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </div>

        {/* --- 2. PREFERENCES SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              Language & Region
            </h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-semibold text-gray-600 mb-2">App Language</label>
            <div className="relative">
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl appearance-none bg-white focus:outline-none focus:border-green-500 transition-colors cursor-pointer"
              >
                <option value="en">English (English)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="od">Odia (ଓଡ଼ିଆ)</option>
                <option value="te">Telugu (తెలుగు)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</div>
            </div>
            <p className="text-xs text-gray-400 mt-2">This will update the text across the entire platform immediately.</p>
          </div>
        </div>

        {/* --- 3. NOTIFICATIONS SECTION --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-green-600" />
              Notifications
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Weather Alerts</p>
                <p className="text-sm text-gray-500">Get notified about sudden weather changes.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-700">Crop Recommendations</p>
                <p className="text-sm text-gray-500">Weekly tips for your specific crops.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* --- SAVE BUTTON --- */}
        <div className="flex justify-end pb-8">
          <button 
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center gap-2 transition-transform active:scale-95"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default SettingsPage;