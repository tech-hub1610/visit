import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { VerificationBadge } from '../components/VerificationBadge';
import { LiveDrawBar } from '../components/LiveDrawBar';
import { ResultCard } from '../components/ResultCard';
import { TicketChecker } from '../components/TicketChecker';
import { ResultPublisher } from '../components/ResultPublisher';
import { ArchiveBrowser } from '../components/ArchiveBrowser';
import { ApiTokenGuideModal } from '../components/ApiTokenGuideModal';
import { Footer } from '../components/Footer';
import { LotteryResult } from '../lib/types';
import { INITIAL_RESULTS, getTodayDateString, getYesterdayDateString } from '../lib/sample-data';
import { getStoredResults, saveResult, deleteResult } from '../lib/storage';
import { Sparkles, Calendar, Search, Trophy, Flame, Layers, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'results' | 'checker' | 'publisher' | 'archive'>('results');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [highlightQuery, setHighlightQuery] = useState<string>('');
  const [results, setResults] = useState<LotteryResult[]>(INITIAL_RESULTS);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const loaded = getStoredResults();
    setResults(loaded);
  }, []);

  useEffect(() => {
    if (router.query.tab && typeof router.query.tab === 'string') {
      const tab = router.query.tab as any;
      if (['results', 'checker', 'publisher', 'archive'].includes(tab)) {
        setActiveTab(tab);
      }
    }
  }, [router.query.tab]);

  const handlePublishNewResult = (newRes: LotteryResult) => {
    const updated = saveResult(newRes);
    setResults(updated);
    setSelectedDate(newRes.drawDate);
    setActiveTab('results');
  };

  const handleDeleteDraw = (id: string) => {
    if (window.confirm('Are you sure you want to delete this draw result?')) {
      const updated = deleteResult(id);
      setResults(updated);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setResults(getStoredResults());
      setIsLoading(false);
    }, 600);
  };

  // Filter results according to date and slot
  const filteredResults = results.filter(r => {
    const matchesDate = !selectedDate || r.drawDate === selectedDate;
    const matchesTime = selectedTimeSlot === 'ALL' || r.drawTime === selectedTimeSlot;
    return matchesDate && matchesTime;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      <Head>
        <title>Lottery Sambad Today Live Result - 1:00 PM, 6:00 PM, 8:00 PM</title>
        <meta name="description" content="Official Lottery Sambad Live Results for Nagaland, Sikkim and West Bengal Dear Morning, Dear Day and Dear Evening draws. Check winning tickets instantly." />
      </Head>

      {/* Verification Badge with mandatory link <a href="https://lottery.sambad.com/">Lottery Sambad</a> */}
      <VerificationBadge
        onOpenTokenGuide={() => setIsGuideOpen(true)}
        onTokenSaved={() => handleRefresh()}
      />

      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedTimeSlot={selectedTimeSlot}
        onSelectTimeSlot={setSelectedTimeSlot}
        onOpenTokenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Live Draw Countdown Bar */}
        <div className="mb-6">
          <LiveDrawBar onRefresh={handleRefresh} isLoading={isLoading} />
        </div>

        {/* TAB 1: RESULTS VIEW */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            
            {/* Filters & Date Selector Bar */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
              
              {/* Date Selector */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-slate-300 text-xs font-bold uppercase tracking-wider">
                  <Calendar className="w-4 h-4 text-orange-400" />
                  <span>Select Date:</span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setSelectedDate(getTodayDateString())}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDate === getTodayDateString()
                      ? 'bg-orange-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedDate(getYesterdayDateString())}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedDate === getYesterdayDateString()
                      ? 'bg-orange-500 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Yesterday
                </button>
              </div>

              {/* Quick Highlight Search in Results */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Highlight 4 or 5 digits..."
                    value={highlightQuery}
                    onChange={(e) => setHighlightQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                  />
                </div>
              </div>

            </div>

            {/* Draws List */}
            {filteredResults.length > 0 ? (
              <div className="space-y-8 animate-fade-in">
                {filteredResults.map((res) => (
                  <ResultCard
                    key={res.id}
                    result={res}
                    highlightNumber={highlightQuery}
                    onDelete={handleDeleteDraw}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center my-8 shadow-xl">
                <div className="inline-flex p-4 rounded-2xl bg-orange-500/10 text-orange-400 mb-4">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">No Results Found for {selectedDate}</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
                  There are no published draws for this date and time slot yet. You can publish a new result or sync directly from the Sambad API.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('publisher')}
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all"
                  >
                    <span>Publish Result Now</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDate(getTodayDateString());
                      setSelectedTimeSlot('ALL');
                    }}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-all"
                  >
                    Reset Date
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ARCHIVE BROWSER */}
        {activeTab === 'archive' && (
          <div className="animate-fade-in">
            <ArchiveBrowser
              allResults={results}
              onSelectDraw={(draw) => {
                setSelectedDate(draw.drawDate);
                setSelectedTimeSlot(draw.drawTime);
                setActiveTab('results');
              }}
            />
          </div>
        )}

        {/* TAB 3: TICKET CHECKER */}
        {activeTab === 'checker' && (
          <div className="animate-fade-in">
            <TicketChecker results={results} />
          </div>
        )}

        {/* TAB 4: PUBLISH RESULT */}
        {activeTab === 'publisher' && (
          <div className="animate-fade-in">
            <ResultPublisher
              onPublish={handlePublishNewResult}
              onOpenTokenGuide={() => setIsGuideOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Guide Modal */}
      <ApiTokenGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onTokenSaved={() => handleRefresh()}
      />

      {/* Footer with mandatory verification link */}
      <Footer />
    </div>
  );
}
