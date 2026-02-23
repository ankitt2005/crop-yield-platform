import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Search, CheckCircle, AlertTriangle, Loader, ArrowLeft, Camera, Leaf, Languages } from 'lucide-react';
import { translations } from '../data/translations';
import { localizedDisease } from '../data/localizedDisease';

const DiseaseDetection = ({ language, setLanguage }) => {
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setResult(null);

    try {
      // 1. Convert image to Base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      // 2. Send to our new Python ML heuristic endpoint
      const apiUrl = import.meta.env.VITE_ML_API_URL || 'http://localhost:8002';
      const response = await fetch(`${apiUrl}/analyze-disease`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64Image,
          language: language || 'en'
        })
      });

      if (!response.ok) {
        throw new Error('Analysis request failed');
      }

      const data = await response.json();
      setResult(data);

    } catch (error) {
      console.error("Error analyzing image:", error);
      // Fallback in case the python backend isn't running
      setResult({
        ...localizedDisease[language] || localizedDisease.en,
        disease: "API Error: Could not connect to ML Backend.",
        confidence: 0,
        severity: "Unknown",
        symptoms: ["Check if Python ML service is running on Port 8000"]
      });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">

      {/* HEADER with Back Button */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-xl mb-8 flex items-center gap-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 p-4">
          <Camera size={150} />
        </div>

        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>

        <div className="z-10 flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <span className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">📸</span>
            {t.disease?.title || 'AI Crop Doctor'}
          </h1>
          <p className="mt-2 text-green-100 max-w-xl">
            {t.disease?.subtitle || 'Upload a photo of your crop leaf to identify diseases.'}
          </p>
        </div>

        <div className="z-10 flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm self-start md:self-center ml-auto">
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

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* --- LEFT: UPLOAD SECTION --- */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" /> {t.disease?.uploadTitle || 'Upload Image'}
          </h2>

          {/* Added flex-1 to fill space properly */}
          <div className={`relative border-3 border-dashed rounded-2xl flex-1 min-h-[300px] flex flex-col items-center justify-center transition-all group ${preview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400 bg-gray-50 hover:bg-green-50/30'}`}>

            {preview ? (
              <>
                <img src={preview} alt="Upload" className="h-full w-full object-contain rounded-xl p-2 max-h-[400px]" />
                <button
                  onClick={() => { setSelectedImage(null); setPreview(null); setResult(null); }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 text-red-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center cursor-pointer w-full h-full justify-center p-6">
                <div className="p-5 bg-green-100 rounded-full text-green-600 mb-4 group-hover:scale-110 transition-transform shadow-sm">
                  <Upload className="w-8 h-8" />
                </div>
                <p className="font-bold text-gray-700 text-lg">{t.disease?.clickToUpload || 'Click to Upload Image'}</p>
                <p className="text-sm text-gray-500 mt-1">{t.disease?.supports || 'Supports JPG, PNG (Max 5MB)'}</p>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageSelect} />
              </label>
            )}

            {analyzing && (
              <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center backdrop-blur-sm z-20">
                <Loader className="w-12 h-12 text-white animate-spin mb-4" />
                <p className="text-white font-bold text-lg animate-pulse tracking-wide">{t.disease?.analyzing || 'Analyzing Leaf Patterns...'}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!selectedImage || analyzing}
            className={`w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-lg ${!selectedImage || analyzing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-green-200 active:scale-[0.98]'
              }`}
          >
            {analyzing ? (t.disease?.processing || 'Processing...') : (t.disease?.diagnose || 'Diagnose Disease')}
            {!analyzing && <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* --- RIGHT: RESULTS SECTION --- */}
        {/* FIX: Added 'flex flex-col' so children can expand properly */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 h-full flex flex-col">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" /> {t.disease?.report || 'Diagnosis Report'}
          </h2>

          {result ? (
            <div className="animate-slideInRight space-y-6 flex-1">
              {/* Diagnosis Card */}
              <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-1">{t.disease?.detectedIssue || 'Detected Issue'}</p>
                    <h2 className="text-2xl font-extrabold text-gray-900">{result.disease}</h2>
                  </div>
                  <div className="bg-white text-red-600 px-3 py-1 rounded-full text-sm font-bold border border-red-100 shadow-sm">
                    {result.confidence}% {t.disease?.match || 'Match'}
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-white text-gray-700 text-xs font-bold rounded-lg border border-red-100 shadow-sm">
                    {t.disease?.severity || 'Severity'}: <span className="text-red-600">{result.severity}</span>
                  </span>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-red-100">
                  <p className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-orange-500" /> {t.disease?.symptomsDetected || 'Symptoms Detected'}:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-700 ml-1 space-y-1">
                    {result.symptoms.map((sym, i) => <li key={i}>{sym}</li>)}
                  </ul>
                </div>
              </div>

              {/* Treatment Card */}
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                <h3 className="font-bold text-green-900 mb-4 flex items-center gap-2 text-lg">
                  {t.disease?.recommTreatment || 'Recommended Treatment'}
                </h3>

                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-green-100 shadow-sm">
                    <p className="text-xs font-extrabold text-green-600 uppercase mb-2 tracking-wide">{t.disease?.organicSol || 'Organic Solution'}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.treatment.organic}</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                    <p className="text-xs font-extrabold text-blue-600 uppercase mb-2 tracking-wide">{t.disease?.chemicalSol || 'Chemical Solution'}</p>
                    <p className="text-sm text-gray-700 leading-relaxed">{result.treatment.chemical}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* FIX: Changed h-full to flex-1 to fill remaining space properly without overflow */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 min-h-[300px]">
              <div className="bg-white p-5 rounded-full shadow-sm mb-4">
                <Search className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">{t.disease?.noAnalysisYet || 'No Analysis Yet'}</h3>
              <p className="text-gray-400 text-sm max-w-xs mx-auto">
                {t.disease?.uploadPrompt || 'Upload an image and click "Diagnose" to see AI-powered results here.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;