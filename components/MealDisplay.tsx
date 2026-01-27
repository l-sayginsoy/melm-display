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
    <div className="relative h-full w-full rounded-[2.5vh] overflow-hidden shadow-xl bg-slate-950 border border-white/5">
      {/* Reines Bild ohne Texte oder Begrüßungen */}
      <img 
        src={imageUrl} 
        alt="Aktueller Plan" 
        className="h-full w-full object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1000&auto=format&fit=crop';
        }}
      />
      
      {/* Sehr dezenter Hinweis nur bei manuellem Sonderplan */}
      {override?.active && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-[1vh] font-bold text-white/30 uppercase tracking-widest">Sonderplan</span>
        </div>
      )}
    </div>
  );
};

export default MealDisplay;