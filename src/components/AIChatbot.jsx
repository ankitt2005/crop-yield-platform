import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Globe } from 'lucide-react';

// --- MULTILINGUAL DATA KNOWLEDGE BASE ---
const chatbotData = {
  en: {
    greeting: "Hello! 👋 I'm your AI farming assistant. I can help with crops, soil, pests, and weather.",
    quickQuestions: ["How to improve soil?", "Best crops for now?", "Pest control tips", "Water management"],
    
    // UPDATED: defaultResponse is now an object with 'options'
    defaultResponse: {
      text: "I'm not sure I understood that. 🤔\nPlease select a topic below:",
      options: ["Crops & Crop", "Soil Health", "Pest Control", "Weather"]
    },
    categories: {
      greetings: {
        keywords: ['hi', 'hello', 'hey', 'morning', 'evening'],
        responses: ["Hello! How can I help you with your farm today?", "Hi there! Ask me anything about agriculture."]
      },
      crops: {
        keywords: ['crop', 'plant', 'grow', 'seed', 'sow', 'rice', 'wheat', 'crop'],
        responses: [
          "For crop selection, consider your soil type and current season. 🌾\n\nPopular choices:\n• Kharif: Rice, Maize, Cotton\n• Rabi: Wheat, Mustard\n\nWhat is your soil type?",
          "To get better crops, always treat seeds before sowing and maintain proper spacing."
        ]
      },
      soil: {
        keywords: ['soil', 'dirt', 'land', 'fertilizer', 'urea', 'npk', 'compost', 'health'],
        responses: [
          "Soil health is key! 🌱\n• Test your soil pH every 2 years.\n• Use organic compost to increase fertility.\n• Don't overuse urea.",
          "For acidic soil, use lime. For alkaline soil, use gypsum. Do you have a soil health card?"
        ]
      },
      pest: {
        keywords: ['pest', 'insect', 'bug', 'worm', 'disease', 'attack', 'kill', 'control'],
        responses: [
          "Pest Control Tips 🐛:\n• Use Neem oil for natural protection.\n• Install pheromone traps.\n• Only use chemicals if the infestation is severe.",
          "Identify the pest first. Is it a sucking pest (like aphids) or a chewing pest (like caterpillars)?"
        ]
      },
      weather: {
        keywords: ['weather', 'rain', 'monsoon', 'sun', 'temperature', 'climate'],
        responses: [
          "Always check the 7-day forecast before applying expensive fertilizers. 🌦️",
          "If heavy rain is predicted, ensure proper drainage in your fields to avoid waterlogging."
        ]
      }
    }
  },
  hi: {
    greeting: "नमस्ते! 👋 मैं आपका एआई किसान सहायक हूं। मैं फसल, मिट्टी, और मौसम में आपकी मदद कर सकता हूं।",
    quickQuestions: ["मिट्टी कैसे सुधारें?", "अभी कौन सी फसल लगाएं?", "कीट नियंत्रण के उपाय", "सिंचाई के तरीके"],
    
    // UPDATED: defaultResponse is now an object with 'options'
    defaultResponse: {
      text: "मुझे वह समझ नहीं आया। 🤔\nकृपया नीचे दिए गए विषयों में से चुनें:",
      options: ["फसल और उपज", "मिट्टी की सेहत", "कीट नियंत्रण", "मौसम"]
    },
    categories: {
      greetings: {
        keywords: ['नमस्ते', 'हैलो', 'हाय', 'नमस्कार', 'प्रणाम'],
        responses: ["नमस्ते! आज मैं आपकी खेती में कैसे मदद कर सकता हूँ?", "नमस्कार! खेती से जुड़ा कोई भी सवाल पूछें।"]
      },
      crops: {
        keywords: ['फसल', 'खेती', 'बीज', 'बोना', 'धान', 'गेहूं', 'crop', 'उपज'],
        responses: [
          "फसल चुनाव के लिए मिट्टी और मौसम का ध्यान रखें। 🌾\n\nप्रमुख फसलें:\n• खरीफ: धान, मक्का, कपास\n• रबी: गेहूं, सरसों\n\nआपकी मिट्टी किस प्रकार की है?",
          "अच्छी फसल के लिए बीज उपचार जरूर करें और कतार में बुवाई करें।"
        ]
      },
      soil: {
        keywords: ['मिट्टी', 'खाद', 'उर्वरक', 'यूरिया', 'खेत', 'soil', 'सेहत'],
        responses: [
          "मिट्टी की सेहत सबसे जरूरी है! 🌱\n• हर 2 साल में मिट्टी की जांच कराएं।\n• गोबर की खाद का प्रयोग करें।\n• यूरिया का संतुलित उपयोग करें.",
          "अगर मिट्टी अम्लीय है तो चूना डालें। क्षारीय है तो जिप्सम का प्रयोग करें।"
        ]
      },
      pest: {
        keywords: ['कीड़ा', 'कीट', 'रोग', 'सुंडी', 'दवा', 'इल्ली', 'pest', 'नियंत्रण'],
        responses: [
          "कीट नियंत्रण के उपाय 🐛:\n• नीम के तेल का छिड़काव करें।\n• फेरोमोन ट्रैप लगाएं।\n• रासायनिक दवा का प्रयोग अंत में ही करें।",
          "कीट की पहचान करें। क्या यह रस चूसने वाला है या पत्ते खाने वाला?"
        ]
      },
      weather: {
        keywords: ['मौसम', 'बारिश', 'वर्षा', 'धूप', 'तापमान', 'weather'],
        responses: [
          "महंगी खाद डालने से पहले 7 दिनों का मौसम पूर्वानुमान जरूर देखें। 🌦️",
          "यदि भारी बारिश की संभावना है, तो खेत में जल निकासी की व्यवस्था करें।"
        ]
      }
    }
  },
  od: {
    greeting: "ନମସ୍କାର! 👋 ମୁଁ ଆପଣଙ୍କର AI କୃଷି ସହଯୋଗୀ | ମୁଁ ଫସଲ, ମାଟି ଏବଂ ପାଣିପାଗ ବିଷୟରେ ସାହାଯ୍ୟ କରିପାରିବି |",
    quickQuestions: ["ମାଟି କିପରି ଉନ୍ନତ ହେବ?", "ବର୍ତ୍ତମାନ କେଉଁ ଫସଲ ଭଲ?", "ପୋକ ନିୟନ୍ତ୍ରଣ", "ଜଳସେଚନ ପଦ୍ଧତି"],
    
    // UPDATED: Specific Odia Options for Clickable Buttons
    defaultResponse: {
      text: "କ୍ଷମା କରିବେ, ମୁଁ ବୁଝିପାରିଲି ନାହିଁ | 🤔\n\nଦୟାକରି ନିମ୍ନଲିଖିତ ବିଷୟଗୁଡ଼ିକ ମଧ୍ୟରୁ ଗୋଟିଏ ବାଛନ୍ତୁ:",
      options: ["ଫସଲ ଏବଂ ଅମଳ", "ମାଟି ସ୍ୱାସ୍ଥ୍ୟ", "ପୋକ ନିୟନ୍ତ୍ରଣ", "ପାଣିପାଗ"]
    },
    categories: {
      greetings: {
        keywords: ['ନମସ୍କାର', 'ଜୁହାର', 'ହେଲୋ', 'ହାଏ'],
        responses: ["ନମସ୍କାର! ଆଜି ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?", "ନମସ୍କାର! ଚାଷ ବିଷୟରେ ଯେକୌଣସି ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ |"]
      },
      crops: {
        keywords: ['ଫସଲ', 'ଚାଷ', 'ମଞ୍ଜି', 'ଧାନ', 'ଗହମ', 'crop', 'ଅମଳ'],
        responses: [
          "ଫସଲ ବାଛିବା ପାଇଁ ମାଟି ଏବଂ ଋତୁକୁ ଧ୍ୟାନ ଦିଅନ୍ତୁ | 🌾\n\nମୁଖ୍ୟ ଫସଲ:\n• ଖରିଫ: ଧାନ, ମକା\n• ରବି: ଗହମ, ସୋରିଷ",
          "ଭଲ ଅମଳ ପାଇଁ ମଞ୍ଜି ବିଶୋଧନ ନିଶ୍ଚିତ କରନ୍ତୁ |"
        ]
      },
      soil: {
        keywords: ['ମାଟି', 'ଖତ', 'ସାର', 'ୟୁରିଆ', 'ଜମି', 'soil', 'ସ୍ୱାସ୍ଥ୍ୟ'],
        responses: [
          "ମାଟିର ସ୍ୱାସ୍ଥ୍ୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ! 🌱\n• ପ୍ରତି ୨ ବର୍ଷରେ ମାଟି ପରୀକ୍ଷା କରନ୍ତୁ |\n• ଗୋବର ଖତ ବ୍ୟବହାର କରନ୍ତୁ |",
          "ଯଦି ମାଟି ଅମ୍ଳୀୟ, ତେବେ ଚୂନ ବ୍ୟବହାର କରନ୍ତୁ |"
        ]
      },
      pest: {
        keywords: ['ପୋକ', 'ରୋଗ', 'କୀଟ', 'ଔଷଧ', 'pest', 'ନିୟନ୍ତ୍ରଣ'],
        responses: [
          "ପୋକ ନିୟନ୍ତ୍ରଣ ଟିପ୍ସ 🐛:\n• ନିମ୍ବ ତେଲ ବ୍ୟବହାର କରନ୍ତୁ |\n• ଫେରୋମୋନ୍ ଟ୍ରାପ୍ ଲଗାନ୍ତୁ |",
          "ପୋକକୁ ଚିହ୍ନଟ କରନ୍ତୁ ଏବଂ ସଠିକ୍ ଔଷଧ ପ୍ରୟୋଗ କରନ୍ତୁ |"
        ]
      },
      weather: {
        keywords: ['ପାଣିପାଗ', 'ବର୍ଷା', 'ଖରା', 'weather'],
        responses: [
          "ସାର ପ୍ରୟୋଗ ପୂର୍ବରୁ ପାଣିପାଗ ରିପୋର୍ଟ ଦେଖନ୍ତୁ | 🌦️",
          "ଅଧିକ ବର୍ଷା ହେଲେ ଜମିରୁ ପାଣି ବାହାର କରିବାର ବ୍ୟବସ୍ଥା କରନ୍ତୁ |"
        ]
      }
    }
  },
  te: {
    greeting: "నమస్కారం! 👋 నేను మీ AI వ్యవసాయ సహాయకుడిని. పంటలు, నేల మరియు తెగుళ్ల గురించి నేను మీకు సహాయం చేయగలను.",
    quickQuestions: ["నేల ఆరోగ్యాన్ని ఎలా పెంచాలి?", "ఇప్పుడు ఏ పంట వేయాలి?", "తెగులు నివారణ", "నీటి పారుదల"],
    
    // UPDATED: defaultResponse is now an object with 'options'
    defaultResponse: {
      text: "క్షమించండి, నాకు అర్థం కాలేదు. 🤔\nదయచేసి క్రింది వాటిలో ఒకదానిని ఎంచుకోండి:",
      options: ["పంటలు & దిగుబడి", "నేల ఆరోగ్యం", "తెగులు నియంత్రణ", "వాతావరణం"]
    },
    categories: {
      greetings: {
        keywords: ['నమస్కారం', 'హలో', 'హాయ్', 'శుభోదయం'],
        responses: ["నమస్కారం! ఈ రోజు నేను మీకు ఎలా సహాయం చేయగలను?", "హాయ్! వ్యవసాయం గురించి ఏదైనా అడగండి."]
      },
      crops: {
        keywords: ['పంట', 'వ్యవసాయం', 'విత్తనాలు', 'వరి', 'crop', 'దిగుబడి'],
        responses: [
          "పంట ఎంపిక కోసం మీ నేల రకం మరియు సీజన్‌ను గమనించండి. 🌾\n\nముఖ్యమైన పంటలు:\n• ఖరీఫ్: వరి, మొక్కజొన్న\n• రబీ: వేరుశెనగ, మిరప",
          "మంచి దిగుబడి కోసం విత్తన శుద్ధి తప్పనిసరిగా చేయండి."
        ]
      },
      soil: {
        keywords: ['నేల', 'మట్టి', 'ఎరువులు', 'యూరియా', 'soil', 'ఆరోగ్యం'],
        responses: [
          "నేల ఆరోగ్యం ముఖ్యం! 🌱\n• ప్రతి 2 సంవత్సరాలకు ఒకసారి మట్టిని పరీక్షించండి.\n• పశువుల ఎరువును వాడండి.",
          "నేల సారాన్ని పెంచడానికి పచ్చి రొట్ట ఎరువులు వాడండి."
        ]
      },
      pest: {
        keywords: ['తెగులు', 'పురుగు', 'క్రిమి', 'మందు', 'pest', 'నియంత్రణ'],
        responses: [
          "తెగులు నివారణ చిట్కాలు 🐛:\n• వేప నూనెను పిచికారీ చేయండి.\n• లింగాకర్షక బుట్టలను అమర్చండి.",
          "ముందుగా తెగులును గుర్తించి, సరైన మందును వాడండి."
        ]
      },
      weather: {
        keywords: ['వాతావరణం', 'వర్షం', 'ఎండ', 'weather'],
        responses: [
          "ఎరువులు వేసే ముందు వాతావరణ నివేదికను చూడండి. 🌦️",
          "భారీ వర్షాలు కురిసే అవకాశం ఉంటే, పొలంలో నీరు నిల్వ ఉండకుండా చూడండి."
        ]
      }
    }
  }
};

