
import React from 'react';

const WeatherBackground: React.FC<{ code: number; isDay: boolean }> = ({ code, isDay }) => {
  const getGradient = () => {
    if (code >= 95) return 'from-slate-900 to-indigo-950';
    if (code >= 71) return 'from-slate-100 to-slate-300';
    if (code >= 51) return 'from-blue-900 to-slate-900';
    if (code === 0) return isDay ? 'from-blue-400 to-blue-600' : 'from-indigo-900 to-slate-950';
    return isDay ? 'from-slate-800 to-slate-950' : 'from-slate-900 to-black';
  };

  return (
    <div className={`fixed inset-0 bg-gradient-to-br ${getGradient()} -z-10 transition-colors duration-1000`}>
      <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
    </div>
  );
};

export default WeatherBackground;
