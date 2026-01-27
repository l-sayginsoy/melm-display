import React from 'react';
import { WeeklyProgram as IWeeklyProgram } from '../types';
import { DAYS_ORDER } from '../constants';

const WeeklyProgram: React.FC<{ programs: IWeeklyProgram[] }> = ({ programs }) => {
  const now = new Date();
  
  const getWeekNumber = (d: Date) => {
    const target = new Date(d.valueOf());
    const dayNr = (d.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const getMonday = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const result = new Date(d);
    result.setDate(diff);
    return result;
  };

  const monday = getMonday(new Date(now));
  const todayIndex = now.getDay(); 
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1;
  const todayStr = DAYS_ORDER[todayMapped];
  const kw = getWeekNumber(now);

  const groupedPrograms = programs.reduce((acc, p) => {
    const dayKey = p.day.toUpperCase().substring(0, 2);
    if (!acc[dayKey]) acc[dayKey] = [];
    acc[dayKey].push(p);
    return acc;
  }, {} as Record<string, IWeeklyProgram[]>);

  return (
    <div className="bg-slate-900/40 backdrop-blur-md rounded-[2vh] border border-white/10 h-full p-[2vh] flex flex-col shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-[1.5vh] px-1 shrink-0">
        <h2 className="text-[1.6vh] font-bold text-slate-400 uppercase tracking-[0.2em]">Wochenplan</h2>
        <span className="text-[1.1vh] font-semibold text-slate-600 uppercase tracking-widest">KW {kw}</span>
      </div>

      {/* Tage-Liste: flex-1 auf den Containern sorgt für gleichmäßige Verteilung ohne Scrollen */}
      <div className="flex-1 flex flex-col gap-[0.8vh] min-h-0">
        {DAYS_ORDER.map((day, index) => {
          const isToday = day === todayStr;
          const dayPrograms = groupedPrograms[day] || [];
          
          const dateOfRow = new Date(monday);
          dateOfRow.setDate(monday.getDate() + index);
          const dateStr = dateOfRow.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' });

          return (
            <div 
              key={day} 
              className={`flex items-center flex-1 min-h-0 px-[1.5vh] rounded-lg border transition-colors ${
                isToday 
                ? 'bg-blue-600/15 border-blue-500/40' 
                : 'bg-white/[0.02] border-white/5'
              }`}
            >
              {/* Datum */}
              <div className="w-[4vw] shrink-0">
                <div className={`text-[1.5vh] font-bold ${isToday ? 'text-blue-400' : 'text-slate-200'}`}>{day}</div>
                <div className="text-[0.9vh] text-slate-600 font-medium tabular-nums uppercase">{dateStr}</div>
              </div>

              {/* Uhrzeit */}
              <div className="w-[5.5vw] shrink-0 px-2 border-l border-white/5 text-center">
                {dayPrograms.length > 0 ? (
                  <span className={`text-[1.7vh] font-semibold tabular-nums ${isToday ? 'text-white' : 'text-slate-400'}`}>
                    {dayPrograms[0].time}
                  </span>
                ) : (
                  <span className="text-slate-800 text-[1.4vh] opacity-30">—</span>
                )}
              </div>

              {/* Event-Titel */}
              <div className="flex-1 min-w-0 pl-4 border-l border-white/5">
                {dayPrograms.length > 0 ? (
                  <h3 className={`text-[1.6vh] font-medium truncate ${isToday ? 'text-white' : 'text-slate-300'}`}>
                    {dayPrograms[0].title}
                  </h3>
                ) : (
                  <span className="text-[1.3vh] text-slate-800 font-normal">Keine Termine</span>
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