function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState('en'); // Default language state
  
  // Initialize with English greeting
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      text: chatbotData['en'].greeting,
      timestamp: new Date()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  // Handle Language Change
  const handleLangChange = (e) => {
    const newLang = e.target.value;
    setLang(newLang);
    // Add a system message indicating language switch
    setMessages(prev => [...prev, {
      type: 'bot',
      text: chatbotData[newLang].greeting,
      timestamp: new Date()
    }]);
  };

  // UPDATED: Logic to handle Text + Options
  const getAIResponse = (userMessage) => {
    const currentData = chatbotData[lang];
    const messageLower = userMessage.toLowerCase();

    // 1. Check Categories
    for (const [category, data] of Object.entries(currentData.categories)) {
      for (const keyword of data.keywords) {
        if (messageLower.includes(keyword)) {
          // Found a match! Return object with empty options
          return {
            text: data.responses[Math.floor(Math.random() * data.responses.length)],
            options: [] 
          };
        }
      }
    }

    // 2. Default Fallback (Now includes options)
    // Safely check if it's already an object (which it is now in our data)
    if (typeof currentData.defaultResponse === 'object') {
        return currentData.defaultResponse;
    }
    // Fallback for safety
    return { text: currentData.defaultResponse, options: [] };
  };

  // UPDATED: Handle sending message (supports clickable text override)
  const handleSendMessage = (textOverride = null) => {
    const textToSend = textOverride || inputMessage;
    if (!textToSend.trim()) return;

    const userMessage = {
      type: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const responseObj = getAIResponse(textToSend); // Now returns an object
      
      const botResponse = {
        type: 'bot',
        text: responseObj.text,
        options: responseObj.options, // Store options in the message
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500);
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50 animate-bounce"
        >
          <MessageCircle className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-scaleIn overflow-hidden border border-gray-100">
          
          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></span>
              </div>
              <div>
                <h3 className="font-bold text-sm">Krishi Assistant</h3>
                <div className="flex items-center text-xs text-green-100 opacity-90">
                  <span className="w-1.5 h-1.5 bg-green-300 rounded-full mr-1.5 animate-pulse"></span>
                  Online
                </div>
              </div>
            </div>

            {/* Language Selector in Header */}
            <div className="flex items-center gap-2">
                <div className="relative">
                    <Globe className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-green-700 pointer-events-none" />
                    <select 
                        value={lang}
                        onChange={handleLangChange}
                        className="bg-white/90 text-green-800 text-xs py-1.5 pl-7 pr-2 rounded-lg font-medium focus:outline-none cursor-pointer hover:bg-white transition-colors appearance-none"
                    >
                        <option value="en">Eng</option>
                        <option value="hi">हिंदी</option>
                        <option value="od">ଓଡିଆ</option>
                        <option value="te">తెలుగు</option>
                    </select>
                </div>
                <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                >
                <X className="w-5 h-5" />
                </button>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex flex-col max-w-[85%] ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
                  
                  {/* Avatar + Message Bubble Wrapper */}
                  <div className={`flex ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-start space-x-2`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-green-600' 
                          : 'bg-gradient-to-br from-blue-500 to-purple-500'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-5 h-5 text-white" />
                        ) : (
                          <Bot className="w-5 h-5 text-white" />
                        )}
                      </div>

                      <div>
                        <div className={`rounded-2xl p-3 shadow-sm ${
                          message.type === 'user'
                            ? 'bg-green-600 text-white rounded-tr-none'
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                          <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                  </div>

                  {/* UPDATED: Render Clickable Options (Chips) if they exist */}
                  {message.options && message.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 ml-10">
                      {message.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(option)} // Send the text on click
                          className="bg-green-100 hover:bg-green-200 text-green-800 text-xs px-3 py-2 rounded-lg border border-green-200 transition-colors shadow-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                  <p className={`text-[10px] text-gray-400 mt-1 px-1 w-full ${message.type === 'user' ? 'text-right' : 'text-left ml-10'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>

                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100">
                    <div className="flex space-x-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* QUICK QUESTIONS (Dynamic based on Lang) */}
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center">
              <Sparkles className="w-3 h-3 mr-1 text-yellow-500" />
              Suggested
            </p>
            <div className="flex flex-wrap gap-2">
              {chatbotData[lang].quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMessage(question);
                    // Slight delay to allow state update before send
                    setTimeout(() => document.getElementById('chat-input-btn').click(), 100);
                  }}
                  className="text-xs bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT AREA */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={lang === 'en' ? "Ask me anything..." : "कुछ भी पूछें..."}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:bg-white transition-all text-sm"
              />
              <button
                id="chat-input-btn"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim()}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white p-3 rounded-xl transition-all shadow-md transform hover:scale-105 active:scale-95 disabled:scale-100 disabled:shadow-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatbot;