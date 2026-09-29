import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle, Sparkles, BellRing, RefreshCw } from 'lucide-react';

interface LiveDrawBarProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const LiveDrawBar: React.FC<LiveDrawBarProps> = ({ onRefresh, isLoading }) => {
  const [nextDrawName, setNextDrawName] = useState<string>('Dear Morning (1:00 PM)');
  const [timeLeft, setTimeLeft] = useState<string>('00:00:00');
  const [isDrawNow, setIsDrawNow] = useState<boolean>(false);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      // Get IST hours, minutes, seconds
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istDate = new Date(utc + 3600000 * 5.5);
      
      const currentHours = istDate.getHours();
      const currentMinutes = istDate.getMinutes();
      const currentSeconds = istDate.getSeconds();
      const currentTotalSec = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

      // Draw times in IST seconds:
      // 1:00 PM = 13:00 = 46800s
      // 6:00 PM = 18:00 = 64800s
      // 8:00 PM = 20:00 = 72000s
      const draw1 = 13 * 3600;
      const draw2 = 18 * 3600;
      const draw3 = 20 * 3600;

      let targetSec = draw1;
      let drawTitle = 'Dear Morning Draw (1:00 PM)';

      if (currentTotalSec < draw1) {
        targetSec = draw1;
        drawTitle = 'Dear Morning Draw (1:00 PM)';
      } else if (currentTotalSec < draw2) {
        targetSec = draw2;
        drawTitle = 'Dear Day Draw (6:00 PM)';
      } else if (currentTotalSec < draw3) {
        targetSec = draw3;
        drawTitle = 'Dear Evening / Night Draw (8:00 PM)';
      } else {
        // Next day 1:00 PM
        targetSec = 24 * 3600 + draw1;
        drawTitle = 'Tomorrow Dear Morning Draw (1:00 PM)';
      }

      const diffSec = targetSec - currentTotalSec;
      if (diffSec <= 60 && diffSec >= 0) {
        setIsDrawNow(true);
      } else {
        setIsDrawNow(false);
      }

      const hours = Math.floor(diffSec / 3600);
      const minutes = Math.floor((diffSec % 3600) / 60);
      const seconds = diffSec % 60;

      setTimeLeft(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
      );
      setNextDrawName(drawTitle);
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-950 via-slate-900 to-amber-950 border border-orange-500/30 p-4 sm:p-6 shadow-2xl">
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center shrink-0">
            {isDrawNow ? (
              <BellRing className="w-6 h-6 text-yellow-300 animate-bounce" />
            ) : (
              <Timer className="w-6 h-6 text-orange-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                Next Upcoming Draw
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600/30 text-red-400 border border-red-500/40">
                LIVE COUNTDOWN
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              {nextDrawName}
            </h3>
          </div>
        </div>

        {/* Live Timer Countdown Box */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950/90 border border-slate-700/80 rounded-xl px-5 py-2.5 shadow-inner">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Starts in:</span>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
              {timeLeft}
            </span>
          </div>

          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-all active:scale-95 disabled:opacity-50"
              title="Refresh Live Results"
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-orange-400' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
