import React from 'react';

const WeatherBackground: React.FC<{ code: number; isDay: boolean }> = ({ code, isDay }) => {
  const getBackgroundImage = () => {
    // WMO Wetter-Codes
    if (code >= 95) return 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=2000&auto=format&fit=crop'; // Gewitter
    if (code >= 71) return 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?q=80&w=2000&auto=format&fit=crop'; // Schnee
    if (code >= 51 || (code >= 80 && code <= 82)) {
        return isDay 
            ? 'https://images.unsplash.com/photo-1541339907198-e08756edd811?q=80&w=2000&auto=format&fit=crop' // Regen Tag
            : 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2000&auto=format&fit=crop'; // Regen Nacht
    }
    if (code >= 45 && code <= 48) return 'https://images.unsplash.com/photo-1494200483035-db7bc6aa5739?q=80&w=2000&auto=format&fit=crop'; // Nebel
    if (code === 0) return isDay 
        ? 'https://images.unsplash.com/photo-1470252649358-9694097567aa?q=80&w=2000&auto=format&fit=crop' // Sonne
        : 'https://images.unsplash.com/photo-1507499739999-097706ad8914?q=80&w=2000&auto=format&fit=crop'; // Nacht
    
    return isDay 
      ? 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=2000&auto=format&fit=crop' // Bewölkt Tag
      : 'https://images.unsplash.com/photo-1501436513145-30f24e19fcc8?q=80&w=2000&auto=format&fit=crop'; // Bewölkt Nacht
  };

  const isRainy = (code >= 51 && code <= 67) || (code >= 80 && code <= 82);
  const isSnowy = (code >= 71 && code <= 77) || code === 85 || code === 86;
  const isStormy = code >= 95;
  const isSunny = code === 0;
  const isCloudy = (code >= 1 && code <= 3) || (code >= 45 && code <= 48);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-slate-950 pointer-events-none">
      <style>{`
        @keyframes rain {
          0% { transform: translateY(-120vh) rotate(15deg); }
          100% { transform: translateY(120vh) rotate(15deg); }
        }
        @keyframes snow {
          0% { transform: translateY(-10vh) translateX(-20px); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(20px); opacity: 0.2; }
        }
        @keyframes sunGlow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        @keyframes cloudDrift {
          from { transform: translateX(-100%); }
          to { transform: translateX(200%); }
        }
        @keyframes lightning {
          0%, 95%, 100% { opacity: 0; }
          96% { opacity: 0.4; }
          97% { opacity: 0.1; }
          98% { opacity: 0.7; }
        }
        @keyframes zoomSlow {
          from { transform: scale(1); }
          to { transform: scale(1.1); }
        }

        .rain-drop {
          position: absolute;
          background: linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 100%);
          width: 1px;
          height: 100px;
          animation: rain linear infinite;
          will-change: transform;
        }
        .snow-flake {
          position: absolute;
          background: white;
          border-radius: 50%;
          animation: snow linear infinite;
          will-change: transform;
          filter: blur(1px);
        }
        .cloud-element {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
          border-radius: 50%;
          filter: blur(40px);
          animation: cloudDrift linear infinite;
          will-change: transform;
        }
      `}</style>

      {/* Haupt-Hintergrundbild mit sanftem Zoom */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-all duration-[3000ms] ease-in-out ${isDay ? 'brightness-110' : 'brightness-50 saturate-[0.8]'}`}
        style={{ 
          backgroundImage: `url('${getBackgroundImage()}')`,
          animation: 'zoomSlow 60s ease-in-out infinite alternate'
        }}
      />

      {/* SONNEN-EFFEKT (Nur wenn sonnig und Tag) */}
      {isSunny && isDay && (
        <div 
          className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-yellow-400/20 blur-[100px] z-10"
          style={{ animation: 'sunGlow 8s ease-in-out infinite' }}
        />
      )}

      {/* WOLKEN-EFFEKT (Dezentes Driften) */}
      {isCloudy && (
        <div className="absolute inset-0 z-0 opacity-40">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="cloud-element"
              style={{
                width: `${300 + Math.random() * 400}px`,
                height: `${200 + Math.random() * 300}px`,
                top: `${Math.random() * 60}%`,
                left: `-${Math.random() * 50}%`,
                animationDuration: `${60 + Math.random() * 60}s`,
                animationDelay: `${Math.random() * -60}s`
              }}
            />
          ))}
        </div>
      )}

      {/* REGEN-LAYER */}
      {isRainy && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Grauer Schleier */}
          <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
          {[...Array(80)].map((_, i) => (
            <div 
              key={i} 
              className="rain-drop"
              style={{
                left: `${Math.random() * 110 - 5}%`,
                top: `${Math.random() * -100}%`,
                animationDuration: `${0.5 + Math.random() * 0.4}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: Math.random() * 0.5
              }}
            />
          ))}
        </div>
      )}

      {/* SCHNEE-LAYER */}
      {isSnowy && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div 
              key={i} 
              className="snow-flake"
              style={{
                width: `${4 + Math.random() * 6}px`,
                height: `${4 + Math.random() * 6}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * -10}%`,
                animationDuration: `${8 + Math.random() * 7}s`,
                animationDelay: `${Math.random() * -10}s`,
                opacity: Math.random() * 0.6 + 0.2
              }}
            />
          ))}
        </div>
      )}

      {/* GEWITTER-BLITZE */}
      {isStormy && (
        <div 
          className="absolute inset-0 bg-white z-20" 
          style={{ animation: 'lightning 8s infinite' }} 
        />
      )}

      {/* Globale Overlays für Lesbarkeit und Tag/Nacht */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[2000ms] ${
          isDay ? 'bg-gradient-to-b from-black/10 via-transparent to-black/40' : 'bg-black/60'
        }`} 
      />
      
      {/* Vignetten-Effekt für Fokus auf Content */}
      <div className="absolute inset-0 shadow-[inner_0_0_150px_rgba(0,0,0,0.5)]" />
    </div>
  );
};

export default WeatherBackground;