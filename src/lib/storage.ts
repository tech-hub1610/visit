import { LotteryResult, DrawTimeSlot } from './types';
import { INITIAL_RESULTS, generateDrawForDate } from './sample-data';

const STORAGE_KEY = 'sambad_published_results_v1';
const API_TOKEN_KEY = 'sambad_api_user_token_v1';

export function getStoredResults(): LotteryResult[] {
  if (typeof window === 'undefined') {
    return INITIAL_RESULTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESULTS));
      return INITIAL_RESULTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_RESULTS;
  } catch {
    return INITIAL_RESULTS;
  }
}

export function getResultsByDate(dateStr: string): LotteryResult[] {
  const current = getStoredResults();
  const found = current.filter(r => r.drawDate === dateStr);
  if (found.length > 0) return found;

  // Auto-generate for historical dates if not in storage
  const slots: DrawTimeSlot[] = ['1:00 PM', '6:00 PM', '8:00 PM'];
  const generated = slots.map((slot, idx) => generateDrawForDate(dateStr, slot, idx + 1));
  return generated;
}

export function saveResult(newResult: LotteryResult): LotteryResult[] {
  if (typeof window === 'undefined') return [newResult, ...INITIAL_RESULTS];
  try {
    const current = getStoredResults();
    // Remove if existing id or same date+time
    const filtered = current.filter(
      r => r.id !== newResult.id && !(r.drawDate === newResult.drawDate && r.drawTime === newResult.drawTime)
    );
    const updated = [newResult, ...filtered];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [newResult, ...INITIAL_RESULTS];
  }
}

export function deleteResult(id: string): LotteryResult[] {
  if (typeof window === 'undefined') return INITIAL_RESULTS;
  try {
    const current = getStoredResults();
    const updated = current.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return INITIAL_RESULTS;
  }
}

export function getSavedApiToken(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(API_TOKEN_KEY) || '';
}

export function saveApiToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(API_TOKEN_KEY, token.trim());
}

/**
 * Export results to CSV
 */
export function exportResultsToCSV(results: LotteryResult[]): void {
  const headers = ['Date', 'Time Slot', 'Draw Name', 'State', '1st Prize Ticket', '1st Prize Amount', 'Consolation', '2nd Prize (10)', '3rd Prize (10)', '4th Prize (10)', 'Published At'];
  const rows = results.map(r => [
    `"${r.drawDate}"`,
    `"${r.drawTime}"`,
    `"${r.drawName}"`,
    `"${r.state}"`,
    `"${r.firstPrize.ticketNumber}"`,
    `"${r.firstPrize.amount}"`,
    `"${r.consolationPrize?.numbers.join(' ') || ''}"`,
    `"${r.secondPrize.numbers.join(' ')}"`,
    `"${r.thirdPrize.numbers.join(' ')}"`,
    `"${r.fourthPrize.numbers.join(' ')}"`,
    `"${r.publishedAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `lottery_sambad_archive_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export results to JSON
 */
export function exportResultsToJSON(results: LotteryResult[]): void {
  const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `lottery_sambad_archive_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
