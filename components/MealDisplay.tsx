
import React from 'react';
import { EventOverride } from '../types';
import { MEAL_SCHEDULE, DEFAULT_MEAL_IMAGE, GITHUB_RAW_BASE } from '../constants';

const MealDisplay: React.FC<{ override: EventOverride | null }> = ({ override }) => {
  const getCurrentMealImage = () => {
    if (override?.active && override.image) return override.image;
    
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
    
    const schedule = MEAL_SCHEDULE.find(s => timeStr >= s.start && timeStr <= s.end);
    return schedule ? schedule.file : DEFAULT_MEAL_IMAGE;
  };

  const imageFile = getCurrentMealImage();
  const imageUrl = `${GITHUB_RAW_BASE}${imageFile}`;

  return (
    <div className="relative h-full w-full rounded-[4vh] overflow-hidden shadow-2xl border border-white/10 bg-black/20 backdrop-blur-sm">
      <img 
        src={imageUrl} 
        alt="Meal Display" 
        className="h-full w-full object-cover transition-opacity duration-500"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1000&auto=format&fit=crop';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 flex flex-col justify-end p-[4vh]">
        {override?.active && (
          <div className="bg-red-600/90 backdrop-blur-md self-start px-4 py-2 rounded-xl mb-4 text-[2vh] font-black uppercase tracking-widest animate-pulse text-white shadow-lg">
            Sonderveranstaltung
          </div>
        )}
      </div>
    </div>
  );
};

export default MealDisplay;
