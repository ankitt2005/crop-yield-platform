import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Search, ShoppingCart, MapPin, ExternalLink, Filter, ArrowLeft, Languages } from 'lucide-react';
import { translations } from '../data/translations';
import { localizedMarket } from '../data/localizedMarket';

const Marketplace = ({ language, setLanguage }) => {
  const t = translations[language] || translations.en;
  const navigate = useNavigate();
  const [category, setCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const getMarketLink = (query) => `https://dir.indiamart.com/search.mp?ss=${query}`;

  const products = localizedMarket[language] || localizedMarket.en;

  const categoriesBase = ['All', 'Grains', 'Vegetables', 'Fruits', 'Cash Crops'];
  const categoriesMap = t.market?.categories || categoriesBase;

  const filteredProducts = products.filter(product => {
    // If search term exists, check across name AND ID (to allow finding product #301 etc)
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category || product.type === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 text-white mb-8 shadow-xl flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ShoppingCart className="w-8 h-8" />
            {t.market?.title || "Farmer's Marketplace"}
          </h1>
          <p className="mt-2 text-orange-100">{t.market?.subtitle || 'Directly connect with buyers and sell your produce at best prices.'}</p>
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t.market?.search || "Search crops, grains, or vegetables..."}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categoriesMap.map((cat, idx) => (
            <button
              key={categoriesBase[idx]}
              onClick={() => setCategory(categoriesBase[idx])}
              className={`px-6 py-2 rounded-full whitespace-nowrap font-medium transition-colors ${category === categoriesBase[idx] ? 'bg-orange-500 text-white' : 'bg-white text-gray-600 hover:bg-orange-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100">
            <div className="relative h-48 overflow-hidden bg-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/400x300/e2e8f0/1e293b?text=${encodeURIComponent(product.name)}`;
                }}
              />
              <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                {product.type || product.category}
              </span>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-gray-800 line-clamp-1" title={product.name}>{product.name}</h3>
                <span className="text-md font-bold text-green-600 whitespace-nowrap">{product.price}</span>
              </div>

              <div className="space-y-1 mb-4">
                <div className="flex items-center text-gray-500 text-sm">
                  <UserIcon className="w-4 h-4 mr-2" />
                  {product.farmer}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="w-4 h-4 mr-2" />
                  {product.location}
                </div>
              </div>

              {/* Redirect Button */}
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-orange-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t.market?.buy || 'Buy Now / Details'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {
        filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-500">No products found</h3>
            <p className="text-gray-400">Try adjusting your search or category.</p>
          </div>
        )
      }
    </div >
  );
};

// Simple User Icon component
const UserIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default Marketplace;