import React, { useState, useEffect, useCallback } from 'react';
import WeatherBackground from './components/WeatherBackground';
import WeeklyProgram from './components/WeeklyProgram';
import MealDisplay from './components/MealDisplay';
import { fetchEventOverride, fetchWeeklyProgram, fetchQuote } from './dataService';
import { WeeklyProgram as IWeeklyProgram, EventOverride, WeatherData } from './types';
import { mapWeatherCode } from './constants';

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [programs, setPrograms] = useState<IWeeklyProgram[]>([]);
  const [override, setOverride] = useState<EventOverride | null>(null);
  const [quote, setQuote] = useState("");
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const updateAllData = useCallback(async () => {
    const [p, o, q] = await Promise.all([
      fetchWeeklyProgram(),
      fetchEventOverride(),
      fetchQuote()
    ]);
    setPrograms(p);
    setOverride(o);
    setQuote(q);
  }, []);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=49.49&longitude=8.38&current=temperature_2m,is_day,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Europe/Berlin&forecast_days=4');
      const data = await res.json();
      
      if (data.current && data.daily) {
        const { condition } = mapWeatherCode(data.current.weather_code);
        const dayNames = ['SO', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA'];
        const forecast = [];
        
        for (let i = 1; i <= 3; i++) {
          const d = new Date();
          d.setDate(d.getDate() + i);
          forecast.push({
            day: dayNames[d.getDay()],
            icon: mapWeatherCode(data.daily.weather_code[i]).icon,
            max: Math.round(data.daily.temperature_2m_max[i]),
            min: Math.round(data.daily.temperature_2m_min[i])
          });
        }

        setWeather({
          temp: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
          isDay: data.current.is_day === 1,
          condition,
          max: Math.round(data.daily.temperature_2m_max[0]),
          min: Math.round(data.daily.temperature_2m_min[0]),
          forecast
        });
      }
    } catch (e) {
      console.error('Weather error:', e);
    }
  }, []);

  useEffect(() => {
    updateAllData();
    fetchWeather();
    const tInterval = setInterval(() => setTime(new Date()), 1000);
    const dInterval = setInterval(updateAllData, 300000);
    const wInterval = setInterval(fetchWeather, 900000);
    return () => { clearInterval(tInterval); clearInterval(dInterval); clearInterval(wInterval); };
  }, [updateAllData, fetchWeather]);

  return (
    <div className="relative h-screen w-screen flex flex-col overflow-hidden text-white font-['Inter']">
      <WeatherBackground code={weather?.code ?? 0} isDay={weather?.isDay ?? true} />
      
      {/* Sanfter Kontrast-Gradient oben/unten */}
      <div className="fixed inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 -z-[5] pointer-events-none"></div>

      {/* Header - 12vh */}
      <header className="h-[12vh] flex items-end px-[4vw] pb-[2vh] shrink-0">
        <div className="flex items-center gap-[2.5vw]">
          <div className="text-[8vh] font-[900] tracking-tighter leading-none drop-shadow-2xl">
            {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="h-[5.5vh] w-[3px] bg-white/30 rounded-full"></div>
          <div className="flex flex-col">
            <div className="text-[3.2vh] font-black uppercase tracking-tighter leading-none mb-0.5">
              {time.toLocaleDateString('de-DE', { weekday: 'long' })}
            </div>
            <div className="text-[1.8vh] font-semibold text-white/70 tracking-widest uppercase">
              {time.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 81.5vh (Platz für den schmaleren Footer) */}
      <main className="h-[81.5vh] flex px-[4vw] pt-[1vh] pb-[3.5vh] gap-[3vw] items-stretch min-h-0">
        <div className="flex-[1.6] h-full">
           <MealDisplay override={override} />
        </div>
        <div className="flex-[0.9] h-full">
          <WeeklyProgram programs={programs} />
        </div>
      </main>

      {/* Footer - Edler Glassmorphism-Stil, reduziert auf 6.5vh */}
      <footer className="h-[6.5vh] bg-white/90 backdrop-blur-md text-slate-900 flex items-center justify-between px-[3vw] z-20 relative border-t border-white/20 shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
        
        {/* Wetter Kompakt */}
        <div className="w-[28%] flex items-center gap-6">
          {weather && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-[4vh] leading-none drop-shadow-sm">{mapWeatherCode(weather.code).icon}</span>
                <div className="flex flex-col justify-center">
                  <span className="text-[3.2vh] font-black tracking-tighter leading-none">{weather.temp}°</span>
                  <span className="text-[0.8vh] font-black tracking-[0.15em] text-blue-600 uppercase">Ludwigshafen</span>
                </div>
              </div>
              <div className="h-[3vh] w-[1px] bg-slate-200"></div>
              <div className="flex gap-2">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="flex flex-col items-center w-[2vw]">
                    <span className="text-[0.7vh] font-bold text-slate-400 uppercase mb-0.5">{f.day}</span>
                    <span className="text-[1.8vh] leading-none mb-1">{f.icon}</span>
                    <span className="text-[1vh] font-bold text-slate-800 tabular-nums">{f.max}°</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Quote - Eleganter zentriert */}
        <div className="flex-1 flex justify-center px-10">
          <p className="text-[1.7vh] font-medium italic text-slate-500 leading-tight text-center max-w-[90%] line-clamp-1">
            "{quote}"
          </p>
        </div>

        {/* Logo - Verkleinert & Diskret */}
        <div className="w-[28%] flex justify-end items-center">
          <img 
            src="https://raw.githubusercontent.com/l-sayginsoy/melm-display/main/DRK-Logo_lang_RGB.png" 
            alt="DRK Logo" 
            className="h-[2.5vh] w-auto object-contain opacity-90"
          />
        </div>
      </footer>
    </div>
  );
};

export default App;