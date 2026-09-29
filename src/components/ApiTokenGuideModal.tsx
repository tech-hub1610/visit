import React, { useState } from 'react';
import { X, ExternalLink, Copy, Check, Key, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { saveApiToken } from '../lib/storage';

interface ApiTokenGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenSaved?: (token: string) => void;
}

export const ApiTokenGuideModal: React.FC<ApiTokenGuideModalProps> = ({ isOpen, onClose, onTokenSaved }) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [userToken, setUserToken] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const verificationSnippet = '<a href="https://lottery.sambad.com/">Lottery Sambad</a>';

  const copySnippet = () => {
    navigator.clipboard.writeText(verificationSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userToken.trim()) return;
    saveApiToken(userToken);
    if (onTokenSaved) onTokenSaved(userToken);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Get Your Lottery Sambad API Token
            </h3>
            <p className="text-xs text-slate-400">
              Follow these simple 3 steps to generate your free official API token
            </p>
          </div>
        </div>

        {/* Step-by-Step Guide matching user portal */}
        <div className="space-y-4">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-500 text-slate-950">
                Step 1
              </span>
              <a
                href="https://lottery.sambad.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-orange-400 hover:text-orange-300 inline-flex items-center gap-1 underline"
              >
                Open lottery.sambad.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Sign in with Google</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Go to the official Lottery Sambad portal and sign in with your Google Account (e.g. Raj Roy).
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-500 text-slate-950">
                Step 2
              </span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Already Active on this Website!
              </span>
            </div>
            <h4 className="text-sm font-bold text-white mt-2">Add verification link to homepage</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              The required backlink is already embedded in this web app's homepage and footer:
            </p>
            <div className="mt-2 flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-orange-300">
              <span>{verificationSnippet}</span>
              <button
                type="button"
                onClick={copySnippet}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs inline-flex items-center gap-1 transition-all"
              >
                <Copy className="w-3 h-3" />
                {copiedCode ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-orange-500 text-slate-950">
              Step 3
            </span>
            <h4 className="text-sm font-bold text-white mt-2">Check the link and get token</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter your deployed Vercel/Render website address (e.g. <span className="font-mono text-slate-300">https://your-site.vercel.app/</span>) in the portal and click <strong>"Check link & get token"</strong>.
            </p>
          </div>

          {/* Step 4: Paste Token */}
          <form onSubmit={handleSave} className="p-5 rounded-2xl bg-gradient-to-r from-orange-950/40 via-slate-950 to-slate-950 border-2 border-orange-500/40">
            <label className="block text-xs font-bold uppercase tracking-wider text-orange-400 mb-1.5">
              Paste Your Issued Token Here:
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="Bearer token e.g. eyJhbGciOi..."
                value={userToken}
                onChange={(e) => setUserToken(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-orange-400"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>Save Token</span>
              </button>
            </div>
            {savedSuccess && (
              <p className="text-xs text-emerald-400 font-bold mt-2">
                Token saved successfully! You can now sync live results.
              </p>
            )}
          </form>

        </div>

      </div>
    </div>
  );
};
