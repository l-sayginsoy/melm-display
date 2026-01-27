import React from 'react';

const WeatherBackground: React.FC<{ code: number; isDay: boolean }> = ({ code, isDay }) => {
  const getBackgroundImage = () => {
    // Wetter-Mapping auf professionelle Unsplash-Bilder
    if (code >= 95) return 'https://images.unsplash.com/photo-1561484930-998b6a7b22e8?q=80&w=2000&auto=format&fit=crop'; // Gewitter
    if (code >= 71) return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=2000&auto=format&fit=crop'; // Schnee
    if (code >= 51 || (code >= 80 && code <= 82)) return 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop'; // Regen
    if (code >= 45 && code <= 48) return 'https://images.unsplash.com/photo-1487621167305-5d248087c724?q=80&w=2000&auto=format&fit=crop'; // Nebel
    if (code === 0) return isDay 
      ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2000&auto=format&fit=crop' // Sonnig Tag
      : 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=2000&auto=format&fit=crop'; // Klar Nacht
    
    // Bewölkt / Standard
    return isDay 
      ? 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop' 
      : 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&w=2000&auto=format&fit=crop';
  };

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950">
      {/* Hintergrundbild mit sanftem Fade */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-105"
        style={{ backgroundImage: `url('${getBackgroundImage()}')` }}
      />
      
      {/* Dunkleres Overlay für bessere Lesbarkeit der weißen Schrift */}
      <div className="absolute inset-0 bg-black/40 backdrop-brightness-75"></div>
      
      {/* Subtile Textur für den "High-End" Look */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
    </div>
  );
};

export default WeatherBackground;