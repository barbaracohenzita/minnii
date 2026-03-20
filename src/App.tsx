import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MapScreen } from './components/MapScreen';
import { LocationScreen } from './components/LocationScreen';
import { AppState, Message, Language, SavedWord } from './types';
import { getLocations, getDailyChallenge } from './data/locations';
import { generateReply, translateWord } from './services/gemini';
import { Globe, BookOpen, X } from 'lucide-react';

const LANGUAGE_FLAGS: Record<Language, string> = {
  French: '🇫🇷',
  Spanish: '🇪🇸',
  Italian: '🇮🇹',
  Portuguese: '🇵🇹',
  German: '🇩🇪'
};

const WELCOME_MESSAGES: Record<Language, { title: string, subtitle: string }> = {
  French: { title: 'Bienvenue à Paris!', subtitle: 'You just moved here. Survive daily life in French.' },
  Spanish: { title: '¡Bienvenido a Madrid!', subtitle: 'You just moved here. Survive daily life in Spanish.' },
  Italian: { title: 'Benvenuto a Roma!', subtitle: 'You just moved here. Survive daily life in Italian.' },
  Portuguese: { title: 'Bem-vindo a Lisboa!', subtitle: 'You just moved here. Survive daily life in Portuguese.' },
  German: { title: 'Willkommen in Berlin!', subtitle: 'You just moved here. Survive daily life in German.' }
};

