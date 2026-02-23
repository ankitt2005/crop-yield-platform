import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ExternalLink, CheckCircle, AlertCircle, FileText, Calculator, MapPin, Briefcase, ArrowLeft, Languages } from 'lucide-react';
import { translations } from '../data/translations';
import { localizedSchemes } from '../data/localizedSchemes';

function GovernmentSchemes({ language, setLanguage }) {
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState, setSelectedState] = useState('All');
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState(null);

  const categoriesBase = ['All', 'Crop Insurance', 'Subsidy', 'Loan', 'Training', 'Equipment', 'Organic Farming', 'Infrastructure', 'Livestock'];
  const statesBase = ['All', 'Andhra Pradesh', 'Bihar', 'Gujarat', 'Karnataka', 'Maharashtra', 'Odisha', 'Punjab', 'Tamil Nadu', 'Uttar Pradesh', 'West Bengal'];

  const categories = t.schemes?.categories || categoriesBase;
  const states = t.schemes?.states || statesBase;

  const schemes = localizedSchemes[language] || localizedSchemes.en;

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || scheme.category === selectedCategory;
    const matchesState = selectedState === 'All' || scheme.state === 'All' || scheme.state === selectedState;
    return matchesSearch && matchesCategory && matchesState;
  });

  const getSchemeGradient = (category) => {
    switch (category) {
      case 'Crop Insurance':
        return 'from-orange-400 to-red-500';
      case 'Subsidy':
        return 'from-green-400 to-emerald-600';
      case 'Loan':
        return 'from-purple-500 to-indigo-600';
      case 'Training':
        return 'from-blue-400 to-cyan-500';
      case 'Equipment':
        return 'from-yellow-400 to-amber-600';
      case 'Organic Farming':
        return 'from-lime-400 to-green-600';
      case 'Infrastructure':
        return 'from-slate-500 to-gray-700';
      case 'Livestock':
        return 'from-amber-600 to-orange-700';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const EligibilityChecker = ({ scheme }) => {
    const [answers, setAnswers] = useState({
      hasLand: null,
      hasAadhaar: null,
      hasBank: null,
      isWilling: null
    });

    const checkEligibility = () => {
      const allYes = Object.values(answers).every(val => val === true);
      return allYes;
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 animate-scaleIn max-h-[90vh] overflow-y-auto transform transition-all scale-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center">
              <CheckCircle className="w-7 h-7 mr-2 text-green-600" />
              Eligibility Checker
            </h3>
            <button
              onClick={() => setShowEligibilityChecker(false)}
              className="text-gray-400 hover:text-gray-600 text-2xl transition-colors"
            >
              ×
            </button>
          </div>

          <div className={`bg-gradient-to-r ${getSchemeGradient(scheme.category)} p-4 rounded-xl mb-6 text-white shadow-md`}>
            <h4 className="font-bold text-lg mb-1">{scheme.name}</h4>
            <p className="text-sm opacity-90">{scheme.category}</p>
          </div>

          <div className="space-y-4 mb-6">
            {[
              { key: 'hasLand', question: 'Do you have land ownership or lease documents?' },
              { key: 'hasAadhaar', question: 'Do you have a valid Aadhaar Card?' },
              { key: 'hasBank', question: 'Do you have an active bank account?' },
              { key: 'isWilling', question: 'Are you willing to follow scheme guidelines?' },
            ].map((item, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <p className="font-semibold text-gray-800 mb-3">{item.question}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setAnswers({ ...answers, [item.key]: true })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${answers[item.key] === true
                      ? 'bg-green-500 text-white shadow-md transform scale-105'
                      : 'bg-white border-2 border-gray-200 hover:border-green-500 text-gray-600'
                      }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setAnswers({ ...answers, [item.key]: false })}
                    className={`flex-1 py-2 rounded-lg font-semibold transition-all ${answers[item.key] === false
                      ? 'bg-red-500 text-white shadow-md transform scale-105'
                      : 'bg-white border-2 border-gray-200 hover:border-red-500 text-gray-600'
                      }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>

          {Object.values(answers).every(val => val !== null) && (
            <div className={`p-6 rounded-xl border-2 transition-all duration-500 ease-in-out ${checkEligibility() ? 'bg-green-50 border-green-500 shadow-lg shadow-green-100' : 'bg-red-50 border-red-500 shadow-lg shadow-red-100'}`}>
              {checkEligibility() ? (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-green-100 p-3 rounded-full">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-green-800 mb-2">You are Eligible! 🎉</h4>
                  <p className="text-green-700 mb-6">
                    Great news! Based on your answers, you meet the basic requirements for this scheme.
                  </p>

                  <a
                    href={scheme.applicationLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md"
                  >
                    Proceed to Apply <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex justify-center mb-3">
                    <div className="bg-red-100 p-3 rounded-full">
                      <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-red-800 mb-2">Not Eligible Currently</h4>
                  <p className="text-red-700 mb-6">
                    Unfortunately, you need to fulfill all the requirements to be eligible for this scheme.
                  </p>
                  <button
                    onClick={() => setShowEligibilityChecker(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-md"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl p-8 text-white flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Briefcase size={180} />
        </div>
        <button
          onClick={() => navigate('/')}
          className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-sm group"
        >
          <ArrowLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" />
        </button>
        <div className="flex-1 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-4xl font-extrabold mb-2 flex items-center gap-3">
                {t.schemes?.title || 'Government Schemes'}
              </h2>
              <p className="text-blue-100 text-lg opacity-90">{t.schemes?.subtitle || 'Unlock financial support, subsidies, and training opportunities for your farm.'}</p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/20 px-3 py-1.5 rounded-xl border border-white/30 backdrop-blur-sm">
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

              <div className="hidden md:block text-right bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                <p className="text-4xl font-bold">{schemes.length}</p>
                <p className="text-sm text-blue-100 font-medium uppercase tracking-wide">{t.schemes?.activeSchemes || 'Active Schemes'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-4 z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.schemes?.search || "Search schemes..."}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer bg-gray-50 focus:bg-white"
              >
                {categories.map((cat, idx) => (
                  <option key={categoriesBase[idx]} value={categoriesBase[idx]}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* State Filter */}
          <div>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer bg-gray-50 focus:bg-white"
              >
                {states.map((state, idx) => (
                  <option key={statesBase[idx]} value={statesBase[idx]}>{state}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-4">
          <p>{t.schemes?.showing || 'Showing'} <span className="font-bold text-gray-800">{filteredSchemes.length}</span> {t.schemes?.schemesCount || 'scheme(s)'}</p>
          {(searchQuery || selectedCategory !== 'All' || selectedState !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedState('All');
              }}
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline"
            >
              {t.schemes?.clearFilters || 'Clear Filters'}
            </button>
          )}
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredSchemes.map((scheme, index) => (
          <div
            key={scheme.id}
            className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-transparent group flex flex-col h-full"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Scheme Header - Dynamic Gradient */}
            <div className={`bg-gradient-to-r ${getSchemeGradient(scheme.category)} p-5 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 p-2 opacity-10 transform translate-x-4 -translate-y-4">
                <FileText size={100} />
              </div>
              <div className="flex items-start justify-between relative z-10">
                <div className="flex-1 pr-4">
                  <h3 className="text-2xl font-bold mb-3 leading-tight">{scheme.name}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm border border-white/10">
                      {scheme.category}
                    </span>
                    <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      {scheme.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Scheme Content */}
            <div className="p-6 flex-1 flex flex-col space-y-5">
              <p className="text-gray-600 leading-relaxed text-sm">{scheme.description}</p>

              {/* Subsidy Amount */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center justify-between">
                <span className="text-sm text-green-700 font-bold uppercase tracking-wide">{t.schemes?.benefit || 'Benefit'}</span>
                <span className="text-lg font-extrabold text-green-700 text-right">{scheme.subsidy}</span>
              </div>

              {/* Benefits */}
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm uppercase tracking-wide">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  {t.schemes?.keyHighlights || 'Key Highlights'}
                </h4>
                <ul className="space-y-2">
                  {scheme.benefits.slice(0, 3).map((benefit, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Documents Required */}
              <div>
                <h4 className="font-bold text-gray-800 mb-3 flex items-center text-sm uppercase tracking-wide">
                  <FileText className="w-4 h-4 mr-2 text-blue-500" />
                  Required Docs
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scheme.documents.slice(0, 3).map((doc, idx) => (
                    <span key={idx} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200">
                      {doc}
                    </span>
                  ))}
                  {scheme.documents.length > 3 && (
                    <span className="text-xs text-gray-400 self-center">+ {scheme.documents.length - 3} more</span>
                  )}
                </div>
              </div>

              {/* Deadline */}
              <div className="flex items-center text-xs font-medium text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-100 w-fit">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" />
                <span>Deadline: {scheme.deadline}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-2 mt-auto">
                <button
                  onClick={() => {
                    setSelectedScheme(scheme);
                    setShowEligibilityChecker(true);
                  }}
                  className="group relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border-2 border-purple-500 text-purple-600 font-bold hover:bg-purple-50 transition-all overflow-hidden"
                >
                  <Calculator className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Check Eligibility</span>
                </button>

                <a
                  href={scheme.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <ExternalLink className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                  <span className="relative z-10">Apply Now</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
          <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No schemes found</h3>
          <p className="text-gray-500 max-w-md mx-auto">We couldn't find any schemes matching your current filters. Try adjusting your search query or clearing the filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedState('All');
            }}
            className="mt-6 text-blue-600 hover:text-blue-700 font-bold hover:underline"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Eligibility Checker Modal */}
      {showEligibilityChecker && selectedScheme && (
        <EligibilityChecker scheme={selectedScheme} />
      )}
    </div>
  );
}

export default GovernmentSchemes;