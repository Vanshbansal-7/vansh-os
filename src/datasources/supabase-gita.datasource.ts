import { createClient } from '@supabase/supabase-js';
import { GitaVerse } from '@/types/gita';
import { logger } from '@/lib/logger';

// Authentic Bhagavad Gita Library spanning key life themes, Karma Yoga, Mind Control, Focus, and Dharma
export const AUTHENTIC_GITA_LIBRARY: GitaVerse[] = [
  {
    id: '00000000-0000-0000-0000-000000000247',
    chapter: 2,
    verse: 47,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
    hindi_meaning: 'तेरा अधिकार केवल कर्म करने में है, उसके फलों में कभी नहीं। इसलिए तू कर्मफल का हेतु मत बन और न ही तेरी अकर्मण्यता में आसक्ति हो।',
    english_meaning: 'You have a right to perform your prescribed duty, but you are not entitled to the fruits of action. Never consider yourself the cause of the results of your activities, and never be attached to not doing your duty.',
    theme: 'Nishkama Karma',
    keywords: ['karma', 'duty', 'focus', 'detachment'],
    life_topics: ['work-ethic', 'focus', 'procrastination'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.47',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000248',
    chapter: 2,
    verse: 48,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'योगस्थ: कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय ।\nसिद्ध्यसिद्ध्यो: समो भूत्वा समत्वं योग उच्यते ॥',
    hindi_meaning: 'हे धनंजय! सफलता और असफलता में समभाव रखते हुए, आसक्ति को त्यागकर अपने कर्तव्य का पालन कर। यह समभाव ही योग कहलाता है।',
    english_meaning: 'Perform your duty poised in yoga, O Arjuna, abandoning all attachment to success or failure. Such equanimity is called yoga.',
    theme: 'Equanimity (Samatvam)',
    keywords: ['yoga', 'equanimity', 'balance', 'peace'],
    life_topics: ['stress', 'resilience', 'emotional-balance'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.48',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000250',
    chapter: 2,
    verse: 50,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'बुद्धियुक्तो जहातीह उभे सुकृतदुष्कृते ।\nतस्माद्योगाय युज्यस्व योग: कर्मसु कौशलम् ॥',
    hindi_meaning: 'समबुद्धि युक्त मनुष्य इस लोक में पुण्य और पाप दोनों को त्याग देता है। इसलिए तू योग में लग जा, क्योंकि कर्मों में कुशलता ही योग है।',
    english_meaning: 'A person who is endowed with equanimity of mind gets rid of both good and bad deeds in this life. Therefore, strive for yoga; yoga is skill in action.',
    theme: 'Excellence in Action',
    keywords: ['skill', 'action', 'mastery', 'focus'],
    life_topics: ['productivity', 'mastery', 'work-ethic'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.50',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000262',
    chapter: 2,
    verse: 62,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'ध्यायतो विषयान्पुंस: सङ्गस्तेषूपजायते ।\nसङ्गात्सञ्जायते काम: कामात्क्रोधोऽभिजायते ॥',
    hindi_meaning: 'विषयों का चिन्तन करने वाले पुरुष की उनमें आसक्ति हो जाती है, आसक्ति से कामना उत्पन्न होती है और कामना में विघ्न पड़ने से क्रोध उत्पन्न होता है।',
    english_meaning: 'While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.',
    theme: 'Mind Control & Desires',
    keywords: ['attachment', 'anger', 'mind', 'desire'],
    life_topics: ['distraction', 'self-control', 'habits'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 2.62',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000263',
    chapter: 2,
    verse: 63,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'क्रोधाद्भवति संमोह: संमोहात्स्मृतिविभ्रम: ।\nस्मृतिभ्रंशाद् बुद्धिनाशो बुद्धिनाशात्प्रणश्यति ॥',
    hindi_meaning: 'क्रोध से सम्मोह (मूढ़ता) उत्पन्न होता है, सम्मोह से स्मृति भ्रमित होती है, स्मृति भ्रमित होने से बुद्धि का नाश होता है और बुद्धि नष्ट होने पर मनुष्य का पतन हो जाता है।',
    english_meaning: 'From anger arises complete delusion, from delusion confusion of memory, from loss of memory the destruction of intellect, and from destruction of intellect one is ruined.',
    theme: 'Emotional Mastery',
    keywords: ['anger', 'intellect', 'destruction', 'clarity'],
    life_topics: ['anger-management', 'mental-health', 'decision-making'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 2.63',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000270',
    chapter: 2,
    verse: 70,
    chapter_name: 'सांख्य योग (Sankhya Yoga)',
    sanskrit: 'आपूर्यमाणमचलप्रतिष्ठं\nसमुद्रमाप: प्रविशन्ति यद्वत् ।\nतद्वत्कामा यं प्रविशन्ति सर्वे\nस शान्तिमाप्नोति न कामकामी ॥',
    hindi_meaning: 'जैसे सब ओर से जल से परिपूर्ण समुद्र में नदियाँ बिना विचलित किए समा जाती हैं, वैसे ही जिस मनुष्य में सब भोग बिना विकार उत्पन्न किए समा जाते हैं, वही शांति पाता है।',
    english_meaning: 'A person who is not disturbed by the incessant flow of desires—that enter like rivers into the ocean, which is ever being filled but is always still—can alone achieve peace.',
    theme: 'Inner Stability & Peace',
    keywords: ['peace', 'ocean', 'stillness', 'contentment'],
    life_topics: ['inner-peace', 'mindfulness', 'contentment'],
    difficulty: 'advanced',
    source: 'Bhagavad Gita 2.70',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000309',
    chapter: 3,
    verse: 9,
    chapter_name: 'कर्म योग (Karma Yoga)',
    sanskrit: 'यज्ञार्थात्कर्मणोऽन्यत्र लोकोऽयं कर्मबन्धन: ।\nतदर्थं कर्म कौन्तेय मुक्तसङ्ग: समाचर ॥',
    hindi_meaning: 'यज्ञ (समर्पण व निःस्वार्थ सेवा) के अतिरिक्त किए जाने वाले कर्मों से मनुष्य बंधता है। इसलिए हे कौन्तेय! आसक्ति रहित होकर केवल कर्तव्य भाव से कर्म कर।',
    english_meaning: 'Work done as a sacrifice for the Supreme must be performed; otherwise work causes bondage in this material world. Therefore, O son of Kunti, perform your prescribed duties with detachment.',
    theme: 'Selfless Service',
    keywords: ['service', 'sacrifice', 'freedom', 'action'],
    life_topics: ['purpose', 'integrity', 'service'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 3.9',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000319',
    chapter: 3,
    verse: 19,
    chapter_name: 'कर्म योग (Karma Yoga)',
    sanskrit: 'तस्मादसक्त: सततं कार्यं कर्म समाचर ।\nअसक्तो ह्याचरन्कर्म परमाप्नोति पूरुष: ॥',
    hindi_meaning: 'अतः तू निरन्तर आसक्तिरहित होकर कर्तव्य कर्म का भलीभाँति आचरण कर; क्योंकि आसक्ति से रहित होकर कर्म करता हुआ मनुष्य परमात्मा को प्राप्त होता है।',
    english_meaning: 'Therefore, without being attached to the fruits of activities, one should act as a matter of duty, for by working without attachment one attains the Supreme.',
    theme: 'Selfless Execution',
    keywords: ['duty', 'perfection', 'action', 'discipline'],
    life_topics: ['career', 'focus', 'deep-work'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 3.19',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000321',
    chapter: 3,
    verse: 21,
    chapter_name: 'कर्म योग (Karma Yoga)',
    sanskrit: 'यद्यदाचरति श्रेष्ठस्तत्तदेवेतरो जन: ।\nस यत्प्रमाणं कुरुते लोकस्तदनुवर्तते ॥',
    hindi_meaning: 'श्रेष्ठ पुरुष जो-जो आचरण करता है, अन्य लोग भी वैसा ही आचरण करते हैं। वह जो कुछ प्रमाण प्रस्तुत कर देता है, सारा संसार उसी का अनुसरण करता है।',
    english_meaning: 'Whatever action a great man performs, common men follow. And whatever standards he sets by exemplary acts, all the world pursues.',
    theme: 'Exemplary Leadership',
    keywords: ['leadership', 'role-model', 'character', 'influence'],
    life_topics: ['leadership', 'influence', 'responsibility'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 3.21',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000330',
    chapter: 3,
    verse: 30,
    chapter_name: 'कर्म योग (Karma Yoga)',
    sanskrit: 'मयि सर्वाणि कर्माणि संन्यस्याध्यात्मचेतसा ।\nनिराशीर्निर्ममो भूत्वा युध्यस्व विगतज्वर: ॥',
    hindi_meaning: 'अपने समस्त कर्मों को मुझमें अर्पित करके, अध्यात्म चेतना से युक्त होकर, आशा और ममता से रहित तथा संताप रहित होकर तू युद्ध (कर्तव्य) कर।',
    english_meaning: 'Surrendering all your works unto Me, with your mind intent on the Supreme, and free from desire and egoism, fight without mental grief.',
    theme: 'Surrender in Action',
    keywords: ['dedication', 'courage', 'duty', 'peace'],
    life_topics: ['courage', 'mental-peace', 'purpose'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 3.30',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000000407',
    chapter: 4,
    verse: 7,
    chapter_name: 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    sanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत ।\nअभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम् ॥',
    hindi_meaning: 'हे भारत! जब-जब धर्म की हानि और अधर्म की वृद्धि होती है, तब-तब मैं अपने रूप को रचता हूँ अर्थात साकार रूप में प्रकट होता हूँ।',
    english_meaning: 'Whenever and wherever there is a decline in righteousness, O descendant of Bharata, and a predominant rise of unrighteousness—at that time I manifest Myself.',
    theme: 'Divine Justice & Dharma',
    keywords: ['dharma', 'righteousness', 'divine', 'protection'],
    life_topics: ['ethics', 'truth', 'faith'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 4.7',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000408',
    chapter: 4,
    verse: 8,
    chapter_name: 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    sanskrit: 'परित्राणाय साधूनां विनाशाय च दुष्कृताम् ।\nधर्मसंस्थापनार्थाय संभवामि युगे युगे ॥',
    hindi_meaning: 'साधु पुरुषों के उद्धार के लिए, पापकर्म करने वालों के विनाश के लिए और धर्म की भलीभाँति स्थापना के लिए मैं युग-युग में प्रकट होता हूँ।',
    english_meaning: 'To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I Myself appear, millennium after millennium.',
    theme: 'Triumph of Good',
    keywords: ['protection', 'triumph', 'dharma', 'justice'],
    life_topics: ['justice', 'perseverance', 'morality'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 4.8',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000438',
    chapter: 4,
    verse: 38,
    chapter_name: 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    sanskrit: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते ।\nतत्स्वयं योगसंसिद्ध: कालेनात्मनि विन्दति ॥',
    hindi_meaning: 'इस संसार में ज्ञान के समान पवित्र करने वाला निःसंदेह कुछ भी नहीं है। उस ज्ञान को कर्मयोग में सिद्ध हुआ मनुष्य समय पाकर स्वयं अपनी आत्मा में अनुभव करता है।',
    english_meaning: 'In this world, there is nothing so sublime and pure as transcendental knowledge. Such knowledge is the mature fruit of all mysticism.',
    theme: 'Supreme Power of Knowledge',
    keywords: ['knowledge', 'wisdom', 'mastery', 'purity'],
    life_topics: ['learning', 'skill-building', 'curiosity'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 4.38',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000439',
    chapter: 4,
    verse: 39,
    chapter_name: 'ज्ञानकर्मसंन्यासयोग (Transcendental Knowledge)',
    sanskrit: 'श्रद्धावाँल्लभते ज्ञानं तत्पर: संयतेन्द्रिय: ।\nज्ञानं लब्ध्वा परां शान्तिमचिरेणाधिगच्छति ॥',
    hindi_meaning: 'जितेन्द्रिय और साधन-परायण श्रद्धावान मनुष्य ही ज्ञान को प्राप्त करता है। ज्ञान प्राप्त करके वह बिना विलम्ब के परम शान्ति को प्राप्त होता है।',
    english_meaning: 'A faithful man who is dedicated to transcendental knowledge and who subdues his senses is eligible to achieve such knowledge, and having achieved it he quickly attains the supreme spiritual peace.',
    theme: 'Faith & Focus',
    keywords: ['faith', 'focus', 'restraint', 'peace'],
    life_topics: ['dedication', 'discipline', 'learning'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 4.39',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000000605',
    chapter: 6,
    verse: 5,
    chapter_name: 'ध्यान योग (Dhyana Yoga)',
    sanskrit: 'उद्धरेदात्मनात्मानं नात्मानमवसादयेत् ।\nआत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मन: ॥',
    hindi_meaning: 'मनुष्य को चाहिए कि अपने मन के द्वारा अपना उद्धार करे, अपने को पतन की ओर न ले जाए; क्योंकि यह मन ही मनुष्य का मित्र है और मन ही उसका शत्रु है।',
    english_meaning: 'One must elevate oneself by one’s own mind, and not degrade oneself. The mind is the friend of the conditioned soul, and its enemy as well.',
    theme: 'Self-Elevation & Mind Control',
    keywords: ['mind', 'self-elevation', 'friend', 'enemy'],
    life_topics: ['self-discipline', 'mindset', 'habits'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 6.5',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000606',
    chapter: 6,
    verse: 6,
    chapter_name: 'ध्यान योग (Dhyana Yoga)',
    sanskrit: 'बन्धुरात्मात्मनस्तस्य येनात्मैवात्मना जित: ।\nअनात्मनस्तु शत्रुत्वे वर्तेतात्मैव शत्रुवत् ॥',
    hindi_meaning: 'जिसने अपने मन को जीत लिया है, उसके लिए मन सबसे उत्तम मित्र है; परन्तु जो मन को नहीं जीत सका, उसका मन ही उसका सबसे बड़ा शत्रु बनकर आचरण करता है।',
    english_meaning: 'For him who has conquered the mind, the mind is the best of friends; but for one who has failed to do so, his mind will remain the greatest enemy.',
    theme: 'Conquering the Mind',
    keywords: ['mindset', 'victory', 'control', 'strength'],
    life_topics: ['mental-toughness', 'habits', 'focus'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 6.6',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000626',
    chapter: 6,
    verse: 26,
    chapter_name: 'ध्यान योग (Dhyana Yoga)',
    sanskrit: 'यतो यतो निश्चरति मनश्चञ्चलमस्थिरम् ।\nततस्ततो नियम्यैतदात्मन्येव वशं नयेत् ॥',
    hindi_meaning: 'यह चंचल और अस्थिर मन जिस-जिस विषय के कारण सांसारिक पदार्थों में भटकता है, उस-उस से इसे रोककर बार-बार आत्मा में ही स्थिर करना चाहिए।',
    english_meaning: 'From wherever the mind wanders due to its flickering and unsteady nature, one must certainly withdraw it and bring it back under the control of the Self.',
    theme: 'Focus & Distraction Management',
    keywords: ['focus', 'wandering', 'restraint', 'dhyana'],
    life_topics: ['focus', 'deep-work', 'distraction'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 6.26',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000635',
    chapter: 6,
    verse: 35,
    chapter_name: 'ध्यान योग (Dhyana Yoga)',
    sanskrit: 'असंशयं महाबाहो मनो दुर्निग्रहं चलम् ।\nअभ्यासेन तु कौन्तेय वैराग्येण च गृह्यते ॥',
    hindi_meaning: 'हे महाबाहो! इसमें कोई संशय नहीं कि मन चंचल और कठिनता से वश में होने वाला है; परन्तु हे कुन्तीपुत्र! निरन्तर अभ्यास और वैराग्य द्वारा इसे वश में किया जा सकता है।',
    english_meaning: 'O mighty-armed son of Kunti, it is undoubtedly very difficult to curb the restless mind, but it is possible by suitable practice and by detachment.',
    theme: 'Power of Relentless Practice (Abhyasa)',
    keywords: ['practice', 'abhyasa', 'consistency', 'discipline'],
    life_topics: ['consistency', 'habit-building', 'perseverance'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 6.35',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000000922',
    chapter: 9,
    verse: 22,
    chapter_name: 'राजविद्याराजगुह्ययोग (Royal Knowledge)',
    sanskrit: 'अनन्याश्चिन्तयन्तो मां ये जना: पर्युपासते ।\nतेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम् ॥',
    hindi_meaning: 'जो अनन्य भक्तजन मेरा चिन्तन करते हुए निष्काम भाव से मेरी उपासना करते हैं, उन नित्य युक्त पुरुषों के योग (अप्राप्त की प्राप्ति) और क्षेम (प्राप्त की रक्षा) का वहन मैं स्वयं करता हूँ।',
    english_meaning: 'To those who always worship Me with exclusive devotion, meditating on My transcendental form, to them I carry what they lack, and I preserve what they have.',
    theme: 'Divine Assurance & Protection',
    keywords: ['protection', 'devotion', 'faith', 'security'],
    life_topics: ['faith', 'peace-of-mind', 'trust'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 9.22',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000001041',
    chapter: 10,
    verse: 41,
    chapter_name: 'विभूतियोग (The Opulence of the Absolute)',
    sanskrit: 'यद्यद्विभूतिमत्सत्त्वं श्रीमदूर्जितमेव वा ।\nतत्तदेवावगच्छ त्वं मम तेजोऽंशसम्भवम् ॥',
    hindi_meaning: 'जो-जो भी ऐश्वर्ययुक्त, कान्तियुक्त और शक्ति सम्पन्न वस्तु या प्राणी है, उस-उस को तू मेरे ही तेज के अंश से उत्पन्न हुआ जान।',
    english_meaning: 'Know that all opulent, beautiful and glorious creations spring from but a spark of My splendor.',
    theme: 'Seeing Divinity in Excellence',
    keywords: ['splendor', 'glory', 'power', 'excellence'],
    life_topics: ['humility', 'appreciation', 'awe'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 10.41',
    is_featured: true,
    display_priority: 8,
  },
  {
    id: '00000000-0000-0000-0000-000000001133',
    chapter: 11,
    verse: 33,
    chapter_name: 'विश्वरूपदर्शनयोग (Vision of the Universal Form)',
    sanskrit: 'तस्मात्त्वमुत्तिष्ठ यशो लभस्व\nजित्वा शत्रून् भुङ्क्ष्व राज्यं समृद्धम् ।\nमयैवैते निहता: पूर्वमेव\nनिमित्तमात्रं भव सव्यसाचिन् ॥',
    hindi_meaning: 'इसलिए तू उठ! यश प्राप्त कर और शत्रुओं को जीतकर धन-धान्य सम्पन्न राज्य का भोग कर। ये सब पहले से ही मेरे द्वारा मारे जा चुके हैं, हे सव्यसाची! तू केवल निमित्त मात्र बन जा।',
    english_meaning: 'Therefore get up! Prepare to fight and conquer your enemies. Enjoy a flourishing kingdom. They are already put to death by My arrangement, and you, O Savyasaci, can be but an instrument in the fight.',
    theme: 'Being an Instrument of Destiny (Nimitta-Matram)',
    keywords: ['courage', 'instrument', 'destiny', 'action'],
    life_topics: ['courage', 'action', 'perseverance'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 11.33',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000001215',
    chapter: 12,
    verse: 15,
    chapter_name: 'भक्तियोग (Bhakti Yoga)',
    sanskrit: 'यस्मान्नोद्विजते लोको लोकान्नोद्विजते च य: ।\nहर्षामर्षभयोद्वेगैर्मुक्तो य: स च मे प्रिय: ॥',
    hindi_meaning: 'जिससे कोई भी प्राणी उद्वेग को प्राप्त नहीं होता और जो स्वयं किसी प्राणी से उद्वेग को प्राप्त नहीं होता तथा जो हर्ष, अमर्ष, भय और उद्वेग से मुक्त है—वही मुझे प्रिय है।',
    english_meaning: 'He for whom no one is put into difficulty and who is not disturbed by anxiety, who is freed from highs and lows of joy, grief, fear and anxiety, is very dear to Me.',
    theme: 'Emotional Stability & Harmony',
    keywords: ['calmness', 'harmony', 'peace', 'resilience'],
    life_topics: ['relationships', 'emotional-intelligence', 'peace'],
    difficulty: 'intermediate',
    source: 'Bhagavad Gita 12.15',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000001601',
    chapter: 16,
    verse: 1,
    chapter_name: 'दैवासुरसम्पद्विभागयोग (Divine and Demonic Natures)',
    sanskrit: 'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थिति: ।\nदानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥',
    hindi_meaning: 'भय का पूर्ण अभाव, अंतःकरण की शुद्धि, ज्ञान के लिए योग में निरंतर स्थिति, दान, इंद्रिय दमन, यज्ञ, स्वाध्याय, तप और सरलता—ये दैवी गुण हैं।',
    english_meaning: 'Fearlessness, purification of one’s existence, cultivation of spiritual knowledge, charity, self-control, sacrifice, study of the scriptures, austerity and simplicity—these are transcendental qualities.',
    theme: 'Noble Virtues (Daivi Sampad)',
    keywords: ['fearlessness', 'purity', 'simplicity', 'virtue'],
    life_topics: ['character', 'integrity', 'growth'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 16.1',
    is_featured: true,
    display_priority: 9,
  },
  {
    id: '00000000-0000-0000-0000-000000001865',
    chapter: 18,
    verse: 65,
    chapter_name: 'मोक्षसंन्यासयोग (Liberation through Renunciation)',
    sanskrit: 'मन्मना भव मद्भक्तो मद्याजी मां नमस्कुरु ।\nमामेवैष्यसि सत्यं ते प्रतिजाने प्रियोऽसि मे ॥',
    hindi_meaning: 'मुझमें मन वाला हो, मेरा भक्त बन, मेरा पूजन करने वाला हो और मुझे नमस्कार कर। ऐसा करने से तू मुझको ही प्राप्त होगा, यह मेरी सत्य प्रतिज्ञा है क्योंकि तू मेरा प्रिय है।',
    english_meaning: 'Always think of Me, become My devotee, worship Me and offer your homage unto Me. Thus you will come to Me without fail. I promise you this because you are My very dear friend.',
    theme: 'Supreme Focus & Devotion',
    keywords: ['devotion', 'focus', 'surrender', 'love'],
    life_topics: ['devotion', 'clarity', 'surrender'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 18.65',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000001866',
    chapter: 18,
    verse: 66,
    chapter_name: 'मोक्षसंन्यासयोग (Liberation through Renunciation)',
    sanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज ।\nअहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुच: ॥',
    hindi_meaning: 'सम्पूर्ण धर्मों (कर्तव्यों) के फल को त्यागकर केवल मेरी शरण में आ जा। मैं तुझे समस्त पापों व बन्धनों से मुक्त कर दूँगा, तू शोक मत कर।',
    english_meaning: 'Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear.',
    theme: 'Supreme Refuge & Freedom',
    keywords: ['refuge', 'freedom', 'peace', 'liberation'],
    life_topics: ['inner-peace', 'fearlessness', 'spiritual-growth'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 18.66',
    is_featured: true,
    display_priority: 10,
  },
  {
    id: '00000000-0000-0000-0000-000000001878',
    chapter: 18,
    verse: 78,
    chapter_name: 'मोक्षसंन्यासयोग (Liberation through Renunciation)',
    sanskrit: 'यत्र योगेश्वर: कृष्णो यत्र पार्थो धनुर्धर: ।\nतत्र श्रीर्विजयो भूतिर्ध्रुवा नीतिर्मतिर्मम ॥',
    hindi_meaning: 'जहाँ योगेश्वर श्रीकृष्ण हैं और जहाँ गाण्डीवधारी धनुर्धर अर्जुन हैं, वहीं श्री (ऐश्वर्य), विजय, अलौकिक शक्ति और अटल नीति है—यह मेरा निश्चित मत है।',
    english_meaning: 'Wherever there is Krishna, the master of all mystics, and wherever there is Arjuna, the supreme archer, there will also certainly be opulence, victory, extraordinary power, and morality.',
    theme: 'Victory with Higher Purpose',
    keywords: ['victory', 'alignment', 'excellence', 'success'],
    life_topics: ['success', 'alignment', 'purpose'],
    difficulty: 'foundational',
    source: 'Bhagavad Gita 18.78',
    is_featured: true,
    display_priority: 10,
  }
];

export class SupabaseGitaDatasource {
  private getSupabase() {
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://otjslotfiiubgehiucmn.supabase.co',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_e9C8vUd9Xnwk6DZIEJOQLw_0x4pwPWk'
    );
  }

  async getDailyVerseByDate(dateStr?: string): Promise<{ verse: GitaVerse; isDailyRotation: boolean }> {
    // 1. Determine target date (defaulting to Asia/Kolkata local calendar date)
    const effectiveDate = dateStr || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });

    try {
      const supabase = this.getSupabase();
      
      // Try querying live Supabase table if populated
      const { data: dbVerses, error } = await supabase
        .from('gita_verses')
        .select('*');

      if (!error && dbVerses && dbVerses.length > 0) {
        const index = this.computeDailyIndex(effectiveDate, dbVerses.length);
        return {
          verse: dbVerses[index] as GitaVerse,
          isDailyRotation: true,
        };
      }
    } catch (err) {
      logger.info('Using built-in authentic Gita library for rotation', { date: effectiveDate });
    }

    // 2. Deterministic 24-hour rotation through our rich authentic library
    const index = this.computeDailyIndex(effectiveDate, AUTHENTIC_GITA_LIBRARY.length);
    const selected = AUTHENTIC_GITA_LIBRARY[index];

    return {
      verse: selected,
      isDailyRotation: true,
    };
  }

  private computeDailyIndex(dateStr: string, totalCount: number): number {
    const parts = dateStr.split('-').map(Number);
    const year = parts[0] || 2026;
    const month = parts[1] || 1;
    const day = parts[2] || 1;

    // Daily progression calculation
    const targetTime = Date.UTC(year, month - 1, day);
    const baseTime = Date.UTC(2024, 0, 1);
    const daysSinceEpoch = Math.floor((targetTime - baseTime) / (1000 * 60 * 60 * 24));

    // Jump step to create smooth and varied verse changes day-by-day
    const step = 7;
    const rawIndex = ((Math.abs(daysSinceEpoch) + 3) * step) % totalCount;
    return Math.abs(rawIndex) % totalCount;
  }

  async getAllVerses(): Promise<GitaVerse[]> {
    try {
      const supabase = this.getSupabase();
      const { data, error } = await supabase
        .from('gita_verses')
        .select('*')
        .order('chapter', { ascending: true })
        .order('verse', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as GitaVerse[];
      }
    } catch (err) {
      logger.error('Error fetching all gita verses', err);
    }
    return AUTHENTIC_GITA_LIBRARY;
  }
}

export const supabaseGitaDatasource = new SupabaseGitaDatasource();