const OnboardingModal = ({ onComplete, onSelectLanguage, currentLanguage }: { onComplete: () => void, onSelectLanguage: (lang: Language) => void, currentLanguage: Language }) => {
  const [step, setStep] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center space-y-6"
      >
        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold mb-6">Choose your language</h2>
            <div className="grid grid-cols-2 gap-3">
              {(Object.keys(LANGUAGE_FLAGS) as Language[]).map(lang => (
                <button
                  key={lang}
                  onClick={() => {
                    onSelectLanguage(lang);
                    setStep(2);
                  }}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${currentLanguage === lang ? 'border-blue-500 bg-blue-50' : 'border-stone-200 hover:border-blue-300 hover:bg-stone-50'}`}
                >
                  <span className="text-4xl">{LANGUAGE_FLAGS[lang]}</span>
                  <span className="font-bold text-stone-700">{lang}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl mb-2">{LANGUAGE_FLAGS[currentLanguage]}</div>
            <h2 className="text-3xl font-bold">{WELCOME_MESSAGES[currentLanguage].title}</h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              {WELCOME_MESSAGES[currentLanguage].subtitle}
            </p>
            <button
              onClick={onComplete}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Start Exploring
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

const initialState: AppState = {
  view: 'map',
  targetLanguage: 'French',
  currentLocationId: null,
  chats: {
    French: {},
    Spanish: {},
    Italian: {},
    Portuguese: {},
    German: {}
  },
  completedLocations: {
    French: [],
    Spanish: [],
    Italian: [],
    Portuguese: [],
    German: []
  },
  savedWords: [],
  hasSeenWelcome: false,
  isWordsModalOpen: false,
  streak: 1,
  lastSessionDate: null,
  xp: 0,
};

export default function App() {
  const [toast, setToast] = useState<string | null>(null);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('lingolife-state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure dates are parsed correctly
        if (parsed.chats) {
          Object.values(parsed.chats).forEach((langChats: any) => {
            Object.values(langChats).forEach((messages: any) => {
              messages.forEach((m: any) => m.timestamp = new Date(m.timestamp));
            });
          });
        }
        return { ...initialState, ...parsed, view: 'map', currentLocationId: null };
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('lingolife-state', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastSessionDate === today) return prev;
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const isConsecutive = prev.lastSessionDate === yesterday.toDateString();
      const newStreak = isConsecutive ? prev.streak + 1 : 1;
      
      return {
        ...prev,
        streak: newStreak,
        lastSessionDate: today
      };
    });
  }, []);

  const locations = getLocations(state.targetLanguage);

  const handleEnterLocation = (locationId: string) => {
    setState((prev) => {
      const location = locations.find(l => l.id === locationId);
      const langChats = prev.chats[prev.targetLanguage] || {};
      const isNewChat = !langChats[locationId] || langChats[locationId].length === 0;
      
      return {
        ...prev,
        view: 'location',
        currentLocationId: locationId,
        chats: {
          ...prev.chats,
          [prev.targetLanguage]: {
            ...langChats,
            ...(isNewChat && location ? {
              [locationId]: [{
                id: Date.now().toString(),
                senderId: location.npc.id,
                text: location.initialMessage,
                timestamp: new Date()
              }]
            } : {})
          }
        }
      };
    });
  };

  const handleLeaveLocation = () => {
    setState({ ...state, view: 'map', currentLocationId: null });
  };

  const handleSendMessage = async (text: string) => {
    const locationId = state.currentLocationId;
    const lang = state.targetLanguage;
    if (!locationId) return;

    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      text,
      timestamp: new Date(),
    };

    setState((prev) => {
      const langChats = prev.chats[lang] || {};
      const currentChat = [...(langChats[locationId] || []), userMessage];
      const userMessageCount = currentChat.filter(m => m.senderId === 'user').length;

      const completedLangs = prev.completedLocations[lang] || [];
      const justCompleted = userMessageCount >= 3 && !completedLangs.includes(locationId);
      const newCompleted = justCompleted
        ? [...completedLangs, locationId]
        : completedLangs;

      const xpGain = justCompleted ? 50 : 10;

      if (justCompleted) {
        setToast('Location explored! +50 XP');
        setTimeout(() => setToast(null), 2000);
      } else {
        setToast('+10 XP');
        setTimeout(() => setToast(null), 1500);
      }

      return {
        ...prev,
        xp: prev.xp + xpGain,
        chats: {
          ...prev.chats,
          [lang]: {
            ...langChats,
            [locationId]: currentChat,
          }
        },
        completedLocations: {
          ...prev.completedLocations,
          [lang]: newCompleted
        }
      };
    });

    const currentChat = [...(state.chats[lang]?.[locationId] || []), userMessage];
    
    const replyText = await generateReply(lang, location, currentChat);

    const npcMessage: Message = {
      id: (Date.now() + 1).toString(),
      senderId: location.npc.id,
      text: replyText,
      timestamp: new Date(),
    };

    setState((prev) => {
      const langChats = prev.chats[lang] || {};
      return {
        ...prev,
        chats: {
          ...prev.chats,
          [lang]: {
            ...langChats,
            [locationId]: [...(langChats[locationId] || []), npcMessage],
          }
        }
      };
    });
  };

  const handleLanguageChange = (lang: Language) => {
    setState(prev => ({ 
      ...prev, 
      targetLanguage: lang, 
      view: 'map', 
      currentLocationId: null,
      hasSeenWelcome: false // Show welcome again for new language
    }));
  };

  const handleWordClick = async (word: string) => {
    const cleanWord = word.toLowerCase();
    if (state.savedWords.some(w => w.word.toLowerCase() === cleanWord && w.language === state.targetLanguage)) {
      setToast(`"${cleanWord}" is already saved!`);
      setTimeout(() => setToast(null), 2000);
      return;
    }

    setToast(`Translating "${cleanWord}"...`);
    const translation = await translateWord(cleanWord, state.targetLanguage);
    
    const newWord: SavedWord = {
      id: Date.now().toString(),
      word: cleanWord,
      translation,
      language: state.targetLanguage
    };

    setState(prev => ({
      ...prev,
      savedWords: [newWord, ...prev.savedWords]
    }));
    
    setToast(`Saved: ${cleanWord} = ${translation}`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleReaction = (messageId: string, reaction: string) => {
    const locationId = state.currentLocationId;
    const lang = state.targetLanguage;
    if (!locationId) return;

    setState((prev) => {
      const langChats = prev.chats[lang] || {};
      const currentChat = langChats[locationId] || [];
      
      const updatedChat = currentChat.map(msg => 
        msg.id === messageId ? { ...msg, reaction } : msg
      );

      return {
        ...prev,
        chats: {
          ...prev.chats,
          [lang]: {
            ...langChats,
            [locationId]: updatedChat,
          }
        }
      };
    });
  };

  const currentLocation = locations.find(l => l.id === state.currentLocationId);
  const currentChats = state.chats[state.targetLanguage] || {};
  const completed = state.completedLocations[state.targetLanguage] || [];
  const currentLangWords = state.savedWords.filter(w => w.language === state.targetLanguage);

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-amber-200">
      <header className="bg-white border-b border-stone-200 px-4 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-3 sm:gap-6">
          <h1 className="text-xl sm:text-2xl font-black tracking-tighter">
            <span className="text-stone-900">Lingo</span>
            <span className="text-blue-600">Life</span>
          </h1>

          <div className="relative group">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-stone-100 hover:bg-stone-200 transition-colors border border-stone-200 rounded-full px-3 sm:px-4 py-1.5 cursor-pointer">
              <Globe size={16} className="text-stone-500 hidden sm:block" />
              <span className="text-lg">{LANGUAGE_FLAGS[state.targetLanguage]}</span>
              <select
                value={state.targetLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="bg-transparent border-none text-sm font-bold text-stone-700 focus:ring-0 outline-none cursor-pointer appearance-none pr-4"
              >
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="Italian">Italian</option>
                <option value="Portuguese">Portuguese</option>
                <option value="German">German</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <motion.div
            key={state.xp}
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-full px-4 py-1.5 shadow-sm"
          >
            <span className="text-lg">⭐</span>
            <div className="flex flex-col items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 leading-none">XP</span>
              <span className="text-sm font-black text-amber-900 leading-none">{state.xp}</span>
            </div>
          </motion.div>
        </div>
        
        <div className="flex items-center gap-4">
          {state.view === 'map' && (
            <button
              onClick={() => setState(prev => ({ ...prev, isWordsModalOpen: true }))}
              className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium transition-colors border border-blue-200"
            >
              <BookOpen size={18} />
              My Words
              {currentLangWords.length > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-1">
                  {currentLangWords.length}
                </span>
              )}
            </button>
          )}
          {state.view === 'location' && (
            <button 
              onClick={handleLeaveLocation}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
            >
              ← Back to Map
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 relative">
        <AnimatePresence mode="wait">
          {state.view === 'map' && (
            <MapScreen 
              key="map" 
              locations={locations} 
              completedLocations={completed}
              onSelectLocation={handleEnterLocation} 
              chats={currentChats}
              dailyChallenge={getDailyChallenge(state.targetLanguage)}
              streak={state.streak}
            />
          )}
          {state.view === 'location' && currentLocation && (
            <LocationScreen 
              key="location" 
              location={currentLocation} 
              messages={currentChats[currentLocation.id] || []}
              isCompleted={completed.includes(currentLocation.id)}
              onSendMessage={handleSendMessage}
              onWordClick={handleWordClick}
              onReaction={handleReaction}
            />
          )}
        </AnimatePresence>

        {/* Welcome Overlay */}
        <AnimatePresence>
          {!state.hasSeenWelcome && state.view === 'map' && (
            <OnboardingModal 
              onComplete={() => setState(prev => ({ ...prev, hasSeenWelcome: true }))}
              onSelectLanguage={(lang) => handleLanguageChange(lang)}
              currentLanguage={state.targetLanguage}
            />
          )}
        </AnimatePresence>

        {/* Words Modal */}
        <AnimatePresence>
          {state.isWordsModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-stone-50">
                  <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-600" />
                    <h2 className="text-2xl font-bold">My Words</h2>
                  </div>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, isWordsModalOpen: false }))}
                    className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                  >
                    <X size={24} className="text-stone-500" />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                  {currentLangWords.length === 0 ? (
                    <div className="text-center py-12 text-stone-500">
                      <div className="text-4xl mb-4">👆</div>
                      <p className="text-lg">Tap any word in a conversation<br/>to save it here!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentLangWords.map(word => (
                        <div key={word.id} className="flex justify-between items-center p-4 rounded-2xl bg-stone-50 border border-stone-200">
                          <span className="text-lg font-bold text-stone-900">{word.word}</span>
                          <span className="text-stone-600 font-medium">{word.translation}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-6 py-3 rounded-full shadow-2xl font-medium z-50 flex items-center gap-2"
            >
              <span className="text-emerald-400 text-xl">✓</span>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
