import React, { useState, useEffect } from 'react';
import { Sparkles, Clock, Calendar, CheckSquare, PlusCircle, Search, Trophy, Flame } from 'lucide-react';

interface HeaderProps {
  activeTab: 'results' | 'checker' | 'publisher' | 'archive';
  setActiveTab: (tab: 'results' | 'checker' | 'publisher' | 'archive') => void;
  selectedTimeSlot?: string;
  onSelectTimeSlot?: (slot: string) => void;
  onOpenTokenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedTimeSlot,
  onSelectTimeSlot,
  onOpenTokenGuide,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [istDate, setIstDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Formatted in IST
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      });
      const dateStr = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      setIstTime(timeStr);
      setIstDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('results')}>
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 text-slate-950 font-black text-2xl shadow-lg shadow-orange-500/20 ring-2 ring-orange-400/40">
              <Trophy className="w-6 h-6 text-slate-950 stroke-[2.5]" />
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  LOTTERY SAMBAD
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                  LIVE 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Official Nagaland, Sikkim & Bengal State Lottery Results Portal
              </p>
            </div>
          </div>

          {/* IST Real-time Live Clock */}
          <div className="hidden lg:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
            <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
            <div>
              <div className="text-slate-200 font-semibold font-mono tracking-wider">{istTime || 'Loading IST...'}</div>
              <div className="text-[11px] text-slate-400">{istDate} (IST)</div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('results')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'results'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Today's Results</span>
            </button>

            <button
              onClick={() => setActiveTab('archive')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'archive'
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Old Archive</span>
            </button>

            <button
              onClick={() => setActiveTab('checker')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'checker'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Check Ticket</span>
            </button>

            <button
              onClick={() => setActiveTab('publisher')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'publisher'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
                  : 'text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/30'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span className="font-bold">Publish Result</span>
            </button>
          </div>
        </div>

        {/* Quick Draw Jump Bar */}
        {activeTab === 'results' && onSelectTimeSlot && (
          <div className="flex items-center justify-between py-2 border-t border-slate-800/80 overflow-x-auto gap-2 text-xs">
            <span className="text-slate-400 whitespace-nowrap font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-orange-400" />
              Daily Draws:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectTimeSlot('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeSlot === 'ALL'
                    ? 'bg-slate-700 text-orange-300 border border-orange-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                All 3 Draws
              </button>
              <button
                onClick={() => onSelectTimeSlot('1:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  selectedTimeSlot === '1:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                1:00 PM (Dear Morning)
              </button>
              <button
                onClick={() => onSelectTimeSlot('6:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  selectedTimeSlot === '6:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                6:00 PM (Dear Day)
              </button>
              <button
                onClick={() => onSelectTimeSlot('8:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  selectedTimeSlot === '8:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                8:00 PM (Dear Evening)
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
