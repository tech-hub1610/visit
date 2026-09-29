import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, Key, CheckCircle, Copy, Sparkles, Info } from 'lucide-react';
import { getSavedApiToken, saveApiToken } from '../lib/storage';

interface VerificationBadgeProps {
  onOpenTokenGuide: () => void;
  onTokenSaved?: (token: string) => void;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ onOpenTokenGuide, onTokenSaved }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  React.useEffect(() => {
    setTokenInput(getSavedApiToken());
  }, []);

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    saveApiToken(tokenInput);
    if (onTokenSaved) onTokenSaved(tokenInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyRequiredLink = () => {
    navigator.clipboard.writeText('<a href="https://lottery.sambad.com/">Lottery Sambad</a>');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="w-full bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-orange-500/20 text-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          
          {/* Verification & Official Backlink requirement */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Sambad Portal
            </span>
            <span className="text-slate-400">Powered by official source:</span>
            {/* The exact backlink required for token verification */}
            <a
              href="https://lottery.sambad.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-400 hover:text-orange-300 underline decoration-orange-400/60 hover:decoration-orange-300 transition-colors inline-flex items-center gap-1"
            >
              Lottery Sambad
              <ExternalLink className="w-3 h-3 inline" />
            </a>
          </div>

          {/* Actions & API Token Setup */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={copyRequiredLink}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs inline-flex items-center gap-1.5 transition-all active:scale-95"
              title="Copy verification HTML snippet"
            >
              <Copy className="w-3 h-3 text-orange-400" />
              {copiedCode ? 'Copied Link!' : 'Copy Verify Tag'}
            </button>

            <button
              onClick={onOpenTokenGuide}
              className="px-2.5 py-1 rounded bg-orange-600/20 hover:bg-orange-600/30 border border-orange-500/40 text-orange-300 text-xs font-medium inline-flex items-center gap-1.5 transition-all"
            >
              <Key className="w-3.5 h-3.5 text-orange-400" />
              Get API Token
            </button>

            <button
              onClick={() => setShowTokenInput(!showTokenInput)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-xs font-medium transition-all"
            >
              {showTokenInput ? 'Close' : 'Set Token'}
            </button>
          </div>
        </div>

        {/* Expandable Token Form */}
        {showTokenInput && (
          <form onSubmit={handleSaveToken} className="mt-2.5 pt-2.5 border-t border-slate-700/60 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <input
                type="password"
                placeholder="Paste your Lottery Sambad API Bearer Token here..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                type="submit"
                className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium transition-all inline-flex items-center gap-1"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Save Token
              </button>
              <button
                type="button"
                onClick={() => {
                  setTokenInput('');
                  saveApiToken('');
                  if (onTokenSaved) onTokenSaved('');
                }}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded text-xs"
              >
                Clear
              </button>
            </div>
            {savedSuccess && (
              <span className="text-emerald-400 text-xs font-medium animate-fade-in">
                Token saved locally!
              </span>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
