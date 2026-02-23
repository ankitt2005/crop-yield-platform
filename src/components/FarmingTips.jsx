import React, { useState, useEffect } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';

function FarmingTips({ language }) {
  const [currentTip, setCurrentTip] = useState(0);

  const tips = {
    en: [
      "Test your soil every 2-3 years to maintain optimal pH levels",
      "Use drip irrigation to save up to 60% water",
      "Rotate crops annually to prevent soil depletion",
      "Monitor weather forecasts for better irrigation planning",
      "Apply organic mulch to retain soil moisture",
      "Plant cover crops during off-season to improve soil health"
    ],
    hi: [
      "इष्टतम pH स्तर बनाए रखने के लिए हर 2-3 साल में अपनी मिट्टी का परीक्षण करें",
      "60% तक पानी बचाने के लिए ड्रिप सिंचाई का उपयोग करें",
      "मिट्टी की कमी को रोकने के लिए फसलों को सालाना बदलें",
      "बेहतर सिंचाई योजना के लिए मौसम पूर्वानुमान की निगरानी करें",
      "मिट्टी की नमी बनाए रखने के लिए जैविक मल्च लगाएं",
      "मिट्टी की सेहत सुधारने के लिए ऑफ-सीजन में कवर फसलें लगाएं"
    ],
    od: [
      "ଉତ୍କୃଷ୍ଟ pH ସ୍ତର ବଜାୟ ରଖିବାକୁ ପ୍ରତି 2-3 ବର୍ଷରେ ଆପଣଙ୍କ ମାଟିର ପରୀକ୍ଷା କରନ୍ତୁ",
      "60% ପର୍ଯ୍ୟନ୍ତ ପାଣି ସଞ୍ଚୟ କରିବାକୁ ଡ୍ରିପ୍ ଜଳସେଚନ ବ୍ୟବହାର କରନ୍ତୁ",
      "ମାଟିର ହ୍ରାସକୁ ରୋକିବା ପାଇଁ ବାର୍ଷିକ ଫସଲ ଘୂର୍ଣ୍ଣନ କରନ୍ତୁ",
      "ଉନ୍ନତ ଜଳସେଚନ ଯୋଜନା ପାଇଁ ପାଣିପାଗ ପୂର୍ବାନୁମାନ ନିରୀକ୍ଷଣ କରନ୍ତୁ",
      "ମାଟିର ଆର୍ଦ୍ରତା ବଜାୟ ରଖିବାକୁ ଜୈବିକ ମଲଚ ପ୍ରୟୋଗ କରନ୍ତୁ",
      "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ଉନ୍ନତ କରିବା ପାଇଁ ଅଫ୍-ସିଜନରେ କଭର ଫସଲ ଲଗାନ୍ତୁ"
    ],
    te: [
      "సరైన pH స్థాయిలను నిర్వహించడానికి ప్రతి 2-3 సంవత్సరాలకు మీ నేలను పరీక్షించండి",
      "60% వరకు నీటిని ఆదా చేయడానికి డ్రిప్ ఇరిగేషన్ ఉపయోగించండి",
      "నేల క్షీణతను నివారించడానికి సంవత్సరానికి పంటలను మార్చండి",
      "మెరుగైన నీటిపారుదల ప్రణాళిక కోసం వాతావరణ అంచనాలను పర్యవేక్షించండి",
      "నేల తేమను నిలుపుకోవడానికి సేంద్రీయ మల్చ్ వర్తించండి",
      "నేల ఆరోగ్యాన్ని మెరుగుపరచడానికి ఆఫ్-సీజన్‌లో కవర్ పంటలు నాటండి"
    ]
  };

  const titles = {
    en: "Quick Farming Tips",
    hi: "त्वरित खेती सुझाव",
    od: "ଶୀଘ୍ର ଚାଷ ଟିପ୍ସ",
    te: "శీఘ్ర వ్యవసాయ చిట్కాలు"
  };

  const currentTips = tips[language] || tips.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % currentTips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentTips.length]);

  const handleNext = () => {
    setCurrentTip((prev) => (prev + 1) % currentTips.length);
  };

  return (
    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden animate-scaleIn">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Lightbulb className="w-5 h-5 animate-pulse" />
            </div>
            <h3 className="text-lg font-bold">{titles[language]}</h3>
          </div>
          <div className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
            {currentTip + 1}/{currentTips.length}
          </div>
        </div>

        <div className="mb-4 min-h-[60px] flex items-center">
          <p className="text-sm leading-relaxed animate-fadeIn" key={currentTip}>
            {currentTips[currentTip]}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            {currentTips.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTip(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentTip 
                    ? 'w-8 bg-white' 
                    : 'w-2 bg-white bg-opacity-40 hover:bg-opacity-60'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition-all duration-200 transform hover:scale-110"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white opacity-20"></div>
    </div>
  );
}

export default FarmingTips;