export const localizedIrrigation = {
    en: {
        wheat: {
            name: 'Wheat',
            waterNeedPerAcre: 350000,
            idealMoistureRange: '50-65%',
            frequencyDays: 18,
            schedule: [
                { stage: 'Crown Root Initiation (Weeks 1-3)', action: 'Critical watering needed. Keep soil moist.' },
                { stage: 'Tillering (Weeks 4-6)', action: 'Moderate watering. Allow slight drying between intervals.' },
                { stage: 'Jointing & Flowering (Weeks 7-10)', action: 'High water demand zone. Ensure deep irrigation.' },
                { stage: 'Grain Filling (Weeks 11-14)', action: 'Reduce watering frequency as harvest approaches.' }
            ]
        },
        rice: {
            name: 'Rice (Paddy)',
            waterNeedPerAcre: 1200000,
            idealMoistureRange: '85-100% (Flooded)',
            frequencyDays: 3,
            schedule: [
                { stage: 'Transplanting (Week 1)', action: 'Maintain standing water (2-3 cm).' },
                { stage: 'Vegetative Stage (Weeks 2-6)', action: 'Keep field flooded. High water demand.' },
                { stage: 'Reproductive Stage (Weeks 7-10)', action: 'Critical stage. Ensure sufficient water level.' },
                { stage: 'Ripening (Weeks 11+)', action: 'Drain water completely 10 days before harvest.' }
            ]
        },
        corn: {
            name: 'Corn (Maize)',
            waterNeedPerAcre: 500000,
            idealMoistureRange: '60-75%',
            frequencyDays: 10,
            schedule: [
                { stage: 'Germination (Weeks 1-2)', action: 'Light watering to establish roots.' },
                { stage: 'Vegetative Growth (Weeks 3-6)', action: 'Increase volume. Consistent moisture needed.' },
                { stage: 'Tasseling & Silking (Weeks 7-9)', action: 'PEAK demand. Water stress now reduces crop significantly.' },
                { stage: 'Grain Fill (Weeks 10-12)', action: 'Moderate watering until maturity.' }
            ]
        },
        sugarcane: {
            name: 'Sugarcane',
            waterNeedPerAcre: 1500000,
            idealMoistureRange: '70-85%',
            frequencyDays: 7,
            schedule: [
                { stage: 'Germination (Month 1)', action: 'Frequent light irrigation.' },
                { stage: 'Tillering (Months 2-4)', action: 'Frequent and heavy watering to support shoot growth.' },
                { stage: 'Grand Growth (Months 5-9)', action: 'Maximum water needed. Long intervals not recommended.' },
                { stage: 'Maturation (Month 10+)', action: 'Reduce water gradually to increase sugar content.' }
            ]
        },
        cotton: {
            name: 'Cotton',
            waterNeedPerAcre: 600000,
            idealMoistureRange: '55-70%',
            frequencyDays: 14,
            schedule: [
                { stage: 'Seedling (Weeks 1-3)', action: 'Moderate watering for root setup.' },
                { stage: 'Vegetative (Weeks 4-7)', action: 'Avoid overwatering to prevent excessive stalk growth.' },
                { stage: 'Flowering & Boll Formation (Weeks 8-13)', action: 'CRITICAL stage. Consistent moisture needed.' },
                { stage: 'Boll Opening (Weeks 14+)', action: 'Stop irrigation to allow bolls to open and dry.' }
            ]
        },
        tomato: {
            name: 'Tomato',
            waterNeedPerAcre: 400000,
            idealMoistureRange: '65-80%',
            frequencyDays: 5,
            schedule: [
                { stage: 'Transplanting (Weeks 1-2)', action: 'Daily light watering.' },
                { stage: 'Growth (Weeks 3-5)', action: 'Deep watering 2-3 times a week. Avoid wetting leaves.' },
                { stage: 'Flowering & Fruiting (Weeks 6-10)', action: 'Consistent moisture is key to prevent blossom rot.' },
                { stage: 'Harvest (Weeks 11+)', action: 'Reduce watering slightly to intensify flavor.' }
            ]
        },
        potato: {
            name: 'Potato',
            waterNeedPerAcre: 450000,
            idealMoistureRange: '70-85%',
            frequencyDays: 6,
            schedule: [
                { stage: 'Sprouting (Weeks 1-3)', action: 'Keep soil moist but not soggy.' },
                { stage: 'Tuber Initiation (Weeks 4-6)', action: 'Critical period. Consistent supply needed.' },
                { stage: 'Tuber Bulking (Weeks 7-12)', action: 'Highest demand. Irregular watering causes cracked tubers.' },
                { stage: 'Maturation (Weeks 13+)', action: 'Stop watering when vines die back.' }
            ]
        }
    },
    hi: {
        wheat: {
            name: 'गेहूँ',
            waterNeedPerAcre: 350000,
            idealMoistureRange: '50-65%',
            frequencyDays: 18,
            schedule: [
                { stage: 'मुकुट जड़ प्रारंभ (सप्ताह 1-3)', action: 'महत्वपूर्ण सिंचाई आवश्यक। मिट्टी नम रखें।' },
                { stage: 'कल्ले निकलना (सप्ताह 4-6)', action: 'मध्यम सिंचाई। अंतरालों के बीच हल्का सूखने दें।' },
                { stage: 'गांठ बनना और फूल आना (सप्ताह 7-10)', action: 'उच्च जल मांग क्षेत्र। गहरी सिंचाई सुनिश्चित करें।' },
                { stage: 'दाना भरना (सप्ताह 11-14)', action: 'कटाई पास आने पर सिंचाई की आवृत्ति कम करें।' }
            ]
        },
        rice: {
            name: 'धान (चावल)',
            waterNeedPerAcre: 1200000,
            idealMoistureRange: '85-100% (बाढ़ ग्रस्त)',
            frequencyDays: 3,
            schedule: [
                { stage: 'रोपाई (सप्ताह 1)', action: 'खड़ा पानी (2-3 सेमी) बनाए रखें।' },
                { stage: 'वानस्पतिक अवस्था (सप्ताह 2-6)', action: 'खेत में पानी भरा रखें। उच्च जल मांग।' },
                { stage: 'प्रजनन अवस्था (सप्ताह 7-10)', action: 'महत्वपूर्ण अवस्था। पर्याप्त जल स्तर सुनिश्चित करें।' },
                { stage: 'पकना (सप्ताह 11+)', action: 'कटाई से 10 दिन पहले पानी पूरी तरह निकाल दें।' }
            ]
        },
        corn: {
            name: 'मक्का',
            waterNeedPerAcre: 500000,
            idealMoistureRange: '60-75%',
            frequencyDays: 10,
            schedule: [
                { stage: 'अंकुरण (सप्ताह 1-2)', action: 'जड़ों को स्थापित करने के लिए हल्की सिंचाई।' },
                { stage: 'वानस्पतिक वृद्धि (सप्ताह 3-6)', action: 'मात्रा बढ़ाएं। निरंतर नमी की आवश्यकता।' },
                { stage: 'मंजरी और रेशम निकलना (सप्ताह 7-9)', action: 'पीक मांग। जल तनाव से फसल काफी कम हो जाती है।' },
                { stage: 'दाना भरना (सप्ताह 10-12)', action: 'परिपक्वता तक मध्यम सिंचाई।' }
            ]
        },
        sugarcane: {
            name: 'गन्ना',
            waterNeedPerAcre: 1500000,
            idealMoistureRange: '70-85%',
            frequencyDays: 7,
            schedule: [
                { stage: 'अंकुरण (महीना 1)', action: 'लगातार हल्की सिंचाई।' },
                { stage: 'कल्ले निकलना (महीने 2-4)', action: 'प्ररोह वृद्धि के लिए लगातार और भारी सिंचाई।' },
                { stage: 'भव्य वृद्धि (महीने 5-9)', action: 'अधिकतम जल आवश्यक। लंबे अंतराल की सिफारिश नहीं की जाती है।' },
                { stage: 'परिपक्वता (महीना 10+)', action: 'चीनी की मात्रा बढ़ाने के लिए पानी धीरे-धीरे कम करें।' }
            ]
        },
        cotton: {
            name: 'कपास',
            waterNeedPerAcre: 600000,
            idealMoistureRange: '55-70%',
            frequencyDays: 14,
            schedule: [
                { stage: 'पौधा (सप्ताह 1-3)', action: 'जड़ स्थापना के लिए मध्यम सिंचाई।' },
                { stage: 'वानस्पतिक (सप्ताह 4-7)', action: 'अत्यधिक डंठल वृद्धि को रोकने के लिए अधिक सिंचाई से बचें।' },
                { stage: 'फूल और डोडे बनना (सप्ताह 8-13)', action: 'महत्वपूर्ण अवस्था। निरंतर नमी आवश्यक।' },
                { stage: 'डोडे खुलना (सप्ताह 14+)', action: 'डोडों को खुलने और सूखने देने के लिए सिंचाई रोक दें।' }
            ]
        },
        tomato: {
            name: 'टमाटर',
            waterNeedPerAcre: 400000,
            idealMoistureRange: '65-80%',
            frequencyDays: 5,
            schedule: [
                { stage: 'रोपाई (सप्ताह 1-2)', action: 'दैनिक हल्की सिंचाई।' },
                { stage: 'वृद्धि (सप्ताह 3-5)', action: 'सप्ताह में 2-3 बार गहरी सिंचाई। पत्तियों को गीला करने से बचें।' },
                { stage: 'फूल और फल लगना (सप्ताह 6-10)', action: 'ब्लॉसम रॉट को रोकने के लिए निरंतर नमी आवश्यक है।' },
                { stage: 'कटाई (सप्ताह 11+)', action: 'स्वाद बढ़ाने के लिए पानी थोड़ा कम करें।' }
            ]
        },
        potato: {
            name: 'आलू',
            waterNeedPerAcre: 450000,
            idealMoistureRange: '70-85%',
            frequencyDays: 6,
            schedule: [
                { stage: 'अंकुरण (सप्ताह 1-3)', action: 'मिट्टी को नम रखें लेकिन गीला नहीं।' },
                { stage: 'कंद दीक्षा (सप्ताह 4-6)', action: 'महत्वपूर्ण अवधि। निरंतर आपूर्ति की आवश्यकता।' },
                { stage: 'कंद का बड़ा होना (सप्ताह 7-12)', action: 'उच्चतम मांग। अनियमित सिंचाई से कंद फटने लगते हैं।' },
                { stage: 'परिपक्वता (सप्ताह 13+)', action: 'बेलों के मरने पर सिंचाई बंद कर दें।' }
            ]
        }
    },
    od: {
        wheat: {
            name: 'ଗହମ',
            waterNeedPerAcre: 350000,
            idealMoistureRange: '50-65%',
            frequencyDays: 18,
            schedule: [
                { stage: 'ମୂଳ ବିକାଶ ଆରମ୍ଭ (ସପ୍ତାହ ୧-୩)', action: 'ମହତ୍ତ୍ୱପୂର୍ଣ୍ଣ ଜଳସେଚନ ଆବଶ୍ୟକ। ମାଟିକୁ ଓଦା ରଖନ୍ତୁ।' },
                { stage: 'ଟିଲରିଂ (ସପ୍ତାହ ୪-୬)', action: 'ମଧ୍ୟମ ଜଳସେଚନ। ବ୍ୟବଧାନ ମଧ୍ୟରେ ସାମାନ୍ୟ ଶୁଖିବାକୁ ଦିଅନ୍ତୁ।' },
                { stage: 'ଗଣ୍ଠି ଏବଂ ଫୁଲ ଆସିବା (ସପ୍ତାହ ୭-୧୦)', action: 'ଉଚ୍ଚ ଜଳ ଚାହିଦା ଅଞ୍ଚଳ। ଗଭୀର ଜଳସେଚନ ସୁନିଶ୍ଚିତ କରନ୍ତୁ।' },
                { stage: 'ଦାନା ପୂରଣ (ସପ୍ତାହ ୧୧-୧୪)', action: 'ଅମଳ ନିକଟତର ହେବା ସହିତ ଜଳସେଚନ ଆବୃତ୍ତି କମାନ୍ତୁ।' }
            ]
        },
        rice: {
            name: 'ଧାନ',
            waterNeedPerAcre: 1200000,
            idealMoistureRange: '85-100% (ପାଣି ଭର୍ତ୍ତି)',
            frequencyDays: 3,
            schedule: [
                { stage: 'ରୋଇବା (ସପ୍ତାହ ୧)', action: 'ଜମିରେ ପାଣି ରଖନ୍ତୁ (୨-୩ ସେମି)।' },
                { stage: 'ଅଙ୍ଗୀୟ ଅବସ୍ଥା (ସପ୍ତାହ ୨-୬)', action: 'ବିଲରେ ପାଣି ଭର୍ତ୍ତି କରି ରଖନ୍ତୁ। ଉଚ୍ଚ ଜଳ ଚାହିଦା।' },
                { stage: 'ପ୍ରଜନନ ଅବସ୍ଥା (ସପ୍ତାହ ୭-୧୦)', action: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅବସ୍ଥା। ପର୍ଯ୍ୟାପ୍ତ ଜଳ ସ୍ତର ସୁନିଶ୍ଚିତ କରନ୍ତୁ।' },
                { stage: 'ପାଚିବା (ସପ୍ତାହ ୧୧+)', action: 'ଅମଳର ୧୦ ଦିନ ପୂର୍ବରୁ ପାଣି ସମ୍ପୂର୍ଣ୍ଣ ନିଷ୍କାସନ କରନ୍ତୁ।' }
            ]
        },
        corn: {
            name: 'ମକା',
            waterNeedPerAcre: 500000,
            idealMoistureRange: '60-75%',
            frequencyDays: 10,
            schedule: [
                { stage: 'ଅଙ୍କୁରୋଦ୍ଗମ (ସପ୍ତାହ ୧-୨)', action: 'ଚେର ସ୍ଥାପନ କରିବାକୁ ହାଲୁକା ଜଳସେଚନ।' },
                { stage: 'ଅଙ୍ଗୀୟ ବୃଦ୍ଧି (ସପ୍ତାହ ୩-୬)', action: 'ପରିମାଣ ବୃଦ୍ଧି କରନ୍ତୁ। କ୍ରମାଗତ ଓଦାଳିଆ ଆବଶ୍ୟକ।' },
                { stage: 'ଟାସେଲିଂ ଏବଂ ସିଲ୍କିଂ (ସପ୍ତାହ ୭-୯)', action: 'ସର୍ବାଧିକ ଚାହିଦା। ବର୍ତ୍ତମାନ ଜଳ ଚାପ ଫସଲକୁ ଯଥେଷ୍ଟ କମାଇଥାଏ।' },
                { stage: 'ଦାନା ପୂରଣ (ସପ୍ତାହ ୧୦-୧୨)', action: 'ପରିପକ୍ୱତା ପର୍ଯ୍ୟନ୍ତ ମଧ୍ୟମ ଜଳସେଚନ।' }
            ]
        },
        sugarcane: {
            name: 'ଆଖୁ',
            waterNeedPerAcre: 1500000,
            idealMoistureRange: '70-85%',
            frequencyDays: 7,
            schedule: [
                { stage: 'ଅଙ୍କୁରୋଦ୍ଗମ (ମାସ ୧)', action: 'ବାରମ୍ବାର ହାଲୁକା ଜଳସେଚନ।' },
                { stage: 'ଟିଲରିଂ (ମାସ ୨-୪)', action: 'ପିକା ବୃଦ୍ଧିକୁ ସମର୍ଥନ କରିବା ପାଇଁ ବାରମ୍ବାର ଏବଂ ପ୍ରଚୁର ଜଳସେଚନ।' },
                { stage: 'ଦ୍ରୁତ ବୃଦ୍ଧି (ମାସ ୫-୯)', action: 'ସର୍ବାଧିକ ଜଳ ଆବଶ୍ୟକ। ଦୀର୍ଘ ବ୍ୟବଧାନ ସୁପାରିଶ କରାଯାଏ ନାହିଁ।' },
                { stage: 'ପରିପକ୍ୱତା (ମାସ ୧୦+)', action: 'ଚିନିର ପରିମାଣ ବଢାଇବାକୁ ଧୀରେ ଧୀରେ ଜଳ କମାନ୍ତୁ।' }
            ]
        },
        cotton: {
            name: 'କପା',
            waterNeedPerAcre: 600000,
            idealMoistureRange: '55-70%',
            frequencyDays: 14,
            schedule: [
                { stage: 'ଗଛ (ସପ୍ତାହ ୧-୩)', action: 'ଚେର ସେଟିଂ ପାଇଁ ମଧ୍ୟମ ଜଳସେଚନ।' },
                { stage: 'ଅଙ୍ଗୀୟ (ସପ୍ତାହ ୪-୭)', action: 'ଡାଙ୍ଗର ଅତ୍ୟଧିକ ବୃଦ୍ଧି ରୋକିବା ପାଇଁ ଅଧିକ ଜଳସେଚନରୁ ନିବୃତ୍ତ ହୁଅନ୍ତୁ।' },
                { stage: 'ଫୁଲ ଏବଂ ଫଳ ଗଠନ (ସପ୍ତାହ ୮-୧୩)', action: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅବସ୍ଥା। କ୍ରମାଗତ ଓଦାଳିଆ ଆବଶ୍ୟକ।' },
                { stage: 'ଫଳ ଖୋଲିବା (ସପ୍ତାହ ୧୪+)', action: 'ଫଳକୁ ଖୋଲିବା ଏବଂ ଶୁଖିବାକୁ ଅନୁମତି ଦେବା ପାଇଁ ଜଳସେଚନ ବନ୍ଦ କରନ୍ତୁ।' }
            ]
        },
        tomato: {
            name: 'ଟମାଟୋ',
            waterNeedPerAcre: 400000,
            idealMoistureRange: '65-80%',
            frequencyDays: 5,
            schedule: [
                { stage: 'ରୋଇବା (ସପ୍ତାହ ୧-୨)', action: 'ପ୍ରତିଦିନ ହାଲୁକା ଜଳସେଚନ।' },
                { stage: 'ବୃଦ୍ଧି (ସପ୍ତାହ ୩-୫)', action: 'ସପ୍ତାହକୁ ୨-୩ ଥର ଗଭୀର ଜଳସେଚନ। ପତ୍ର ଓଦା କରିବାରୁ ନିବୃତ୍ତ ରୁହନ୍ତୁ।' },
                { stage: 'ଫୁଲ ଏବଂ ଫଳ ଆସିବା (ସପ୍ତାହ ୬-୧୦)', action: 'ପଚା ରୋଗ ରୋକିବା ପାଇଁ କ୍ରମାଗତ ଓଦାଳିଆ ପ୍ରମୁଖ ଅଟେ।' },
                { stage: 'ଅମଳ (ସପ୍ତାହ ୧୧+)', action: 'ସ୍ୱାଦ ବଢାଇବା ପାଇଁ ଜଳସେଚନ ସାମାନ୍ୟ କମାନ୍ତୁ।' }
            ]
        },
        potato: {
            name: 'ଆଳୁ',
            waterNeedPerAcre: 450000,
            idealMoistureRange: '70-85%',
            frequencyDays: 6,
            schedule: [
                { stage: 'ଅଙ୍କୁରୋଦ୍ଗମ (ସପ୍ତାହ ୧-୩)', action: 'ମାଟିକୁ ଓଦା ରଖନ୍ତୁ କିନ୍ତୁ ଅଧିକ ପାଣି ନୁହେଁ।' },
                { stage: 'ଆଳୁ ସୃଷ୍ଟି (ସପ୍ତାହ ୪-୬)', action: 'ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସମୟ। କ୍ରମାଗତ ଯୋଗାଣ ଆବଶ୍ୟକ।' },
                { stage: 'ଆଳୁ ବୃଦ୍ଧି (ସପ୍ତାହ ୭-୧୨)', action: 'ସର୍ବୋଚ୍ଚ ଚାହିଦା। ଅନିୟମିତ ଜଳସେଚନ ଆଳୁ ଫାଟିବାର କାରଣ ହୁଏ।' },
                { stage: 'ପରିପକ୍ୱତା (ସପ୍ତାହ ୧୩+)', action: 'ଗଛ ମରିଯିବା ପରେ ଜଳସେଚନ ବନ୍ଦ କରନ୍ତୁ।' }
            ]
        }
    },
    te: {
        wheat: {
            name: 'గోధుమలు',
            waterNeedPerAcre: 350000,
            idealMoistureRange: '50-65%',
            frequencyDays: 18,
            schedule: [
                { stage: 'మకుట వేరు ప్రారంభం (వారాలు 1-3)', action: 'క్లిష్టమైన నీరు అవసరం. నేలను తేమగా ఉంచండి.' },
                { stage: 'పిలకలు ఏర్పడటం (వారాలు 4-6)', action: 'మితమైన నీరు. వ్యవధుల మధ్య కొద్దిగా ఎండబెట్టడానికి అనుమతించండి.' },
                { stage: 'కణుపులు & పూత (వారాలు 7-10)', action: 'అధిక నీటి డిమాండ్ జోన్. లోతైన నీటిపారుదలని నిర్ధారించుకోండి.' },
                { stage: 'గింజ నిండటం (వారాలు 11-14)', action: 'కోత దగ్గరపడుతున్న కొద్దీ నీటిపారుదల ఫ్రీక్వెన్సీని తగ్గించండి.' }
            ]
        },
        rice: {
            name: 'వరి (ధాన్యం)',
            waterNeedPerAcre: 1200000,
            idealMoistureRange: '85-100% (ముంపు)',
            frequencyDays: 3,
            schedule: [
                { stage: 'నాట్లు (వారం 1)', action: 'నిల్వ ఉన్న నీటిని నిర్వహించండి (2-3 సెం.మీ).' },
                { stage: 'శాకీయ దశ (వారాలు 2-6)', action: 'పొలంలో నీరు నిల్వ ఉంచండి. అధిక నీటి డిమాండ్.' },
                { stage: 'ప్రత్యుత్పత్తి దశ (వారాలు 7-10)', action: 'కీలక దశ. తగినంత నీటి స్థాయిని నిర్ధారించుకోండి.' },
                { stage: 'పక్వానికి రావడం (వారాలు 11+)', action: 'కోతకు 10 రోజుల ముందు నీటిని పూర్తిగా తీసివేయండి.' }
            ]
        },
        corn: {
            name: 'మొక్కజొన్న',
            waterNeedPerAcre: 500000,
            idealMoistureRange: '60-75%',
            frequencyDays: 10,
            schedule: [
                { stage: 'మొలకల (వారాలు 1-2)', action: 'వేర్లను స్థాపించడానికి తేలికపాటి నీరు.' },
                { stage: 'శాకీయ పెరుగుదల (వారాలు 3-6)', action: 'పరిమాణాన్ని పెంచండి. స్థిరమైన తేమ అవసరం.' },
                { stage: 'టస్సెలింగ్ & సిల్కింగ్ (వారాలు 7-9)', action: 'పీక్ డిమాండ్. నీటి ఒత్తిడి ఇప్పుడు దిగుబడిని గణనీయంగా తగ్గిస్తుంది.' },
                { stage: 'గింజ నిండటం (వారాలు 10-12)', action: 'పరిణితి వరకు మితమైన నీరుపారుదల.' }
            ]
        },
        sugarcane: {
            name: 'చెరకు',
            waterNeedPerAcre: 1500000,
            idealMoistureRange: '70-85%',
            frequencyDays: 7,
            schedule: [
                { stage: 'మొలక (నెల 1)', action: 'తరచుగా తేలికపాటి నీటిపారుదల.' },
                { stage: 'పిలకలు ఏర్పడటం (నెలలు 2-4)', action: 'రెమ్మల పెరుగుదలకు మద్దతుగా తరచుగా మరియు భారీ నీటి పారుదల.' },
                { stage: 'అధిక పెరుగుదల (నెలలు 5-9)', action: 'గరిష్ట నీరు అవసరం. సుదీర్ఘ వ్యవధి సిఫార్సు చేయబడదు.' },
                { stage: 'పరిణితి (నెల 10+)', action: 'చక్కెర కంటెంట్ పెంచడానికి నీటిని క్రమంగా తగ్గించండి.' }
            ]
        },
        cotton: {
            name: 'పత్తి',
            waterNeedPerAcre: 600000,
            idealMoistureRange: '55-70%',
            frequencyDays: 14,
            schedule: [
                { stage: 'మొలక (వారాలు 1-3)', action: 'వేరు వ్యవస్థ స్థాపనకు మితమైన నీరు.' },
                { stage: 'శాకీయ దశ (వారాలు 4-7)', action: 'అధిక కాండం పెరుగుదలను నివారించడానికి అధిక నీరు పెట్టడం నివారించండి.' },
                { stage: 'పూత &కాయ ఏర్పడటం (వారాలు 8-13)', action: 'కీలక దశ. స్థిరమైన తేమ అవసరం.' },
                { stage: 'కాయ పగలడం (వారాలు 14+)', action: 'కాయలు తెరుచుకుని గాలికి ఎండడానికి నీటిపారుదలని ఆపండి.' }
            ]
        },
        tomato: {
            name: 'టమోటా',
            waterNeedPerAcre: 400000,
            idealMoistureRange: '65-80%',
            frequencyDays: 5,
            schedule: [
                { stage: 'నాట్లు (వారాలు 1-2)', action: 'రోజువారీ తేలికపాటి నీరు.' },
                { stage: 'పెరుగుదల (వారాలు 3-5)', action: 'వారానికి 2-3 సార్లు లోతైన నీటిపారుదల. ఆకులు తడవకుండా ఉండండి.' },
                { stage: 'పూత & కాయ (వారాలు 6-10)', action: 'కుళ్లును నివారించడానికి స్థిరమైన తేమ కీలకం.' },
                { stage: 'కోత (వారాలు 11+)', action: 'రుచిని పెంచడానికి నీటిని కొద్దిగా తగ్గించండి.' }
            ]
        },
        potato: {
            name: 'బంగాళాదుంప',
            waterNeedPerAcre: 450000,
            idealMoistureRange: '70-85%',
            frequencyDays: 6,
            schedule: [
                { stage: 'మొలక (వారాలు 1-3)', action: 'నేలను తేమగా ఉంచండి కానీ బురదగా వద్దు.' },
                { stage: 'దుంపలు ప్రారంభం (వారాలు 4-6)', action: 'కీలక సమయం. స్థిరమైన సరఫరా అవసరం.' },
                { stage: 'దుంపల పెరుగుదల (వారాలు 7-12)', action: 'అత్యధిక డిమాండ్. సక్రమంగా లేని నీటిపారుదల విరిగిన దుంపలకు కారణమవుతుంది.' },
                { stage: 'పరిణితి (వారాలు 13+)', action: 'తీగలు చనిపోయినప్పుడు నీరు పెట్టడం ఆపండి.' }
            ]
        }
    }
};
