import React from 'react';
import { Trophy, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand & Mandatory Backlink */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500 text-slate-950 flex items-center justify-center font-black">
                LS
              </div>
              <span className="text-base font-extrabold text-white tracking-tight">
                Lottery Sambad Live
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time lottery results publishing portal for Nagaland, Sikkim, and West Bengal State Lotteries.
            </p>
            {/* Explicit mandatory backlink anchor for domain verification */}
            <div className="pt-2">
              <span className="text-[11px] block text-slate-500 mb-1">Official Verification Link:</span>
              <a
                href="https://lottery.sambad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-orange-400 hover:text-orange-300 underline decoration-orange-500/50 inline-flex items-center gap-1 text-sm"
              >
                Lottery Sambad
                <ExternalLink className="w-3.5 h-3.5 inline" />
              </a>
            </div>
          </div>

          {/* Col 2: Daily Draw Timings */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Daily Draw Timings
            </h4>
            <ul className="space-y-2">
              <li className="flex justify-between items-center text-slate-300">
                <span>1:00 PM (Morning Draw)</span>
                <span className="text-orange-400 font-semibold font-mono">Dear Morning</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>6:00 PM (Day Draw)</span>
                <span className="text-orange-400 font-semibold font-mono">Dear Day</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>8:00 PM (Night Draw)</span>
                <span className="text-orange-400 font-semibold font-mono">Dear Evening</span>
              </li>
              <li className="flex justify-between items-center text-slate-300">
                <span>Festival Bumper Draws</span>
                <span className="text-amber-400 font-semibold font-mono">Dear Bumper</span>
              </li>
            </ul>
          </div>

          {/* Col 3: State Lotteries Supported */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              State Lotteries
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>• Nagaland State Lotteries</li>
              <li>• Sikkim State Lotteries</li>
              <li>• West Bengal Directorate of State Lotteries</li>
              <li>• Kerala State Lotteries (Bhagyakuri)</li>
              <li>• Bodoland Territorial Council Lottery</li>
            </ul>
          </div>

          {/* Col 4: Prize Structure */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-3">
              Prize Structure
            </h4>
            <ul className="space-y-1.5 text-slate-300 text-xs">
              <li className="flex justify-between">
                <span>1st Prize:</span>
                <span className="font-bold text-amber-300 font-mono">₹ 1,00,00,000 (1 Crore)</span>
              </li>
              <li className="flex justify-between">
                <span>Consolation Prize:</span>
                <span className="font-mono text-slate-200">₹ 1,000</span>
              </li>
              <li className="flex justify-between">
                <span>2nd Prize:</span>
                <span className="font-mono text-slate-200">₹ 9,000</span>
              </li>
              <li className="flex justify-between">
                <span>3rd Prize:</span>
                <span className="font-mono text-slate-200">₹ 450</span>
              </li>
              <li className="flex justify-between">
                <span>4th Prize:</span>
                <span className="font-mono text-slate-200">₹ 250</span>
              </li>
              <li className="flex justify-between">
                <span>5th Prize:</span>
                <span className="font-mono text-slate-200">₹ 120</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Disclaimer:</strong> Lottery Sambad Results displayed on this portal are for informational purposes. While every effort is made to maintain 100% accuracy, please confirm results with the official Government Gazette published by Nagaland / Sikkim / West Bengal State Lotteries. Lottery is strictly prohibited for persons under 18 years of age. Play responsibly.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-slate-400">
            <div>
              © {new Date().getFullYear()} <a href="https://lottery.sambad.com/" className="hover:text-orange-400 underline">Lottery Sambad</a> Portal. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Ready for Vercel & Render Deployment</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
