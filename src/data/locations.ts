import { Location, Language } from '../types';

export const getDailyChallenge = (language: Language) => {
  const challenges: Record<Language, { text: string, locationId: string }> = {
    French: { text: "Commander un café au comptoir sans montrer le menu", locationId: "cafe" },
    Spanish: { text: "Pedir al panadero su recomendación del día", locationId: "bakery" },
    Italian: { text: "Comprare un biglietto del treno per Firenze", locationId: "train" },
    Portuguese: { text: "Perguntar ao vizinho que dia o lixo é recolhido", locationId: "apartment" },
    German: { text: "Nach einem Mittel gegen Kopfschmerzen fragen", locationId: "pharmacy" }
  };
  return challenges[language];
};

export const getLocations = (language: Language): Location[] => {
  const isFrench = language === 'French';
  const isSpanish = language === 'Spanish';
  const isItalian = language === 'Italian';
  const isPortuguese = language === 'Portuguese';

  return [
    {
      id: 'bakery',
      district: 'Food & Dining',
      name: isFrench ? 'La Boulangerie' : isSpanish ? 'La Panadería' : isItalian ? 'La Panetteria' : isPortuguese ? 'A Padaria' : 'Die Bäckerei',
      description: 'A warm bakery smelling of fresh bread and butter.',
      ambient: 'You hear the oven crackling and smell fresh bread...',
      icon: '🥐',
      color: 'from-amber-100 to-orange-100 text-amber-900',
      npc: {
        id: 'n1',
        name: isFrench ? 'Mme. Dupont' : isSpanish ? 'Sra. Garcia' : isItalian ? 'Sig.ra Rossi' : isPortuguese ? 'Sra. Silva' : 'Frau Müller',
        role: 'Baker',
        avatar: '👨‍🍳',
        persona: `You are a fast-paced, slightly impatient but ultimately kind baker in a local shop. There is a line of people behind the user. You expect them to order quickly. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour ! Qu\'est-ce que ce sera pour vous aujourd\'hui ?' :
                      isSpanish ? '¡Hola! ¿Qué le pongo hoy?' :
                      isItalian ? 'Buongiorno! Cosa le preparo oggi?' :
                      isPortuguese ? 'Bom dia! O que vai ser hoje?' :
                      'Guten Tag! Was darf es heute sein?',
      hint: isFrench ? 'Je voudrais un croissant, s\'il vous plaît.' :
            isSpanish ? 'Quisiera un cruasán, por favor.' :
            isItalian ? 'Vorrei un cornetto, per favore.' :
            isPortuguese ? 'Queria um croissant, por favor.' :
            'Ich hätte gerne ein Croissant, bitte.'
    },
    {
      id: 'prefecture',
      district: 'Services & Transit',
      name: isFrench ? 'La Préfecture' : isSpanish ? 'Oficina de Extranjería' : isItalian ? 'La Questura' : isPortuguese ? 'A Câmara Municipal' : 'Das Bürgeramt',
      description: 'A sterile government building with long lines.',
      ambient: 'Fluorescent lights buzz above as people shuffle papers...',
      icon: '🏢',
      color: 'from-slate-200 to-gray-200 text-slate-900',
      npc: {
        id: 'n2',
        name: isFrench ? 'M. Martin' : isSpanish ? 'Sr. López' : isItalian ? 'Sig. Bianchi' : isPortuguese ? 'Sr. Costa' : 'Herr Schmidt',
        role: 'Clerk',
        avatar: '👨‍💼',
        persona: `You are a strict, bureaucratic government clerk. The user is trying to register their address. You always ask for one more document that they probably don't have. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Suivant ! Bonjour. Avez-vous votre dossier complet pour l\'enregistrement ?' :
                      isSpanish ? '¡Siguiente! Hola. ¿Tiene su expediente completo para el registro?' :
                      isItalian ? 'Avanti! Buongiorno. Ha il fascicolo completo per la registrazione?' :
                      isPortuguese ? 'Próximo! Bom dia. Tem o seu processo completo para o registo?' :
                      'Der Nächste! Guten Tag. Haben Sie Ihre vollständigen Unterlagen für die Anmeldung?',
      hint: isFrench ? 'Oui, voici mes documents.' :
            isSpanish ? 'Sí, aquí están mis documentos.' :
            isItalian ? 'Sì, ecco i miei documenti.' :
            isPortuguese ? 'Sim, aqui estão os meus documentos.' :
            'Ja, hier sind meine Unterlagen.'
    },
    {
      id: 'apartment',
      district: 'Residential',
      name: isFrench ? 'L\'Appartement' : isSpanish ? 'El Apartamento' : isItalian ? 'L\'Appartamento' : isPortuguese ? 'O Apartamento' : 'Die Wohnung',
      description: 'The hallway of your new apartment building.',
      ambient: 'You hear faint music playing from down the hall...',
      icon: '🚪',
      color: 'from-stone-200 to-stone-300 text-stone-900',
      npc: {
        id: 'n3',
        name: isFrench ? 'Sylvie' : isSpanish ? 'Carmen' : isItalian ? 'Nonna Rosa' : isPortuguese ? 'Dona Maria' : 'Helga',
        role: 'Neighbor',
        avatar: '👵',
        persona: `You are the user's elderly neighbor. You are very curious, a bit gossipy, and want to know everything about the new person who just moved in. You speak casually and ask a lot of personal questions. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Oh, bonjour ! Vous êtes le nouveau locataire, n\'est-ce pas ?' :
                      isSpanish ? '¡Oh, hola! Eres el nuevo inquilino, ¿verdad?' :
                      isItalian ? 'Oh, buongiorno! Lei è il nuovo inquilino, vero?' :
                      isPortuguese ? 'Oh, olá! Você é o novo inquilino, não é?' :
                      'Oh, hallo! Sie sind der neue Mieter, nicht wahr?',
      hint: isFrench ? 'Oui, je viens d\'emménager.' :
            isSpanish ? 'Sí, me acabo de mudar.' :
            isItalian ? 'Sì, mi sono appena trasferito.' :
            isPortuguese ? 'Sim, acabei de me mudar.' :
            'Ja, ich bin gerade eingezogen.'
    },
    {
      id: 'cafe',
      district: 'Food & Dining',
      name: isFrench ? 'Le Café du Coin' : isSpanish ? 'El Café de la Esquina' : isItalian ? 'Il Caffè all\'Angolo' : isPortuguese ? 'O Café da Esquina' : 'Das Eckcafé',
      description: 'A bustling corner cafe with small round tables.',
      ambient: 'The espresso machine hisses over the hum of conversation...',
      icon: '☕',
      color: 'from-red-100 to-rose-100 text-red-900',
      npc: {
        id: 'n4',
        name: isFrench ? 'Luc' : isSpanish ? 'Mateo' : isItalian ? 'Marco' : isPortuguese ? 'João' : 'Lukas',
        role: 'Waiter',
        avatar: '🤵',
        persona: `You are a classic professional waiter. Brisk, efficient, and you don't have time for small talk. You want to take the order and move on. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour. Vous avez choisi ?' :
                      isSpanish ? 'Hola. ¿Ya sabe qué va a pedir?' :
                      isItalian ? 'Buongiorno. Ha deciso?' :
                      isPortuguese ? 'Bom dia. Já escolheu?' :
                      'Guten Tag. Haben Sie schon gewählt?',
      hint: isFrench ? 'Un café noir, s\'il vous plaît.' :
            isSpanish ? 'Un café solo, por favor.' :
            isItalian ? 'Un caffè, per favore.' :
            isPortuguese ? 'Um café, por favor.' :
            'Einen schwarzen Kaffee, bitte.'
    },
    {
      id: 'supermarket',
      district: 'Food & Dining',
      name: isFrench ? 'Le Supermarché' : isSpanish ? 'El Supermercado' : isItalian ? 'Il Supermercato' : isPortuguese ? 'O Supermercado' : 'Der Supermarkt',
      description: 'A busy supermarket with a long checkout line.',
      ambient: 'Beeping scanners and announcements over the PA system...',
      icon: '🛒',
      color: 'from-green-100 to-emerald-100 text-green-900',
      npc: {
        id: 'n5',
        name: isFrench ? 'Chloé' : isSpanish ? 'Sofía' : isItalian ? 'Giulia' : isPortuguese ? 'Ana' : 'Sophie',
        role: 'Cashier',
        avatar: '👩‍💻',
        persona: `You are a tired supermarket cashier. The line is long. You ask if they have a loyalty card and if they want a bag. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour. Vous avez la carte de fidélité ?' :
                      isSpanish ? 'Hola. ¿Tiene la tarjeta de cliente?' :
                      isItalian ? 'Buongiorno. Ha la carta fedeltà?' :
                      isPortuguese ? 'Olá. Tem o cartão de cliente?' :
                      'Hallo. Haben Sie eine Kundenkarte?',
      hint: isFrench ? 'Non, je ne l\'ai pas.' :
            isSpanish ? 'No, no la tengo.' :
            isItalian ? 'No, non ce l\'ho.' :
            isPortuguese ? 'Não, não tenho.' :
            'Nein, habe ich nicht.'
    },
    {
      id: 'doctor',
      district: 'Services & Transit',
      name: isFrench ? 'Le Médecin' : isSpanish ? 'El Médico' : isItalian ? 'Il Medico' : isPortuguese ? 'O Médico' : 'Die Arztpraxis',
      description: 'A quiet doctor\'s office waiting room.',
      ambient: 'Soft instrumental music plays while you wait...',
      icon: '🩺',
      color: 'from-blue-100 to-cyan-100 text-blue-900',
      npc: {
        id: 'n6',
        name: isFrench ? 'Dr. Laurent' : isSpanish ? 'Dr. Ruiz' : isItalian ? 'Dott. Romano' : isPortuguese ? 'Dr. Santos' : 'Dr. Weber',
        role: 'Doctor',
        avatar: '👩‍⚕️',
        persona: `You are a professional doctor. You are asking the patient about their symptoms and how long they have been feeling unwell. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour. Asseyez-vous, je vous en prie. Qu\'est-ce qui vous amène aujourd\'hui ?' :
                      isSpanish ? 'Hola. Siéntese, por favor. ¿Qué le trae por aquí hoy?' :
                      isItalian ? 'Buongiorno. Si accomodi, prego. Cosa la porta qui oggi?' :
                      isPortuguese ? 'Olá. Sente-se, por favor. O que o traz cá hoje?' :
                      'Guten Tag. Bitte setzen Sie sich. Was führt Sie heute zu mir?',
      hint: isFrench ? 'J\'ai mal à la tête depuis deux jours.' :
            isSpanish ? 'Me duele la cabeza desde hace dos días.' :
            isItalian ? 'Ho mal di testa da due giorni.' :
            isPortuguese ? 'Dói-me a cabeça há dois dias.' :
            'Ich habe seit zwei Tagen Kopfschmerzen.'
    },
    {
      id: 'train',
      district: 'Services & Transit',
      name: isFrench ? 'La Gare SNCF' : isSpanish ? 'La Estación de Tren' : isItalian ? 'La Stazione' : isPortuguese ? 'A Estação de Comboios' : 'Der Bahnhof',
      description: 'A massive train station with echoing announcements.',
      ambient: 'Trains screeching on tracks and echoing announcements...',
      icon: '🚆',
      color: 'from-indigo-100 to-blue-200 text-indigo-900',
      npc: {
        id: 'n7',
        name: isFrench ? 'Thomas' : isSpanish ? 'Diego' : isItalian ? 'Alessandro' : isPortuguese ? 'Tiago' : 'Felix',
        role: 'Ticket Agent',
        avatar: '🧑‍💼',
        persona: `You are a ticket agent at a busy train station. You need to know the user's destination, travel time, and if they have a discount card. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour. Pour quelle destination ?' :
                      isSpanish ? 'Hola. ¿Para qué destino?' :
                      isItalian ? 'Buongiorno. Per quale destinazione?' :
                      isPortuguese ? 'Bom dia. Para que destino?' :
                      'Guten Tag. Wohin möchten Sie reisen?',
      hint: isFrench ? 'Je voudrais un billet pour Lyon.' :
            isSpanish ? 'Quisiera un billete para Sevilla.' :
            isItalian ? 'Vorrei un biglietto per Firenze.' :
            isPortuguese ? 'Queria um bilhete para o Porto.' :
            'Ich hätte gerne ein Ticket nach München.'
    },
    {
      id: 'bistro',
      district: 'Food & Dining',
      name: isFrench ? 'Le Bistro' : isSpanish ? 'El Mesón' : isItalian ? 'La Trattoria' : isPortuguese ? 'A Tasca' : 'Das Wirtshaus',
      description: 'A loud, lively restaurant filled with locals.',
      ambient: 'Clinking glasses and loud laughter fill the room...',
      icon: '🍷',
      color: 'from-rose-200 to-pink-200 text-rose-900',
      npc: {
        id: 'n8',
        name: isFrench ? 'Antoine' : isSpanish ? 'Javier' : isItalian ? 'Luigi' : isPortuguese ? 'Carlos' : 'Maximilian',
        role: 'Waiter',
        avatar: '🧔',
        persona: `You are a boisterous waiter in a loud bistro. You don't have a written menu, you only tell the specials verbally and expect a quick choice. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Salut ! Aujourd\'hui on a le bœuf bourguignon ou le saumon. Qu\'est-ce qui vous fait plaisir ?' :
                      isSpanish ? '¡Hola! Hoy tenemos estofado de ternera o salmón. ¿Qué le apetece?' :
                      isItalian ? 'Ciao! Oggi abbiamo lo stufato di manzo o il salmone. Cosa le porto?' :
                      isPortuguese ? 'Olá! Hoje temos estufado de carne ou salmão. O que vai ser?' :
                      'Hallo! Heute haben wir Rindereintopf oder Lachs. Was darf ich Ihnen bringen?',
      hint: isFrench ? 'Je vais prendre le saumon.' :
            isSpanish ? 'Voy a pedir el salmón.' :
            isItalian ? 'Prendo il salmone.' :
            isPortuguese ? 'Vou querer o salmão.' :
            'Ich nehme den Lachs.'
    },
    {
      id: 'pharmacy',
      district: 'Services & Transit',
      name: isFrench ? 'La Pharmacie' : isSpanish ? 'La Farmacia' : isItalian ? 'La Farmacia' : isPortuguese ? 'A Farmácia' : 'Die Apotheke',
      description: 'A bright, clean pharmacy with a glowing green cross.',
      ambient: 'The quiet hum of the air conditioning and rustling of pill boxes...',
      icon: '💊',
      color: 'from-teal-100 to-emerald-200 text-teal-900',
      npc: {
        id: 'n9',
        name: isFrench ? 'Mme. Bernard' : isSpanish ? 'Sra. Fernández' : isItalian ? 'Dott.ssa Conti' : isPortuguese ? 'Dra. Ferreira' : 'Frau Wagner',
        role: 'Pharmacist',
        avatar: '💊',
        persona: `You are a helpful but clinical pharmacist. You need to know the user's symptoms to recommend medicine, or ask for their prescription. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Bonjour. Avez-vous une ordonnance ou cherchez-vous un conseil ?' :
                      isSpanish ? 'Hola. ¿Tiene receta o busca algún consejo?' :
                      isItalian ? 'Buongiorno. Ha una ricetta o cerca un consiglio?' :
                      isPortuguese ? 'Bom dia. Tem receita médica ou precisa de um conselho?' :
                      'Guten Tag. Haben Sie ein Rezept oder brauchen Sie eine Beratung?',
      hint: isFrench ? 'Je cherche quelque chose pour la toux.' :
            isSpanish ? 'Busco algo para la tos.' :
            isItalian ? 'Cerco qualcosa per la tosse.' :
            isPortuguese ? 'Procuro algo para a tosse.' :
            'Ich brauche etwas gegen Husten.'
    },
    {
      id: 'market',
      district: 'Food & Dining',
      name: isFrench ? 'Le Marché' : isSpanish ? 'El Mercado' : isItalian ? 'Il Mercato' : isPortuguese ? 'O Mercado' : 'Der Wochenmarkt',
      description: 'A vibrant outdoor market with colorful produce.',
      ambient: 'Vendors shouting their prices over the bustling crowd...',
      icon: '🍎',
      color: 'from-yellow-100 to-orange-200 text-yellow-900',
      npc: {
        id: 'n10',
        name: isFrench ? 'Gérard' : isSpanish ? 'Antonio' : isItalian ? 'Giuseppe' : isPortuguese ? 'Manuel' : 'Klaus',
        role: 'Vendor',
        avatar: '👨‍🌾',
        persona: `You are a loud, friendly outdoor market vendor selling fruits and vegetables. You try to upsell the user to buy more. You only speak in ${language}.`
      },
      initialMessage: isFrench ? 'Allez, regardez ces belles tomates ! Qu\'est-ce qu\'il vous faut aujourd\'hui ?' :
                      isSpanish ? '¡Venga, mire qué tomates tan hermosos! ¿Qué necesita hoy?' :
                      isItalian ? 'Forza, guardi che bei pomodori! Cosa le serve oggi?' :
                      isPortuguese ? 'Venha ver estes tomates lindos! O que precisa hoje?' :
                      'Kommen Sie, sehen Sie sich diese schönen Tomaten an! Was brauchen Sie heute?',
      hint: isFrench ? 'Je voudrais deux kilos de tomates.' :
            isSpanish ? 'Quisiera dos kilos de tomates.' :
            isItalian ? 'Vorrei due chili di pomodori.' :
            isPortuguese ? 'Queria dois quilos de tomates.' :
            'Ich hätte gerne zwei Kilo Tomaten.'
    }
  ];
};
