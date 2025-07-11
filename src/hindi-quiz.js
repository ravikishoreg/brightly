import './style.css';
import { insertHeader } from './header.js';
import { generateCommonConfigHTML, generateQuestionKey, getAvailableQuestions } from './common.js';

// Hindi Quiz functionality
console.log('Hindi Quiz page loaded');

// Hindi Question Generator
class HindiQuestionGenerator {
  constructor() {
    // Don't set defaults here - will read from HTML dropdowns
  }

  generateQuestions(count, usedQuestions = new Set()) {
    const questions = [];

    for (let i = 0; i < count; i++) {
      const question = this.generateQuestion(usedQuestions);
      questions.push(question);
      usedQuestions.add(generateQuestionKey(question));
    }

    return questions;
  }

  generateQuestion(usedQuestions = new Set()) {
    const relationshipsQuestions = [
      { question: "What do you call mother in Hindi?", options: ["माँ", "पिता", "बहन", "भाई"], correctAnswer: "माँ" },
      { question: "What do you call father in Hindi?", options: ["माँ", "पिता", "बहन", "भाई"], correctAnswer: "पिता" },
      { question: "What do you call sister in Hindi?", options: ["बहन", "भाई", "माँ", "पिता"], correctAnswer: "बहन" },
      { question: "What do you call brother in Hindi?", options: ["बहन", "भाई", "माँ", "पिता"], correctAnswer: "भाई" },
      { question: "What do you call younger sister in Hindi?", options: ["छोटी बहन", "बड़ी बहन", "माँ", "पिता"], correctAnswer: "छोटी बहन" },
      { question: "What do you call younger brother in Hindi?", options: ["छोटा भाई", "बड़ा भाई", "माँ", "पिता"], correctAnswer: "छोटा भाई" },
      { question: "What do you call son in Hindi?", options: ["बेटा", "बेटी", "माँ", "पिता"], correctAnswer: "बेटा" },
      { question: "What do you call daughter in Hindi?", options: ["बेटा", "बेटी", "माँ", "पिता"], correctAnswer: "बेटी" },
      { question: "What do you call child in Hindi?", options: ["बच्चा", "माँ", "पिता", "बहन"], correctAnswer: "बच्चा" },
      { question: "What do you call grandfather in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "दादा" },
      { question: "What do you call grandmother in Hindi?", options: ["दादी", "दादा", "बहन", "भाई"], correctAnswer: "दादी" },
      { question: "What do you call grandfather in Hindi?", options: ["दादी", "दादा", "बहन", "भाई"], correctAnswer: "दादा" },
      { question: "What do you call maternal grandfather in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "नाना" },
      { question: "What do you call maternal grandmother in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "नानी" },
      { question: "What do you call uncle (father's brother) in Hindi?", options: ["चाचा", "मामा", "ताऊ", "फूफा"], correctAnswer: "चाचा" },
      { question: "What do you call uncle (mother's brother) in Hindi?", options: ["चाचा", "मामा", "ताऊ", "फूफा"], correctAnswer: "मामा" },
      { question: "What do you call aunt (father's sister) in Hindi?", options: ["बुआ", "मौसी", "मामी", "चाची"], correctAnswer: "बुआ" },
      { question: "What do you call aunt (mother's sister) in Hindi?", options: ["बुआ", "मौसी", "मामी", "चाची"], correctAnswer: "मौसी" },
      { question: "What do you call uncle (father's elder brother) in Hindi?", options: ["ताऊ", "चाचा", "मामा", "फूफा"], correctAnswer: "ताऊ" },
      { question: "What do you call aunt (father's brother's wife) in Hindi?", options: ["चाची", "मामी", "बुआ", "मौसी"], correctAnswer: "चाची" },
      { question: "What do you call aunt (mother's brother's wife) in Hindi?", options: ["मामी", "चाची", "बुआ", "मौसी"], correctAnswer: "मामी" },
      { question: "What do you call cousin brother in Hindi?", options: ["चचेरा भाई", "ममेरा भाई", "फुफेरा भाई", "सगा भाई"], correctAnswer: "चचेरा भाई" },
      { question: "What do you call cousin sister in Hindi?", options: ["चचेरी बहन", "ममेरी बहन", "फुफेरी बहन", "सगी बहन"], correctAnswer: "चचेरी बहन" },
      { question: "What do you call son-in-law in Hindi?", options: ["दामाद", "बहू", "बेटा", "बेटी"], correctAnswer: "दामाद" },
      { question: "What do you call daughter-in-law in Hindi?", options: ["दामाद", "बहू", "बेटा", "बेटी"], correctAnswer: "बहू" },
      { question: "What do you call husband in Hindi?", options: ["पति", "पत्नी", "माँ", "पिता"], correctAnswer: "पति" },
      { question: "What do you call wife in Hindi?", options: ["पति", "पत्नी", "माँ", "पिता"], correctAnswer: "पत्नी" }
    ];

    const numbersQuestions = [
      { question: "What do you call 1 in Hindi?", options: ["एक", "दो", "तीन", "चार"], correctAnswer: "एक" },
      { question: "What do you call 2 in Hindi?", options: ["एक", "दो", "तीन", "चार"], correctAnswer: "दो" },
      { question: "What do you call 3 in Hindi?", options: ["दो", "तीन", "चार", "पाँच"], correctAnswer: "तीन" },
      { question: "What do you call 4 in Hindi?", options: ["तीन", "चार", "पाँच", "छह"], correctAnswer: "चार" },
      { question: "What do you call 5 in Hindi?", options: ["चार", "पाँच", "छह", "सात"], correctAnswer: "पाँच" },
      { question: "What do you call 6 in Hindi?", options: ["पाँच", "छह", "सात", "आठ"], correctAnswer: "छह" },
      { question: "What do you call 7 in Hindi?", options: ["छह", "सात", "आठ", "नौ"], correctAnswer: "सात" },
      { question: "What do you call 8 in Hindi?", options: ["सात", "आठ", "नौ", "दस"], correctAnswer: "आठ" },
      { question: "What do you call 9 in Hindi?", options: ["आठ", "नौ", "दस", "ग्यारह"], correctAnswer: "नौ" },
      { question: "What do you call 10 in Hindi?", options: ["नौ", "दस", "ग्यारह", "बारह"], correctAnswer: "दस" },
      { question: "What do you call 11 in Hindi?", options: ["दस", "ग्यारह", "बारह", "तेरह"], correctAnswer: "ग्यारह" },
      { question: "What do you call 12 in Hindi?", options: ["ग्यारह", "बारह", "तेरह", "चौदह"], correctAnswer: "बारह" },
      { question: "What do you call 13 in Hindi?", options: ["बारह", "तेरह", "चौदह", "पंद्रह"], correctAnswer: "तेरह" },
      { question: "What do you call 14 in Hindi?", options: ["तेरह", "चौदह", "पंद्रह", "सोलह"], correctAnswer: "चौदह" },
      { question: "What do you call 15 in Hindi?", options: ["चौदह", "पंद्रह", "सोलह", "सत्रह"], correctAnswer: "पंद्रह" },
      { question: "What do you call 16 in Hindi?", options: ["पंद्रह", "सोलह", "सत्रह", "अठारह"], correctAnswer: "सोलह" },
      { question: "What do you call 17 in Hindi?", options: ["सोलह", "सत्रह", "अठारह", "उन्नीस"], correctAnswer: "सत्रह" },
      { question: "What do you call 18 in Hindi?", options: ["सत्रह", "अठारह", "उन्नीस", "बीस"], correctAnswer: "अठारह" },
      { question: "What do you call 19 in Hindi?", options: ["अठारह", "उन्नीस", "बीस", "इक्कीस"], correctAnswer: "उन्नीस" },
      { question: "What do you call 20 in Hindi?", options: ["उन्नीस", "बीस", "इक्कीस", "बाईस"], correctAnswer: "बीस" },
      { question: "What do you call 30 in Hindi?", options: ["बीस", "तीस", "चालीस", "पचास"], correctAnswer: "तीस" },
      { question: "What do you call 40 in Hindi?", options: ["तीस", "चालीस", "पचास", "साठ"], correctAnswer: "चालीस" },
      { question: "What do you call 50 in Hindi?", options: ["चालीस", "पचास", "साठ", "सत्तर"], correctAnswer: "पचास" },
      { question: "What do you call 60 in Hindi?", options: ["पचास", "साठ", "सत्तर", "अस्सी"], correctAnswer: "साठ" },
      { question: "What do you call 70 in Hindi?", options: ["साठ", "सत्तर", "अस्सी", "नब्बे"], correctAnswer: "सत्तर" },
      { question: "What do you call 80 in Hindi?", options: ["सत्तर", "अस्सी", "नब्बे", "सौ"], correctAnswer: "अस्सी" },
      { question: "What do you call 90 in Hindi?", options: ["अस्सी", "नब्बे", "सौ", "एक सौ दस"], correctAnswer: "नब्बे" },
      { question: "What do you call 100 in Hindi?", options: ["नब्बे", "सौ", "एक सौ दस", "एक सौ बीस"], correctAnswer: "सौ" }
    ];
    const basicWordsQuestions = [
      { question: "What do you call food in Hindi?", options: ["खाना", "पानी", "दूध", "नाश्ता"], correctAnswer: "खाना" },
      { question: "What do you call water in Hindi?", options: ["खाना", "पानी", "दूध", "नाश्ता"], correctAnswer: "पानी" },
      { question: "What do you call house in Hindi?", options: ["घर", "खाना", "पानी", "दूध"], correctAnswer: "घर" },
      { question: "What do you call book in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "किताब" },
      { question: "What do you call pen in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "कलम" },
      { question: "What do you call paper in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "कागज" },
      { question: "What do you call table in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "मेज़" },
      { question: "What do you call chair in Hindi?", options: ["कुर्सी", "मेज़", "घर", "दरवाज़ा"], correctAnswer: "कुर्सी" },
      { question: "What do you call door in Hindi?", options: ["खिड़की", "दरवाज़ा", "घर", "मेज़"], correctAnswer: "दरवाज़ा" },
      { question: "What do you call window in Hindi?", options: ["खिड़की", "दरवाज़ा", "घर", "मेज़"], correctAnswer: "खिड़की" },
      { question: "What do you call tree in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "पेड़" },
      { question: "What do you call flower in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "फूल" },
      { question: "What do you call grass in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "घास" },
      { question: "What do you call plant in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "पौधा" },
      { question: "What do you call sun in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "सूरज" },
      { question: "What do you call moon in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "चाँद" },
      { question: "What do you call star in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "तारा" },
      { question: "What do you call sky in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "आसमान" },
      { question: "What do you call earth in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "पृथ्वी" },
      { question: "What do you call fire in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "आग" },
      { question: "What do you call air in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "हवा" },
      { question: "What do you call head in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "सिर" },
      { question: "What do you call eye in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "आँख" },
      { question: "What do you call nose in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "नाक" },
      { question: "What do you call mouth in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "मुँह" },
      { question: "What do you call hand in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "हाथ" },
      { question: "What do you call leg in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "पैर" },
      { question: "What do you call finger in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "उंगली" },
      { question: "What do you call heart in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "दिल" },
      { question: "What do you call brain in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "दिमाग" },
      { question: "What do you call blood in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "खून" },
      { question: "What do you call bone in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "हड्डी" },
      { question: "What do you call red color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "लाल" },
      { question: "What do you call blue color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "नीला" },
      { question: "What do you call green color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "हरा" },
      { question: "What do you call yellow color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "पीला" },
      { question: "What do you call white color in Hindi?", options: ["सफेद", "काला", "भूरा", "गुलाबी"], correctAnswer: "सफेद" },
      { question: "What do you call black color in Hindi?", options: ["सफेद", "काला", "भूरा", "गुलाबी"], correctAnswer: "काला" },
      { question: "What do you call morning in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "सुबह" },
      { question: "What do you call afternoon in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "दोपहर" },
      { question: "What do you call evening in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "शाम" },
      { question: "What do you call night in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "रात" },
      { question: "What do you call today in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "आज" },
      { question: "What do you call tomorrow in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "कल" },
      { question: "What do you call yesterday in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "परसों" },
      { question: "What do you call now in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "अभी" },
      { question: "What do you call good in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "अच्छा" },
      { question: "What do you call bad in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "बुरा" },
      { question: "What do you call big in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "बड़ा" },
      { question: "What do you call small in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "छोटा" },
      { question: "What do you call hot in Hindi?", options: ["गरम", "ठंडा", "गर्म", "शीतल"], correctAnswer: "गरम" },
      { question: "What do you call cold in Hindi?", options: ["गरम", "ठंडा", "गर्म", "शीतल"], correctAnswer: "ठंडा" },
      { question: "What do you call sweet in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "मीठा" },
      { question: "What do you call sour in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "खट्टा" },
      { question: "What do you call spicy in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "तीखा" },
      { question: "What do you call salty in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "नमकीन" },
      { question: "What do you call rice in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "चावल" },
      { question: "What do you call bread in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "रोटी" },
      { question: "What do you call dal in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "दाल" },
      { question: "What do you call vegetable in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "सब्ज़ी" },
      { question: "What do you call milk in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "दूध" },
      { question: "What do you call curd in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "दही" },
      { question: "What do you call butter in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "मक्खन" },
      { question: "What do you call sugar in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "चीनी" },
      { question: "What do you call oil in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "तेल" },
      { question: "What do you call spice in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "मसाला" },
      { question: "What do you call sleep in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "नींद" },
      { question: "What do you call walk in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "चलना" },
      { question: "What do you call run in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "दौड़ना" },
      { question: "What do you call eat in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "खाना" },
      { question: "What do you call drink in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "पीना" },
      { question: "What do you call see in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "देखना" },
      { question: "What do you call hear in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "सुनना" },
      { question: "What do you call speak in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "बोलना" },
      { question: "What do you call write in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "लिखना" },
      { question: "What do you call read in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "पढ़ना" },
      { question: "What do you call sing in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "गाना" },
      { question: "What do you call laugh in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "हँसना" },
      { question: "What do you call cry in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "रोना" },
      { question: "What do you call smile in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "मुस्कान" },
      { question: "What do you call happy in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "खुश" },
      { question: "What do you call sad in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "दुखी" },
      { question: "What do you call angry in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "गुस्सा" },
      { question: "What do you call afraid in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "डर" },
      { question: "What do you call love in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "प्यार" },
      { question: "What do you call hate in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "नफरत" },
      { question: "What do you call friend in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "दोस्ती" },
      { question: "What do you call trust in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "विश्वास" },
      { question: "What do you call work in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "काम" },
      { question: "What do you call play in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "खेल" },
      { question: "What do you call study in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "पढ़ाई" },
      { question: "What do you call money in Hindi?", options: ["पैसे", "बैंक", "खर्च", "ब्याज"], correctAnswer: "पैसे" },
      { question: "What do you call bank in Hindi?", options: ["पैसे", "बैंक", "खर्च", "ब्याज"], correctAnswer: "बैंक" },
      { question: "What do you call shop in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "दुकान" },
      { question: "What do you call market in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "बाज़ार" },
      { question: "What do you call office in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "ऑफिस" },
      { question: "What do you call school in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "स्कूल" },
      { question: "What do you call college in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "कॉलेज" },
      { question: "What do you call university in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "विश्वविद्यालय" },
      { question: "What do you call teacher in Hindi?", options: ["शिक्षक", "विद्यार्थी", "प्रधानाचार्य", "क्लर्क"], correctAnswer: "शिक्षक" },
      { question: "What do you call student in Hindi?", options: ["शिक्षक", "विद्यार्थी", "प्रधानाचार्य", "क्लर्क"], correctAnswer: "विद्यार्थी" },
      { question: "What do you call doctor in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "डॉक्टर" },
      { question: "What do you call nurse in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "नर्स" },
      { question: "What do you call patient in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "मरीज़" },
      { question: "What do you call medicine in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "दवा" },
      { question: "What do you call car in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "कार" },
      { question: "What do you call bus in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "बस" },
      { question: "What do you call bike in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "बाइक" },
      { question: "What do you call train in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "ट्रेन" },
      { question: "What do you call road in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "सड़क" },
      { question: "What do you call bridge in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "पुल" },
      { question: "What do you call stone in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "पत्थर" },
      { question: "What do you call river in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "नदी" },
      { question: "What do you call lake in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "झील" },
      { question: "What do you call sea in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "समुद्र" },
      { question: "What do you call well in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "कुआँ" },
      { question: "What do you call mountain in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "पहाड़" },
      { question: "What do you call forest in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "जंगल" },
      { question: "What do you call field in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "मैदान" },
      { question: "What do you call village in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "गाँव" },
      { question: "What do you call city in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "शहर" },
      { question: "What do you call state in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "राज्य" },
      { question: "What do you call country in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "देश" },
      { question: "What do you call language in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "भाषा" },
      { question: "What do you call word in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "शब्द" },
      { question: "What do you call sentence in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "वाक्य" },
      { question: "What do you call name in Hindi?", options: ["नाम", "जन्म", "मृत्यु", "उम्र"], correctAnswer: "नाम" },
      { question: "What do you call age in Hindi?", options: ["नाम", "जन्म", "मृत्यु", "उम्र"], correctAnswer: "उम्र" },
      { question: "What do you call life in Hindi?", options: ["जीवन", "मृत्यु", "जन्म", "उम्र"], correctAnswer: "जीवन" },
      { question: "What do you call God in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "भगवान" },
      { question: "What do you call temple in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "मंदिर" },
      { question: "What do you call prayer in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "पूजा" },
      { question: "What do you call festival in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "त्योहार" },
      { question: "What do you call celebration in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "उत्सव" },
      { question: "What do you call joy in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "आनंद" }
    ];

    let questionPool;
    switch (this.category) {
      case 'relationships':
        questionPool = relationshipsQuestions;
        break;
      case 'numbers':
        questionPool = numbersQuestions;
        break;
      case 'basic-words':
        questionPool = basicWordsQuestions;
        break;
      case 'mixed':
        const allCategories = [...relationshipsQuestions, ...numbersQuestions, ...basicWordsQuestions];
        questionPool = allCategories;
        break;
      default:
        const allCategoriesDefault = [...relationshipsQuestions, ...numbersQuestions, ...basicWordsQuestions];
        questionPool = allCategoriesDefault;
    }

    // Get available questions (filter out already used ones in this quiz)
    const availableQuestions = getAvailableQuestions(questionPool, usedQuestions);
    
    // If no available questions, use all questions
    if (availableQuestions.length === 0) {
      return questionPool[Math.floor(Math.random() * questionPool.length)];
    }
    
    // Return a random available question
    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  }

  updateCategory(category) {
    this.category = category;
  }

  getAllStaticQuestions() {
    // Return all questions organized by category
    return {
      'Relationships': HindiQuestionGenerator.relationshipsQuestions,
      'Numbers': HindiQuestionGenerator.numbersQuestions,
      'Basic Words': HindiQuestionGenerator.basicWordsQuestions
    };
  }

  // Static getters for question arrays
  static get relationshipsQuestions() {
    return [
      { question: "What do you call mother in Hindi?", options: ["माँ", "पिता", "बहन", "भाई"], correctAnswer: "माँ" },
      { question: "What do you call father in Hindi?", options: ["माँ", "पिता", "बहन", "भाई"], correctAnswer: "पिता" },
      { question: "What do you call sister in Hindi?", options: ["बहन", "भाई", "माँ", "पिता"], correctAnswer: "बहन" },
      { question: "What do you call brother in Hindi?", options: ["बहन", "भाई", "माँ", "पिता"], correctAnswer: "भाई" },
      { question: "What do you call younger sister in Hindi?", options: ["छोटी बहन", "बड़ी बहन", "माँ", "पिता"], correctAnswer: "छोटी बहन" },
      { question: "What do you call younger brother in Hindi?", options: ["छोटा भाई", "बड़ा भाई", "माँ", "पिता"], correctAnswer: "छोटा भाई" },
      { question: "What do you call son in Hindi?", options: ["बेटा", "बेटी", "माँ", "पिता"], correctAnswer: "बेटा" },
      { question: "What do you call daughter in Hindi?", options: ["बेटा", "बेटी", "माँ", "पिता"], correctAnswer: "बेटी" },
      { question: "What do you call child in Hindi?", options: ["बच्चा", "माँ", "पिता", "बहन"], correctAnswer: "बच्चा" },
      { question: "What do you call grandfather in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "दादा" },
      { question: "What do you call grandmother in Hindi?", options: ["दादी", "दादा", "बहन", "भाई"], correctAnswer: "दादी" },
      { question: "What do you call grandfather in Hindi?", options: ["दादी", "दादा", "बहन", "भाई"], correctAnswer: "दादा" },
      { question: "What do you call maternal grandfather in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "नाना" },
      { question: "What do you call maternal grandmother in Hindi?", options: ["दादा", "दादी", "नाना", "नानी"], correctAnswer: "नानी" },
      { question: "What do you call uncle (father's brother) in Hindi?", options: ["चाचा", "मामा", "ताऊ", "फूफा"], correctAnswer: "चाचा" },
      { question: "What do you call uncle (mother's brother) in Hindi?", options: ["चाचा", "मामा", "ताऊ", "फूफा"], correctAnswer: "मामा" },
      { question: "What do you call aunt (father's sister) in Hindi?", options: ["बुआ", "मौसी", "मामी", "चाची"], correctAnswer: "बुआ" },
      { question: "What do you call aunt (mother's sister) in Hindi?", options: ["बुआ", "मौसी", "मामी", "चाची"], correctAnswer: "मौसी" },
      { question: "What do you call uncle (father's elder brother) in Hindi?", options: ["ताऊ", "चाचा", "मामा", "फूफा"], correctAnswer: "ताऊ" },
      { question: "What do you call aunt (father's brother's wife) in Hindi?", options: ["चाची", "मामी", "बुआ", "मौसी"], correctAnswer: "चाची" },
      { question: "What do you call aunt (mother's brother's wife) in Hindi?", options: ["मामी", "चाची", "बुआ", "मौसी"], correctAnswer: "मामी" },
      { question: "What do you call cousin brother in Hindi?", options: ["चचेरा भाई", "ममेरा भाई", "फुफेरा भाई", "सगा भाई"], correctAnswer: "चचेरा भाई" },
      { question: "What do you call cousin sister in Hindi?", options: ["चचेरी बहन", "ममेरी बहन", "फुफेरी बहन", "सगी बहन"], correctAnswer: "चचेरी बहन" },
      { question: "What do you call son-in-law in Hindi?", options: ["दामाद", "बहू", "बेटा", "बेटी"], correctAnswer: "दामाद" },
      { question: "What do you call daughter-in-law in Hindi?", options: ["दामाद", "बहू", "बेटा", "बेटी"], correctAnswer: "बहू" },
      { question: "What do you call husband in Hindi?", options: ["पति", "पत्नी", "माँ", "पिता"], correctAnswer: "पति" },
      { question: "What do you call wife in Hindi?", options: ["पति", "पत्नी", "माँ", "पिता"], correctAnswer: "पत्नी" }
    ];
  }

  static get numbersQuestions() {
    return [
      { question: "What do you call 1 in Hindi?", options: ["एक", "दो", "तीन", "चार"], correctAnswer: "एक" },
      { question: "What do you call 2 in Hindi?", options: ["एक", "दो", "तीन", "चार"], correctAnswer: "दो" },
      { question: "What do you call 3 in Hindi?", options: ["दो", "तीन", "चार", "पाँच"], correctAnswer: "तीन" },
      { question: "What do you call 4 in Hindi?", options: ["तीन", "चार", "पाँच", "छह"], correctAnswer: "चार" },
      { question: "What do you call 5 in Hindi?", options: ["चार", "पाँच", "छह", "सात"], correctAnswer: "पाँच" },
      { question: "What do you call 6 in Hindi?", options: ["पाँच", "छह", "सात", "आठ"], correctAnswer: "छह" },
      { question: "What do you call 7 in Hindi?", options: ["छह", "सात", "आठ", "नौ"], correctAnswer: "सात" },
      { question: "What do you call 8 in Hindi?", options: ["सात", "आठ", "नौ", "दस"], correctAnswer: "आठ" },
      { question: "What do you call 9 in Hindi?", options: ["आठ", "नौ", "दस", "ग्यारह"], correctAnswer: "नौ" },
      { question: "What do you call 10 in Hindi?", options: ["नौ", "दस", "ग्यारह", "बारह"], correctAnswer: "दस" },
      { question: "What do you call 11 in Hindi?", options: ["दस", "ग्यारह", "बारह", "तेरह"], correctAnswer: "ग्यारह" },
      { question: "What do you call 12 in Hindi?", options: ["ग्यारह", "बारह", "तेरह", "चौदह"], correctAnswer: "बारह" },
      { question: "What do you call 13 in Hindi?", options: ["बारह", "तेरह", "चौदह", "पंद्रह"], correctAnswer: "तेरह" },
      { question: "What do you call 14 in Hindi?", options: ["तेरह", "चौदह", "पंद्रह", "सोलह"], correctAnswer: "चौदह" },
      { question: "What do you call 15 in Hindi?", options: ["चौदह", "पंद्रह", "सोलह", "सत्रह"], correctAnswer: "पंद्रह" },
      { question: "What do you call 16 in Hindi?", options: ["पंद्रह", "सोलह", "सत्रह", "अठारह"], correctAnswer: "सोलह" },
      { question: "What do you call 17 in Hindi?", options: ["सोलह", "सत्रह", "अठारह", "उन्नीस"], correctAnswer: "सत्रह" },
      { question: "What do you call 18 in Hindi?", options: ["सत्रह", "अठारह", "उन्नीस", "बीस"], correctAnswer: "अठारह" },
      { question: "What do you call 19 in Hindi?", options: ["अठारह", "उन्नीस", "बीस", "इक्कीस"], correctAnswer: "उन्नीस" },
      { question: "What do you call 20 in Hindi?", options: ["उन्नीस", "बीस", "इक्कीस", "बाईस"], correctAnswer: "बीस" },
      { question: "What do you call 30 in Hindi?", options: ["बीस", "तीस", "चालीस", "पचास"], correctAnswer: "तीस" },
      { question: "What do you call 40 in Hindi?", options: ["तीस", "चालीस", "पचास", "साठ"], correctAnswer: "चालीस" },
      { question: "What do you call 50 in Hindi?", options: ["चालीस", "पचास", "साठ", "सत्तर"], correctAnswer: "पचास" },
      { question: "What do you call 60 in Hindi?", options: ["पचास", "साठ", "सत्तर", "अस्सी"], correctAnswer: "साठ" },
      { question: "What do you call 70 in Hindi?", options: ["साठ", "सत्तर", "अस्सी", "नब्बे"], correctAnswer: "सत्तर" },
      { question: "What do you call 80 in Hindi?", options: ["सत्तर", "अस्सी", "नब्बे", "सौ"], correctAnswer: "अस्सी" },
      { question: "What do you call 90 in Hindi?", options: ["अस्सी", "नब्बे", "सौ", "एक सौ दस"], correctAnswer: "नब्बे" },
      { question: "What do you call 100 in Hindi?", options: ["नब्बे", "सौ", "एक सौ दस", "एक सौ बीस"], correctAnswer: "सौ" }
    ];
  }

  static get basicWordsQuestions() {
    return [
      { question: "What do you call food in Hindi?", options: ["खाना", "पानी", "दूध", "नाश्ता"], correctAnswer: "खाना" },
      { question: "What do you call water in Hindi?", options: ["खाना", "पानी", "दूध", "नाश्ता"], correctAnswer: "पानी" },
      { question: "What do you call house in Hindi?", options: ["घर", "खाना", "पानी", "दूध"], correctAnswer: "घर" },
      { question: "What do you call book in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "किताब" },
      { question: "What do you call pen in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "कलम" },
      { question: "What do you call paper in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "कागज" },
      { question: "What do you call table in Hindi?", options: ["किताब", "कागज", "कलम", "मेज़"], correctAnswer: "मेज़" },
      { question: "What do you call chair in Hindi?", options: ["कुर्सी", "मेज़", "घर", "दरवाज़ा"], correctAnswer: "कुर्सी" },
      { question: "What do you call door in Hindi?", options: ["खिड़की", "दरवाज़ा", "घर", "मेज़"], correctAnswer: "दरवाज़ा" },
      { question: "What do you call window in Hindi?", options: ["खिड़की", "दरवाज़ा", "घर", "मेज़"], correctAnswer: "खिड़की" },
      { question: "What do you call tree in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "पेड़" },
      { question: "What do you call flower in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "फूल" },
      { question: "What do you call grass in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "घास" },
      { question: "What do you call plant in Hindi?", options: ["पेड़", "फूल", "घास", "पौधा"], correctAnswer: "पौधा" },
      { question: "What do you call sun in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "सूरज" },
      { question: "What do you call moon in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "चाँद" },
      { question: "What do you call star in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "तारा" },
      { question: "What do you call sky in Hindi?", options: ["चाँद", "सूरज", "तारा", "आसमान"], correctAnswer: "आसमान" },
      { question: "What do you call earth in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "पृथ्वी" },
      { question: "What do you call fire in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "आग" },
      { question: "What do you call air in Hindi?", options: ["पृथ्वी", "पानी", "हवा", "आग"], correctAnswer: "हवा" },
      { question: "What do you call head in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "सिर" },
      { question: "What do you call eye in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "आँख" },
      { question: "What do you call nose in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "नाक" },
      { question: "What do you call mouth in Hindi?", options: ["सिर", "आँख", "नाक", "मुँह"], correctAnswer: "मुँह" },
      { question: "What do you call hand in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "हाथ" },
      { question: "What do you call leg in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "पैर" },
      { question: "What do you call finger in Hindi?", options: ["हाथ", "पैर", "उंगली", "सिर"], correctAnswer: "उंगली" },
      { question: "What do you call heart in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "दिल" },
      { question: "What do you call brain in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "दिमाग" },
      { question: "What do you call blood in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "खून" },
      { question: "What do you call bone in Hindi?", options: ["दिल", "दिमाग", "खून", "हड्डी"], correctAnswer: "हड्डी" },
      { question: "What do you call red color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "लाल" },
      { question: "What do you call blue color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "नीला" },
      { question: "What do you call green color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "हरा" },
      { question: "What do you call yellow color in Hindi?", options: ["लाल", "नीला", "हरा", "पीला"], correctAnswer: "पीला" },
      { question: "What do you call white color in Hindi?", options: ["सफेद", "काला", "भूरा", "गुलाबी"], correctAnswer: "सफेद" },
      { question: "What do you call black color in Hindi?", options: ["सफेद", "काला", "भूरा", "गुलाबी"], correctAnswer: "काला" },
      { question: "What do you call morning in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "सुबह" },
      { question: "What do you call afternoon in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "दोपहर" },
      { question: "What do you call evening in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "शाम" },
      { question: "What do you call night in Hindi?", options: ["सुबह", "दोपहर", "शाम", "रात"], correctAnswer: "रात" },
      { question: "What do you call today in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "आज" },
      { question: "What do you call tomorrow in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "कल" },
      { question: "What do you call yesterday in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "परसों" },
      { question: "What do you call now in Hindi?", options: ["आज", "कल", "परसों", "अभी"], correctAnswer: "अभी" },
      { question: "What do you call good in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "अच्छा" },
      { question: "What do you call bad in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "बुरा" },
      { question: "What do you call big in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "बड़ा" },
      { question: "What do you call small in Hindi?", options: ["अच्छा", "बुरा", "बड़ा", "छोटा"], correctAnswer: "छोटा" },
      { question: "What do you call hot in Hindi?", options: ["गरम", "ठंडा", "गर्म", "शीतल"], correctAnswer: "गरम" },
      { question: "What do you call cold in Hindi?", options: ["गरम", "ठंडा", "गर्म", "शीतल"], correctAnswer: "ठंडा" },
      { question: "What do you call sweet in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "मीठा" },
      { question: "What do you call sour in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "खट्टा" },
      { question: "What do you call spicy in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "तीखा" },
      { question: "What do you call salty in Hindi?", options: ["मीठा", "खट्टा", "तीखा", "नमकीन"], correctAnswer: "नमकीन" },
      { question: "What do you call rice in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "चावल" },
      { question: "What do you call bread in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "रोटी" },
      { question: "What do you call dal in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "दाल" },
      { question: "What do you call vegetable in Hindi?", options: ["चावल", "रोटी", "दाल", "सब्ज़ी"], correctAnswer: "सब्ज़ी" },
      { question: "What do you call milk in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "दूध" },
      { question: "What do you call curd in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "दही" },
      { question: "What do you call butter in Hindi?", options: ["दूध", "दही", "मक्खन", "घी"], correctAnswer: "मक्खन" },
      { question: "What do you call sugar in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "चीनी" },
      { question: "What do you call oil in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "तेल" },
      { question: "What do you call spice in Hindi?", options: ["चीनी", "नमक", "मसाला", "तेल"], correctAnswer: "मसाला" },
      { question: "What do you call sleep in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "नींद" },
      { question: "What do you call walk in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "चलना" },
      { question: "What do you call run in Hindi?", options: ["नींद", "साँस", "चलना", "दौड़ना"], correctAnswer: "दौड़ना" },
      { question: "What do you call eat in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "खाना" },
      { question: "What do you call drink in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "पीना" },
      { question: "What do you call see in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "देखना" },
      { question: "What do you call hear in Hindi?", options: ["खाना", "पीना", "देखना", "सुनना"], correctAnswer: "सुनना" },
      { question: "What do you call speak in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "बोलना" },
      { question: "What do you call write in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "लिखना" },
      { question: "What do you call read in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "पढ़ना" },
      { question: "What do you call sing in Hindi?", options: ["बोलना", "लिखना", "पढ़ना", "गाना"], correctAnswer: "गाना" },
      { question: "What do you call laugh in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "हँसना" },
      { question: "What do you call cry in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "रोना" },
      { question: "What do you call smile in Hindi?", options: ["हँसना", "रोना", "मुस्कान", "चिल्लाना"], correctAnswer: "मुस्कान" },
      { question: "What do you call happy in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "खुश" },
      { question: "What do you call sad in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "दुखी" },
      { question: "What do you call angry in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "गुस्सा" },
      { question: "What do you call afraid in Hindi?", options: ["खुश", "दुखी", "गुस्सा", "डर"], correctAnswer: "डर" },
      { question: "What do you call love in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "प्यार" },
      { question: "What do you call hate in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "नफरत" },
      { question: "What do you call friend in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "दोस्ती" },
      { question: "What do you call trust in Hindi?", options: ["प्यार", "नफरत", "दोस्ती", "विश्वास"], correctAnswer: "विश्वास" },
      { question: "What do you call work in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "काम" },
      { question: "What do you call play in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "खेल" },
      { question: "What do you call study in Hindi?", options: ["काम", "पढ़ाई", "खेल", "नींद"], correctAnswer: "पढ़ाई" },
      { question: "What do you call money in Hindi?", options: ["पैसे", "बैंक", "खर्च", "ब्याज"], correctAnswer: "पैसे" },
      { question: "What do you call bank in Hindi?", options: ["पैसे", "बैंक", "खर्च", "ब्याज"], correctAnswer: "बैंक" },
      { question: "What do you call shop in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "दुकान" },
      { question: "What do you call market in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "बाज़ार" },
      { question: "What do you call office in Hindi?", options: ["दुकान", "बाज़ार", "घर", "ऑफिस"], correctAnswer: "ऑफिस" },
      { question: "What do you call school in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "स्कूल" },
      { question: "What do you call college in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "कॉलेज" },
      { question: "What do you call university in Hindi?", options: ["स्कूल", "कॉलेज", "विश्वविद्यालय", "किताब"], correctAnswer: "विश्वविद्यालय" },
      { question: "What do you call teacher in Hindi?", options: ["शिक्षक", "विद्यार्थी", "प्रधानाचार्य", "क्लर्क"], correctAnswer: "शिक्षक" },
      { question: "What do you call student in Hindi?", options: ["शिक्षक", "विद्यार्थी", "प्रधानाचार्य", "क्लर्क"], correctAnswer: "विद्यार्थी" },
      { question: "What do you call doctor in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "डॉक्टर" },
      { question: "What do you call nurse in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "नर्स" },
      { question: "What do you call patient in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "मरीज़" },
      { question: "What do you call medicine in Hindi?", options: ["डॉक्टर", "नर्स", "मरीज़", "दवा"], correctAnswer: "दवा" },
      { question: "What do you call car in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "कार" },
      { question: "What do you call bus in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "बस" },
      { question: "What do you call bike in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "बाइक" },
      { question: "What do you call train in Hindi?", options: ["कार", "बस", "बाइक", "ट्रेन"], correctAnswer: "ट्रेन" },
      { question: "What do you call road in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "सड़क" },
      { question: "What do you call bridge in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "पुल" },
      { question: "What do you call stone in Hindi?", options: ["सड़क", "पुल", "गड्ढा", "पत्थर"], correctAnswer: "पत्थर" },
      { question: "What do you call river in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "नदी" },
      { question: "What do you call lake in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "झील" },
      { question: "What do you call sea in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "समुद्र" },
      { question: "What do you call well in Hindi?", options: ["नदी", "झील", "समुद्र", "कुआँ"], correctAnswer: "कुआँ" },
      { question: "What do you call mountain in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "पहाड़" },
      { question: "What do you call forest in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "जंगल" },
      { question: "What do you call field in Hindi?", options: ["पहाड़", "घाटी", "मैदान", "जंगल"], correctAnswer: "मैदान" },
      { question: "What do you call village in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "गाँव" },
      { question: "What do you call city in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "शहर" },
      { question: "What do you call state in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "राज्य" },
      { question: "What do you call country in Hindi?", options: ["गाँव", "शहर", "राज्य", "देश"], correctAnswer: "देश" },
      { question: "What do you call language in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "भाषा" },
      { question: "What do you call word in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "शब्द" },
      { question: "What do you call sentence in Hindi?", options: ["भाषा", "शब्द", "वाक्य", "नाम"], correctAnswer: "वाक्य" },
      { question: "What do you call name in Hindi?", options: ["नाम", "जन्म", "मृत्यु", "उम्र"], correctAnswer: "नाम" },
      { question: "What do you call age in Hindi?", options: ["नाम", "जन्म", "मृत्यु", "उम्र"], correctAnswer: "उम्र" },
      { question: "What do you call life in Hindi?", options: ["जीवन", "मृत्यु", "जन्म", "उम्र"], correctAnswer: "जीवन" },
      { question: "What do you call God in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "भगवान" },
      { question: "What do you call temple in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "मंदिर" },
      { question: "What do you call prayer in Hindi?", options: ["भगवान", "देवी", "मंदिर", "पूजा"], correctAnswer: "पूजा" },
      { question: "What do you call festival in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "त्योहार" },
      { question: "What do you call celebration in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "उत्सव" },
      { question: "What do you call joy in Hindi?", options: ["त्योहार", "उत्सव", "खुशी", "आनंद"], correctAnswer: "आनंद" }
    ];
  }
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Insert header
  insertHeader();

  // Populate common configuration
  const commonConfigContainer = document.getElementById('common-config');
  if (commonConfigContainer) {
    commonConfigContainer.innerHTML = generateCommonConfigHTML();
  }

  // Create question generator
  const questionGenerator = new HindiQuestionGenerator();

  // Read initial values from HTML dropdowns
  const categorySelect = document.getElementById('difficulty');
  
  if (categorySelect) {
    questionGenerator.category = categorySelect.value;
  }

  // Create quiz manager
  const quizManager = new CommonQuizManager();
  quizManager.setQuestionGenerator(questionGenerator);
  quizManager.setQuizTitle('Hindi Quiz');

  // Bind category change
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      questionGenerator.updateCategory(e.target.value);
    });
  }
}); 