import { Battery, Wifi, Signal } from 'lucide-react';
import { useEffect, useState } from 'react';

export function StatusBar({ isDark }: { isDark?: boolean }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const textColor = isDark ? 'text-white' : 'text-black';

  return (
    <div className={`w-full h-12 flex items-center justify-between px-6 pt-2 text-xs font-semibold z-40 ${textColor}`}>
      <div className="w-1/3 flex justify-start">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className="w-1/3 flex justify-center">
        {/* Notch space */}
      </div>
      <div className="w-1/3 flex justify-end items-center gap-1.5">
        <Signal className="w-4 h-4" />
        <Wifi className="w-4 h-4" />
        <Battery className="w-5 h-5" />
      </div>
    </div>
  );
}
