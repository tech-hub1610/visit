import React, { useState } from 'react';
import { LotteryResult } from '../lib/types';
import { Trophy, Share2, Printer, CheckCircle, Search, Sparkles, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultCardProps {
  result: LotteryResult;
  highlightNumber?: string;
  onDelete?: (id: string) => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result, highlightNumber, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [showAll5th, setShowAll5th] = useState(false);

  const handleShareWhatsApp = () => {
    const text = `🏆 *LOTTERY SAMBAD RESULT* 🏆\n*${result.drawName}* (${result.drawTime})\n📅 Date: ${result.drawDate}\n\n🥇 *1st Prize (₹1 Crore):* ${result.firstPrize.ticketNumber}\n🥈 *Consolation Prize (₹1,000):* ${result.consolationPrize?.numbers.join(', ') || 'N/A'}\n\nCheck full result online: ${window.location.href}`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  const isHighlighted = (num: string) => {
    if (!highlightNumber && !filterText) return false;
    const search = (highlightNumber || filterText).trim();
    return num.toLowerCase().includes(search.toLowerCase());
  };

  const filteredFifth = result.fifthPrize.numbers.filter(num => 
    !filterText || num.includes(filterText)
  );

  const displayedFifth = showAll5th ? filteredFifth : filteredFifth.slice(0, 40);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-slate-700 print-card mb-8">
      
      {/* Result Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-md">
              {result.drawTime}
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              {result.state}
            </span>
            {result.drawNumber && (
              <span className="text-xs text-slate-400 font-mono">
                {result.drawNumber}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-2 tracking-tight">
            {result.drawName}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Draw Date: <span className="font-semibold text-slate-200">{result.drawDate}</span> • Published: {new Date(result.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Action Buttons (WhatsApp Share, Print, Quick Search) */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end no-print">
          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Share result to WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
            title="Print or Save PDF"
          >
            <Printer className="w-3.5 h-3.5 text-orange-400" />
            <span>Print / PDF</span>
          </button>

          {onDelete && (
            <button
              onClick={() => onDelete(result.id)}
              className="px-2.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 text-xs transition-all"
              title="Delete Draw"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* 1st Prize & Consolation Section */}
      <div className="p-4 sm:p-6 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* 1st Prize Big Ticket Display */}
          <div className="md:col-span-8 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-amber-400 animate-bounce-short" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                  1st Prize Winner ({result.firstPrize.amount})
                </span>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/80 px-2 py-0.5 rounded">
                Nagaland / Sikkim
              </span>
            </div>

            <div className="mt-2 text-center sm:text-left">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black font-mono tracking-wider text-amber-300 drop-shadow-md">
                {result.firstPrize.ticketNumber}
              </div>
            </div>
          </div>

          {/* Consolation Prize */}
          <div className="md:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Consolation Prize ({result.consolationPrize?.amount || '₹ 1,000'})
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Remaining series of 1st Prize
              </p>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-black font-mono text-orange-400">
              {result.consolationPrize?.numbers.join(', ') || result.firstPrize.ticketNumber.slice(4)}
            </div>
          </div>
        </div>
      </div>

      {/* 2nd Prize Section (10 Numbers - ₹ 9,000) */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              2nd Prize: <span className="text-orange-400 font-black">{result.secondPrize.amount}</span> (10 Numbers)
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {result.secondPrize.numbers.map((num, idx) => {
            const hit = isHighlighted(num);
            return (
              <div
                key={idx}
                className={`py-2 px-3 rounded-xl font-mono text-center font-bold text-base transition-all ${
                  hit
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-300 scale-105 shadow-lg'
                    : 'bg-slate-950/90 border border-slate-800 text-orange-300 hover:border-slate-700'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3rd & 4th Prize Section */}
      <div className="p-4 sm:p-6 border-b border-slate-800/80 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 3rd Prize (₹ 450) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              3rd Prize: <span className="text-yellow-400 font-black">{result.thirdPrize.amount}</span> (10 Numbers)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {result.thirdPrize.numbers.map((num, idx) => {
              const hit = isHighlighted(num);
              return (
                <div
                  key={idx}
                  className={`py-1.5 px-2 rounded-lg font-mono text-center font-bold text-sm ${
                    hit
                      ? 'bg-yellow-400 text-slate-950 ring-2 ring-yellow-300'
                      : 'bg-slate-950/70 border border-slate-800/80 text-yellow-300'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4th Prize (₹ 250) */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              4th Prize: <span className="text-emerald-400 font-black">{result.fourthPrize.amount}</span> (10 Numbers)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {result.fourthPrize.numbers.map((num, idx) => {
              const hit = isHighlighted(num);
              return (
                <div
                  key={idx}
                  className={`py-1.5 px-2 rounded-lg font-mono text-center font-bold text-sm ${
                    hit
                      ? 'bg-emerald-400 text-slate-950 ring-2 ring-emerald-300'
                      : 'bg-slate-950/70 border border-slate-800/80 text-emerald-300'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5th Prize Section (100 Numbers - ₹ 120) */}
      <div className="p-4 sm:p-6 bg-slate-950/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
              5th Prize: <span className="text-indigo-400 font-black">{result.fifthPrize.amount}</span> (100 Numbers)
            </h3>
          </div>

          {/* Instant filter for 5th prize numbers */}
          <div className="no-print flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-44">
              <Search className="w-3 h-3 text-slate-500 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter 4-digit..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                maxLength={4}
                className="w-full pl-7 pr-2 py-1 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>
        </div>

        {/* 5th prize numbers grid */}
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
          {displayedFifth.map((num, idx) => {
            const hit = isHighlighted(num);
            return (
              <div
                key={idx}
                className={`py-1 px-1 rounded font-mono text-center text-xs font-semibold tracking-wider transition-all ${
                  hit
                    ? 'bg-indigo-400 text-slate-950 font-black scale-110 shadow-md ring-1 ring-white'
                    : 'bg-slate-900/90 border border-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {filteredFifth.length > 40 && (
          <div className="mt-3 text-center no-print">
            <button
              onClick={() => setShowAll5th(!showAll5th)}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            >
              {showAll5th ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  Show Less (40 Numbers)
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  Show All {filteredFifth.length} Numbers
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Official Footnote */}
      <div className="px-6 py-2.5 bg-slate-950 border-t border-slate-800/80 text-[11px] text-slate-500 flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>* Results verified against official Government Gazette. Terms and conditions apply.</span>
        <span className="font-mono text-slate-400">Source: {result.source === 'sambad_api' ? 'Official Sambad API' : 'Gazette Publish'}</span>
      </div>
    </div>
  );
};
