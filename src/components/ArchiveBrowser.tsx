import React, { useState, useMemo } from 'react';
import { LotteryResult, DrawTimeSlot } from '../lib/types';
import { ResultCard } from './ResultCard';
import { getResultsByDate, exportResultsToCSV, exportResultsToJSON } from '../lib/storage';
import { getTodayDateString, getYesterdayDateString, formatDateString } from '../lib/sample-data';
import {
  Calendar as CalendarIcon,
  Search,
  Download,
  FileSpreadsheet,
  FileCode,
  Printer,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Filter,
  Eye,
  Clock,
  Sparkles,
  Layers,
  Table as TableIcon,
  LayoutGrid
} from 'lucide-react';

interface ArchiveBrowserProps {
  allResults: LotteryResult[];
  onSelectDraw?: (draw: LotteryResult) => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const ArchiveBrowser: React.FC<ArchiveBrowserProps> = ({ allResults, onSelectDraw }) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-11
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Days in month calculation
  const daysInMonth = useMemo(() => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  }, [currentYear, currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    return new Date(currentYear, currentMonth, 1).getDay(); // 0 (Sun) - 6 (Sat)
  }, [currentYear, currentMonth]);

  // Handle Month Navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Quick Preset Handlers
  const handleQuickSelect = (daysAgo: number) => {
    const target = new Date();
    target.setDate(target.getDate() - daysAgo);
    setSelectedDate(formatDateString(target));
    setCurrentYear(target.getFullYear());
    setCurrentMonth(target.getMonth());
  };

  // Get results for active date (or entire month in table view)
  const activeDateResults = useMemo(() => {
    return getResultsByDate(selectedDate);
  }, [selectedDate, allResults]);

  // Filtered draws for table view
  const tableData = useMemo(() => {
    let filtered = allResults;

    // Filter by year and month
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    filtered = filtered.filter(r => r.drawDate.startsWith(monthPrefix));

    // Filter by Time Slot
    if (selectedTimeSlot !== 'ALL') {
      filtered = filtered.filter(r => r.drawTime === selectedTimeSlot);
    }

    // Filter by Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      filtered = filtered.filter(r =>
        r.drawName.toLowerCase().includes(q) ||
        r.firstPrize.ticketNumber.toLowerCase().includes(q) ||
        r.drawDate.includes(q) ||
        r.secondPrize.numbers.some(n => n.includes(q))
      );
    }

    // Sort by date descending
    return filtered.sort((a, b) => b.drawDate.localeCompare(a.drawDate) || b.drawTime.localeCompare(a.drawTime));
  }, [allResults, currentYear, currentMonth, selectedTimeSlot, searchQuery]);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Archive Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400">
                <CalendarIcon className="w-6 h-6" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Lottery Sambad Result Archive
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Browse, search, and download official past draw results for Nagaland, Sikkim & West Bengal lotteries by year, month, or exact date.
            </p>
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => exportResultsToCSV(tableData)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-md"
              title="Download CSV report of current month"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => exportResultsToJSON(tableData)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-all shadow-md"
              title="Download JSON data"
            >
              <FileCode className="w-3.5 h-3.5 text-orange-400" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {/* Quick Date Shortcuts */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">Quick Jump:</span>
          <button
            onClick={() => handleQuickSelect(0)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedDate === getTodayDateString() ? 'bg-orange-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => handleQuickSelect(1)}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedDate === getYesterdayDateString() ? 'bg-orange-500 text-slate-950 font-black' : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
            }`}
          >
            Yesterday
          </button>
          <button
            onClick={() => handleQuickSelect(7)}
            className="px-3 py-1 rounded-lg font-semibold bg-slate-950 text-slate-300 hover:bg-slate-800 transition-all"
          >
            7 Days Ago
          </button>
          <button
            onClick={() => handleQuickSelect(14)}
            className="px-3 py-1 rounded-lg font-semibold bg-slate-950 text-slate-300 hover:bg-slate-800 transition-all"
          >
            14 Days Ago
          </button>
          <button
            onClick={() => handleQuickSelect(30)}
            className="px-3 py-1 rounded-lg font-semibold bg-slate-950 text-slate-300 hover:bg-slate-800 transition-all"
          >
            30 Days Ago
          </button>
        </div>
      </div>

      {/* Main Grid: Calendar Picker & Month Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Calendar Explorer Box (5 Cols on large screens) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
          
          {/* Month/Year Controller */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>{name}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
              >
                {[2026, 2025, 2024, 2023].map((yr) => (
                  <option key={yr} value={yr}>{yr}</option>
                ))}
              </select>
            </div>

            <button
              onClick={nextMonth}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold uppercase text-slate-400 py-1">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Monthly Dates Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Empty slots for start day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="p-2"></div>
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDate === dateString;
              const isToday = dateString === getTodayDateString();

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    setSelectedDate(dateString);
                    setViewMode('cards');
                  }}
                  className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition-all relative flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-tr from-orange-500 to-amber-500 text-slate-950 ring-2 ring-orange-400 scale-105 shadow-lg'
                      : isToday
                      ? 'bg-slate-800 text-orange-400 border border-orange-500/50'
                      : 'bg-slate-950/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/80'
                  }`}
                >
                  <span>{day}</span>
                  <span className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? 'bg-slate-950' : 'bg-emerald-400'}`}></span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Draws Available
            </span>
            <span>Active: <strong className="text-white font-mono">{selectedDate}</strong></span>
          </div>
        </div>

        {/* Filters & View Controller (7 Cols on large screens) */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            
            {/* Top Toolbar: Search & View Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search draw name, ticket, 1st prize..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>

              {/* View Switcher (Cards vs Table) */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'table'
                      ? 'bg-orange-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  <span>Summary Table</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                    viewMode === 'cards'
                      ? 'bg-orange-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Full Charts</span>
                </button>
              </div>
            </div>

            {/* Time Slot Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider shrink-0">Slot:</span>
              <button
                onClick={() => setSelectedTimeSlot('ALL')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeSlot === 'ALL'
                    ? 'bg-slate-700 text-orange-300 border border-orange-500/40'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Slots
              </button>
              <button
                onClick={() => setSelectedTimeSlot('1:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeSlot === '1:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                1:00 PM Morning
              </button>
              <button
                onClick={() => setSelectedTimeSlot('6:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeSlot === '6:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                6:00 PM Day
              </button>
              <button
                onClick={() => setSelectedTimeSlot('8:00 PM')}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  selectedTimeSlot === '8:00 PM'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                8:00 PM Night
              </button>
            </div>

          </div>

          {/* Quick Info Bar */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">
              Showing <strong className="text-white">{tableData.length}</strong> draws for <strong className="text-orange-400">{MONTH_NAMES[currentMonth]} {currentYear}</strong>
            </span>
            <span className="text-emerald-400 font-semibold font-mono">100% Gazette Verified</span>
          </div>

        </div>

      </div>

      {/* VIEW MODE 1: HISTORICAL SUMMARY TABLE */}
      {viewMode === 'table' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-extrabold text-white">
                Monthly Draw Summary ({MONTH_NAMES[currentMonth]} {currentYear})
              </h3>
            </div>
            <span className="text-xs text-slate-400">Click any draw to view complete 5th prize numbers</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4 font-bold">Date</th>
                  <th className="py-3.5 px-4 font-bold">Draw Slot</th>
                  <th className="py-3.5 px-4 font-bold">Draw Name</th>
                  <th className="py-3.5 px-4 font-bold text-amber-400">1st Prize (₹1 Crore)</th>
                  <th className="py-3.5 px-4 font-bold">Consolation</th>
                  <th className="py-3.5 px-4 font-bold">2nd Prize (₹9,000)</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {tableData.length > 0 ? (
                  tableData.map((draw) => (
                    <tr
                      key={draw.id}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedDate(draw.drawDate);
                        setViewMode('cards');
                      }}
                    >
                      <td className="py-3 px-4 font-bold text-slate-200">
                        {draw.drawDate}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30">
                          {draw.drawTime}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans font-semibold text-white">
                        {draw.drawName}
                      </td>
                      <td className="py-3 px-4 font-black text-amber-300 text-sm">
                        {draw.firstPrize.ticketNumber}
                      </td>
                      <td className="py-3 px-4 text-orange-400">
                        {draw.consolationPrize?.numbers.join(', ') || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-300 text-[11px]">
                        {draw.secondPrize.numbers.slice(0, 3).join(', ')}... (+7 more)
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDate(draw.drawDate);
                            setViewMode('cards');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 text-xs font-semibold inline-flex items-center gap-1 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Chart</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                      No draws found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: FULL DETAILED RESULT CARDS FOR SELECTED DATE */}
      {viewMode === 'cards' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-900 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-orange-400" />
              <h3 className="text-base font-bold text-white">
                Detailed Gazette Charts for Date: <span className="text-orange-400 font-mono">{selectedDate}</span>
              </h3>
            </div>
            <button
              onClick={() => setViewMode('table')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Back to Table
            </button>
          </div>

          {activeDateResults.length > 0 ? (
            <div className="space-y-8">
              {activeDateResults.map((draw) => (
                <ResultCard key={draw.id} result={draw} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center">
              <p className="text-slate-400 text-sm">No draws found for {selectedDate}.</p>
            </div>
          )}
        </div>
      )}

    </div>
  );
};
