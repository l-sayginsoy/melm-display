
import React, { useMemo } from 'react';
import { WeeklyProgram as IWeeklyProgram } from '../types';
import { DAYS_ORDER } from '../constants';

const WeeklyProgram: React.FC<{ programs: IWeeklyProgram[] }> = ({ programs }) => {
  const now = new Date();
  const todayIndex = now.getDay(); 
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayStr = DAYS_ORDER[todayMapped];

  const weekDates = useMemo(() => {
    const d = new Date(now);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
    const monday = new Date(d.setDate(diff));
    
    return DAYS_ORDER.map((_, i) => {
      const dateObj = new Date(monday);
      dateObj.setDate(monday.getDate() + i);
      return dateObj.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) + '.';
    });
  }, [now]);

  const groupedPrograms = useMemo(() => {
    const groups: Record<string, IWeeklyProgram[]> = {};
    DAYS_ORDER.forEach(day => groups[day] = []);
    programs.forEach(p => {
      const dayKey = p.day.toUpperCase().substring(0, 2);
      if (groups[dayKey]) {
        groups[dayKey].push(p);
      }
    });
    return groups;
  }, [programs]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-3xl rounded-[3vh] border border-white/10 h-full p-[2.5vh] flex flex-col shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-[2vh] pb-[1.5vh] border-b border-white/5">
        <div>
          <h2 className="text-[2.8vh] font-black uppercase tracking-tight text-white leading-none">Wochenplan</h2>
          <p className="text-[1.3vh] font-bold text-indigo-400 mt-1 uppercase tracking-widest opacity-80">Veranstaltungen & Termine</p>
        </div>
        <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10">
          <span className="text-[1.4vh] font-bold text-white/40 tabular-nums uppercase">KW {Math.ceil(now.getDate() / 7)}</span>
        </div>
      </div>

      {/* Days List */}
      <div className="flex-1 flex flex-col justify-between gap-[0.5vh]">
        {DAYS_ORDER.map((day, idx) => {
          const isToday = day === todayStr;
          const dayPrograms = groupedPrograms[day];
          const calendarDate = weekDates[idx];

          return (
            <div 
              key={day} 
              className={`flex items-center gap-[1.5vw] px-[1.5vh] py-[0.8vh] rounded-[2vh] transition-all duration-500 ${
                isToday 
                ? 'bg-indigo-600/30 border border-indigo-500/50 shadow-[0_0_20px_rgba(79,70,229,0.2)]' 
                : 'bg-black/20 border border-transparent'
              }`}
            >
              {/* Left: Day/Date */}
              <div className="flex flex-col items-center justify-center min-w-[4.5vw] py-1">
                <span className={`text-[1.8vh] font-black leading-none ${isToday ? 'text-white' : 'text-white/40'}`}>
                  {day}
                </span>
                <span className={`text-[1.1vh] font-bold mt-1 tabular-nums ${isToday ? 'text-indigo-200/80' : 'text-white/20'}`}>
                  {calendarDate}
                </span>
              </div>

              {/* Center: Time Column (Larger & Centered) */}
              <div className="flex items-center justify-center min-w-[8.5vw] border-x border-white/5 px-2">
                {dayPrograms.length > 0 ? (
                  <span className={`text-[2.8vh] font-black tabular-nums tracking-tighter ${isToday ? 'text-white' : 'text-indigo-400/80'}`}>
                    {dayPrograms[0].time}
                  </span>
                ) : (
                  <div className="w-4 h-[2px] bg-white/10 rounded-full"></div>
                )}
              </div>

              {/* Right: Info Column */}
              <div className="flex-1 flex flex-col justify-center overflow-hidden pl-2">
                {dayPrograms.length > 0 ? (
                  <>
                    <span className={`text-[2.2vh] font-bold truncate leading-tight ${isToday ? 'text-white' : 'text-white/90'}`}>
                      {dayPrograms[0].title}
                    </span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[1.4vh] font-black uppercase tracking-widest ${isToday ? 'text-indigo-200' : 'text-white/30'}`}>
                        {dayPrograms[0].location || 'Kleiner Saal'}
                      </span>
                    </div>
                  </>
                ) : (
                  <span className="text-[1.5vh] font-medium tracking-wide text-white/5 uppercase italic">
                    Keine Einträge
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyProgram;
