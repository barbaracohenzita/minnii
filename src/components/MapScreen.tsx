import { useState } from 'react';
import { motion } from 'motion/react';
import { Location, Message } from '../types';

interface MapScreenProps {
  key?: string;
  locations: Location[];
  completedLocations: string[];
  onSelectLocation: (id: string) => void;
  chats: Record<string, Message[]>;
  dailyChallenge?: { text: string; locationId: string };
  streak: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function MapScreen({ locations, completedLocations, onSelectLocation, chats, dailyChallenge, streak }: MapScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const districts = Array.from(new Set(locations.map(l => l.district)));
  const filters = ['All', ...districts];

  const filteredLocations = activeFilter === 'All' 
    ? locations 
    : locations.filter(l => l.district === activeFilter);

  const displayedDistricts = activeFilter === 'All' ? districts : [activeFilter];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold tracking-tight">City Map</h2>
          <p className="text-stone-500 text-lg">Explore and talk to locals.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="bg-white px-5 py-4 rounded-2xl shadow-sm border border-stone-200 flex items-center gap-3">
            <span className="text-2xl">🔥</span>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider text-stone-500 mb-1">Streak</div>
              <div className="font-bold text-stone-900 leading-none">{streak} Day{streak !== 1 ? 's' : ''}</div>
            </div>
          </div>
          
          <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-stone-200 flex-1">
            <div className="flex justify-between items-center mb-2 gap-4">
              <span className="font-bold text-xs uppercase tracking-wider text-stone-500">Journal Progress</span>
              <span className="font-bold text-stone-900 text-sm">{completedLocations.length} / {locations.length}</span>
            </div>
            <div className="w-full md:w-48 h-2 bg-stone-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(completedLocations.length / locations.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {dailyChallenge && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectLocation(dailyChallenge.locationId)}
          className="w-full bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-950 p-4 md:p-5 rounded-2xl shadow-sm border border-amber-300 flex items-center justify-between hover:shadow-md transition-all hover:scale-[1.01] text-left group"
        >
          <div className="flex items-center gap-4">
            <div className="bg-white/50 p-3 rounded-xl text-2xl group-hover:scale-110 transition-transform hidden sm:block">
              ⭐
            </div>
            <div>
              <div className="font-bold text-xs uppercase tracking-wider opacity-80 mb-1">Daily Challenge</div>
              <div className="text-lg font-medium leading-tight">{dailyChallenge.text}</div>
              <div className="text-sm font-medium opacity-75 mt-1.5 flex items-center gap-1">
                📍 {locations.find(l => l.id === dailyChallenge.locationId)?.name}
              </div>
            </div>
          </div>
          <div className="bg-white/40 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ml-4">
            Go →
          </div>
        </motion.button>
      )}

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2.5 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
              activeFilter === filter 
                ? 'bg-stone-900 text-white shadow-md' 
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-12">
        {displayedDistricts.map(district => (
          <div key={district} className="space-y-6">
            <h3 className="text-xl font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">{district}</h3>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredLocations.filter(l => l.district === district).map((loc) => {
                const isCompleted = completedLocations.includes(loc.id);
                const hasStarted = chats[loc.id] && chats[loc.id].length > 0;
                
                return (
                  <motion.button
                    variants={itemVariants}
                    key={loc.id}
                    onClick={() => onSelectLocation(loc.id)}
                    className={`relative flex flex-col items-start p-6 rounded-3xl text-left transition-all hover:scale-[1.02] hover:shadow-xl border bg-gradient-to-br shadow-sm overflow-hidden group ${
                      isCompleted 
                        ? 'from-emerald-50 to-emerald-100/80 border-emerald-300 text-emerald-950 ring-2 ring-emerald-500/20' 
                        : `border-white/50 ${loc.color}`
                    }`}
                  >
                    {!hasStarted && (
                      <span className="absolute top-4 right-4 bg-white/90 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm text-stone-700 tracking-wide">
                        NEW
                      </span>
                    )}
                    {isCompleted && (
                      <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 tracking-wide">
                        <span className="text-[10px]">✓</span> EXPLORED
                      </span>
                    )}
                    
                    <div className="text-6xl mb-4 bg-white/40 p-4 rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                      {loc.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{loc.name}</h3>
                      <p className="opacity-80 leading-relaxed text-sm">{loc.description}</p>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
