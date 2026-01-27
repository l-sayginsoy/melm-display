
import React, { useState, useEffect, useCallback } from 'react';
import WeatherBackground from './components/WeatherBackground';
import WeeklyProgram from './components/WeeklyProgram';
import MealDisplay from './components/MealDisplay';
import { fetchEventOverride, fetchWeeklyProgram, fetchQuote } from './dataService';
import { WeeklyProgram as IWeeklyProgram, EventOverride, WeatherData } from './types';
import { mapWeatherCode, GITHUB_RAW_BASE } from './constants';

const App: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [programs, setPrograms] = useState<IWeeklyProgram[]>([]);
  const [override, setOverride] = useState<EventOverride | null>(null);
  const [quote, setQuote] = useState("Willkommen im DRK Melm.");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [logoError, setLogoError] = useState(false);

  const updateAllData = useCallback(async () => {
    try {
      const [p, o, q] = await Promise.all([
        fetchWeeklyProgram(),
        fetchEventOverride(),
        fetchQuote()
      ]);
      setPrograms(p || []);
      setOverride(o);
      if (q && q.trim().length > 0) setQuote(q);
    } catch (err) {
      console.error("Data update failed", err);
    }
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
    return () => { 
      clearInterval(tInterval); 
      clearInterval(dInterval); 
      clearInterval(wInterval); 
    };
  }, [updateAllData, fetchWeather]);

  const isDay = weather?.isDay ?? true;

  return (
    <div className="relative h-screen w-screen overflow-hidden text-white font-['Inter'] bg-slate-950">
      {/* Hintergrund (Ganz hinten) */}
      <WeatherBackground code={weather?.code ?? 0} isDay={isDay} />

      {/* Header Bereich */}
      <header className="relative h-[12vh] flex items-end px-[4vw] pb-[2vh] z-10">
        <div className="flex items-center gap-[2.5vw]">
          <div className="text-[8.5vh] font-[900] tracking-tighter leading-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
            {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="h-[5.5vh] w-[3px] bg-white/40 rounded-full mx-1"></div>
          <div className="flex flex-col filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            <div className="text-[3.2vh] font-black uppercase tracking-tighter leading-none mb-0.5">
              {time.toLocaleDateString('de-DE', { weekday: 'long' })}
            </div>
            <div className="text-[1.8vh] font-semibold text-white/90 tracking-widest uppercase">
              {time.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Bereich */}
      <main className="relative h-[79vh] flex px-[4vw] pt-[2vh] pb-[4vh] gap-[3vw] min-h-0 z-10 overflow-hidden">
        <div className="flex-[1.6] h-full overflow-hidden">
           <MealDisplay override={override} />
        </div>
        <div className="flex-[0.9] h-full overflow-hidden">
          <WeeklyProgram programs={programs} />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 h-[9vh] bg-white text-slate-900 flex items-center justify-between px-[3vw] z-[999] shadow-[0_-10px_40px_rgba(0,0,0,0.3)] border-t border-slate-200">
        
        {/* Wetter Infos (Links) */}
        <div className="w-[30%] flex items-center shrink-0">
          {weather && (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[5vh] leading-none">{mapWeatherCode(weather.code).icon}</span>
                <div className="flex flex-col">
                  <span className="text-[3.5vh] font-black tracking-tighter leading-none text-slate-900">{weather.temp}°</span>
                  <span className="text-[1vh] font-bold text-slate-900 uppercase tracking-widest mt-0.5">Ludwigshafen</span>
                </div>
              </div>
              <div className="h-[4vh] w-px bg-slate-200"></div>
              <div className="flex gap-3">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[0.7vh] font-bold text-slate-900 uppercase leading-none mb-1 opacity-60">{f.day}</span>
                    <span className="text-[2.2vh] leading-none mb-1">{f.icon}</span>
                    <span className="text-[1.1vh] font-black text-slate-900 leading-none">{f.max}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zitat (Mitte) */}
        <div className="flex-1 flex justify-center px-10">
          <p className="text-[2.2vh] font-bold italic text-slate-700 leading-tight text-center line-clamp-2">
            "{quote}"
          </p>
        </div>

        {/* Logo (Rechts) */}
        <div className="w-[30%] flex justify-end items-center shrink-0">
          {!logoError ? (
            <img 
              src={`${GITHUB_RAW_BASE}DRK-Logo_lang_RGB.png`} 
              alt="DRK Logo" 
              className="h-[4vh] w-auto object-contain block"
              onError={() => {
                console.error("Logo blockiert, wechsle zu Text-Fallback");
                setLogoError(true);
              }}
            />
          ) : (
            /* Hochwertiges Text-Fallback falls das Bild nicht lädt */
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[2.5vh] font-black text-red-600 leading-none tracking-tighter">DRK</span>
                <span className="text-[0.9vh] font-bold text-slate-500 uppercase tracking-[0.2em] leading-none mt-1">Begegnungsstätte</span>
              </div>
              <div className="w-[1.5vh] h-[4vh] bg-red-600 rounded-sm"></div>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
};

export default App;
