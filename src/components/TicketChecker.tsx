import React, { useState } from 'react';
import { LotteryResult, CheckTicketResult } from '../lib/types';
import { Search, Sparkles, Trophy, CheckCircle2, XCircle, ArrowRight, RefreshCw, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TicketCheckerProps {
  results: LotteryResult[];
  onViewDraw?: (drawId: string) => void;
}

export const TicketChecker: React.FC<TicketCheckerProps> = ({ results, onViewDraw }) => {
  const [ticketInput, setTicketInput] = useState('');
  const [selectedDrawTime, setSelectedDrawTime] = useState<string>('ALL');
  const [checkResult, setCheckResult] = useState<CheckTicketResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const query = ticketInput.trim().toUpperCase();
    if (!query) return;

    setHasSearched(true);

    const drawsToSearch = selectedDrawTime === 'ALL'
      ? results
      : results.filter(r => r.drawTime === selectedDrawTime);

    let matchFound: CheckTicketResult | null = null;

    for (const draw of drawsToSearch) {
      // 1. Check First Prize (Exact match with series e.g. 78D 93452, or 5-digit match e.g. 93452)
      const clean1stTicket = draw.firstPrize.ticketNumber.replace(/\s+/g, '').toUpperCase();
      const cleanInput = query.replace(/\s+/g, '');

      if (clean1stTicket === cleanInput || clean1stTicket.endsWith(cleanInput) && cleanInput.length === 5) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: '1st Prize',
          prizeAmount: draw.firstPrize.amount,
          matchedDraw: draw,
          matchedNumber: draw.firstPrize.ticketNumber,
        };
        break;
      }

      // 2. Check Consolation Prize (5-digits)
      const last5 = cleanInput.slice(-5);
      if (draw.consolationPrize?.numbers.includes(last5)) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: 'Consolation Prize',
          prizeAmount: draw.consolationPrize.amount,
          matchedDraw: draw,
          matchedNumber: last5,
        };
        break;
      }

      // 3. Check 2nd Prize (5-digits)
      if (draw.secondPrize.numbers.includes(last5)) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: '2nd Prize',
          prizeAmount: draw.secondPrize.amount,
          matchedDraw: draw,
          matchedNumber: last5,
        };
        break;
      }

      // 4. Check 3rd Prize (4-digits)
      const last4 = cleanInput.slice(-4);
      if (draw.thirdPrize.numbers.includes(last4)) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: '3rd Prize',
          prizeAmount: draw.thirdPrize.amount,
          matchedDraw: draw,
          matchedNumber: last4,
        };
        break;
      }

      // 5. Check 4th Prize (4-digits)
      if (draw.fourthPrize.numbers.includes(last4)) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: '4th Prize',
          prizeAmount: draw.fourthPrize.amount,
          matchedDraw: draw,
          matchedNumber: last4,
        };
        break;
      }

      // 6. Check 5th Prize (4-digits)
      if (draw.fifthPrize.numbers.includes(last4)) {
        matchFound = {
          searchedTicket: query,
          isWinner: true,
          prizeCategory: '5th Prize',
          prizeAmount: draw.fifthPrize.amount,
          matchedDraw: draw,
          matchedNumber: last4,
        };
        break;
      }
    }

    if (matchFound) {
      setCheckResult(matchFound);
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f97316', '#eab308', '#10b981', '#ffffff'],
        });
      } catch (e) {
        // fallback if canvas not available
      }
    } else {
      setCheckResult({
        searchedTicket: query,
        isWinner: false,
      });
    }
  };

  const handleReset = () => {
    setTicketInput('');
    setCheckResult(null);
    setHasSearched(false);
  };

  return (
    <div className="max-w-3xl mx-auto my-8">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow decorative effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Instant Ticket Win Checker
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Enter your Lottery Sambad ticket number (e.g. <span className="text-amber-400 font-mono">78D 93452</span>, <span className="text-amber-400 font-mono">93452</span>, or last 4 digits) to verify if you won.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleCheck} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Ticket Serial or Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. 78D 93452 or 93452 or 1034"
                  value={ticketInput}
                  onChange={(e) => setTicketInput(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-lg font-bold font-mono text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase tracking-widest transition-all shadow-inner"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Draw Slot
              </label>
              <select
                value={selectedDrawTime}
                onChange={(e) => setSelectedDrawTime(e.target.value)}
                className="w-full px-3 py-3.5 bg-slate-950 border-2 border-slate-700 rounded-xl text-sm font-semibold text-slate-200 focus:outline-none focus:border-amber-400 transition-all"
              >
                <option value="ALL">All Today's Draws</option>
                <option value="1:00 PM">1:00 PM (Dear Morning)</option>
                <option value="6:00 PM">6:00 PM (Dear Day)</option>
                <option value="8:00 PM">8:00 PM (Dear Evening)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-base shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              <Search className="w-5 h-5" />
              <span>Check My Ticket Now</span>
            </button>
            {hasSearched && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 text-sm font-semibold"
              >
                Reset
              </button>
            )}
          </div>
        </form>

        {/* Results Banner */}
        {hasSearched && checkResult && (
          <div className="mt-8 animate-fade-in">
            {checkResult.isWinner ? (
              <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-emerald-950/80 border-2 border-emerald-500/60 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 mb-2 ring-2 ring-emerald-400/40">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  CONGRATULATIONS! YOU HAVE WON!
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white mt-1">
                  {checkResult.prizeCategory} : <span className="text-emerald-400">{checkResult.prizeAmount}</span>
                </div>
                
                <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-left max-w-md mx-auto space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Your Ticket Query:</span>
                    <span className="font-mono font-bold text-white">{checkResult.searchedTicket}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Matched Winning Number:</span>
                    <span className="font-mono font-bold text-emerald-400">{checkResult.matchedNumber}</span>
                  </div>
                  {checkResult.matchedDraw && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Draw Name:</span>
                        <span className="font-medium text-slate-200">{checkResult.matchedDraw.drawName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Draw Time & Date:</span>
                        <span className="font-medium text-slate-200">{checkResult.matchedDraw.drawTime} ({checkResult.matchedDraw.drawDate})</span>
                      </div>
                    </>
                  )}
                </div>

                <p className="text-xs text-slate-400 mt-4">
                  Please verify with the official Government gazette or visit your nearest authorized lottery agent with original ticket within 30 days.
                </p>
              </div>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center shadow-lg">
                <div className="inline-flex p-3 rounded-full bg-slate-800 text-slate-400 mb-2">
                  <XCircle className="w-8 h-8 text-rose-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  No Winning Match Found
                </h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Ticket <span className="font-mono font-bold text-slate-200">{checkResult.searchedTicket}</span> was not drawn in today's published results.
                </p>
                <p className="text-xs text-slate-500 mt-3">
                  Please double check your 5-digit number and draw time slot, or check again when the upcoming draw is published.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
