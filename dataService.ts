
import { GITHUB_FILES } from './constants';
import { EventOverride, WeeklyProgram } from './types';

export const fetchEventOverride = async (): Promise<EventOverride | null> => {
  try {
    const response = await fetch(`${GITHUB_FILES.event}?t=${Date.now()}`);
    if (!response.ok) return null;
    const text = await response.text();
    const lines = text.trim().split('\n');
    const data: Record<string, string> = {};
    
    lines.forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        data[key.trim()] = valueParts.join(':').trim();
      }
    });

    if (data.aktiv?.toLowerCase() === 'ja') {
      return {
        active: true,
        image: data.bild || null,
        start: data.start || null,
        end: data.ende || null
      };
    }
    return null;
  } catch {
    return null;
  }
};

export const fetchWeeklyProgram = async (): Promise<WeeklyProgram[]> => {
  try {
    const response = await fetch(`${GITHUB_FILES.wochenprogramm}?t=${Date.now()}`);
    if (!response.ok) return [];
    const text = await response.text();
    const lines = text.trim().split('\n');
    return lines.map(line => {
      const [day, title, location, time] = line.split('|');
      return { day, title, location, time };
    });
  } catch {
    return [];
  }
};

export const fetchQuote = async (): Promise<string> => {
  try {
    const response = await fetch(`${GITHUB_FILES.quotes}?t=${Date.now()}`);
    const quotes = await response.json();
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
    const quote = quotes[dayOfYear % quotes.length];
    return quote
      .replace(/Ã¤/g, 'ä')
      .replace(/Ã¶/g, 'ö')
      .replace(/Ã¼/g, 'ü')
      .replace(/ÃŸ/g, 'ß')
      .replace(/Ã"/g, 'Ä')
      .replace(/Ã–/g, 'Ö')
      .replace(/Ãœ/g, 'Ü');
  } catch {
    return "Willkommen im DRK Melm.";
  }
};
