import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '../components/Header';
import { VerificationBadge } from '../components/VerificationBadge';
import { ArchiveBrowser } from '../components/ArchiveBrowser';
import { ApiTokenGuideModal } from '../components/ApiTokenGuideModal';
import { Footer } from '../components/Footer';
import { LotteryResult } from '../lib/types';
import { INITIAL_RESULTS } from '../lib/sample-data';
import { getStoredResults } from '../lib/storage';

export default function ArchivePage() {
  const router = useRouter();
  const [results, setResults] = useState<LotteryResult[]>(INITIAL_RESULTS);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  useEffect(() => {
    setResults(getStoredResults());
  }, []);

  const handleTabChange = (tab: 'results' | 'checker' | 'publisher' | 'archive') => {
    if (tab === 'archive') return;
    router.push(`/?tab=${tab}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-orange-500 selection:text-white">
      <Head>
        <title>Lottery Sambad Old Result Archive - Nagaland, Sikkim & Bengal Past Results</title>
        <meta name="description" content="Search and browse past Lottery Sambad draw results for 1:00 PM, 6:00 PM and 8:00 PM. Full historical archive of Nagaland and Sikkim Dear lottery winning numbers." />
      </Head>

      {/* Verification Badge with mandatory link <a href="https://lottery.sambad.com/">Lottery Sambad</a> */}
      <VerificationBadge
        onOpenTokenGuide={() => setIsGuideOpen(true)}
      />

      {/* Navigation Header */}
      <Header
        activeTab="archive"
        setActiveTab={handleTabChange}
        onOpenTokenGuide={() => setIsGuideOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ArchiveBrowser allResults={results} />
      </main>

      {/* Guide Modal */}
      <ApiTokenGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
