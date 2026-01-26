
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
      
      if (data.current) {
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
    <div className="relative h-screen w-screen flex flex-col overflow-hidden text-white bg-slate-950">
      <WeatherBackground code={weather?.code ?? 0} isDay={weather?.isDay ?? true} />
      
      <div className="fixed inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40 -z-[5] pointer-events-none"></div>

      {/* Header - Height reduced for more compact look */}
      <header className="h-[12vh] flex items-end px-[4vw] pb-[2vh]">
        <div className="flex items-center gap-[2vw]">
          <div className="text-[7.5vh] font-black tracking-tighter leading-none filter drop-shadow-[0_8px_8px_rgba(0,0,0,0.5)]">
            {time.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="h-[5vh] w-[2px] bg-white/20 rounded-full mx-1"></div>
          <div className="flex flex-col justify-center">
            <div className="text-[3vh] font-black uppercase tracking-tighter text-white leading-none mb-0.5">
              {time.toLocaleDateString('de-DE', { weekday: 'long' })}
            </div>
            <div className="text-[1.8vh] font-bold text-white/50 tracking-[0.1em] uppercase">
              {time.toLocaleDateString('de-DE', { day: '2-digit', month: 'long' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Height increased to fill the space gained from header */}
      <main className="h-[78vh] flex px-[4vw] pt-[1vh] pb-[4vh] gap-[3.5vw] items-stretch">
        <div className="flex-[1.6] h-full">
           <MealDisplay override={override} />
        </div>
        <div className="flex-[0.9] h-full">
          <WeeklyProgram programs={programs} />
        </div>
      </main>

      {/* Footer */}
      <footer className="h-[10vh] bg-white text-slate-900 flex items-center justify-between px-[2vw] z-20 relative shadow-[0_-20px_60px_rgba(0,0,0,0.2)] border-t border-slate-50">
        <div className="flex items-center">
          {weather && (
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <div className="flex items-center gap-4">
                  <span className="text-[5.2vh] leading-none drop-shadow-sm">{mapWeatherCode(weather.code).icon}</span>
                  <span className="text-[4.2vh] font-black tracking-tighter leading-none text-slate-900">{weather.temp}°</span>
                </div>
                <div className="mt-1">
                  <span className="text-[0.9vh] font-black tracking-[0.15em] text-[#4A9EFF] uppercase">Ludwigshafen / Melm</span>
                </div>
              </div>
              <div className="flex gap-1">
                {weather.forecast.map((f, i) => (
                  <div key={i} className="flex flex-col items-center w-[3vw] justify-center text-center">
                    <span className="text-[0.8vh] font-black text-slate-300 uppercase tracking-[0.2em] mb-1 leading-none">{f.day}</span>
                    <span className="text-[2.2vh] leading-none mb-1 flex items-center justify-center h-[2.5vh]">{f.icon}</span>
                    <span className="text-[1.3vh] font-black text-slate-700 tabular-nums leading-none">{f.max}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-center px-6 overflow-hidden text-center">
          <p className="text-[2.2vh] font-medium italic text-slate-400 leading-snug tracking-tight max-w-[95%] line-clamp-2">
            "{quote}"
          </p>
        </div>

        <div className="flex justify-end pr-1">
          <img 
            src="https://raw.githubusercontent.com/l-sayginsoy/melm-display/main/DRK-Logo_lang_RGB.png" 
            alt="DRK Logo" 
            className="h-[4.2vh] w-auto object-contain opacity-90"
          />
        </div>
      </footer>
    </div>
  );
};

export default App;
