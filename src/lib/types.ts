export type DrawTimeSlot = '1:00 PM' | '6:00 PM' | '8:00 PM';

export interface PrizeCategory {
  amount: string;
  numbers: string[];
}

export interface LotteryResult {
  id: string;
  drawDate: string; // YYYY-MM-DD
  drawTime: DrawTimeSlot | string;
  drawName: string;
  state: string;
  drawNumber?: string;
  firstPrize: {
    amount: string;
    ticketNumber: string; // e.g. "92B 45678" or "84A 12345"
  };
  consolationPrize?: {
    amount: string;
    numbers: string[]; // Remaining series of the 1st prize number
  };
  secondPrize: {
    amount: string;
    numbers: string[]; // 10 numbers (5 digits)
  };
  thirdPrize: {
    amount: string;
    numbers: string[]; // 10 numbers (4 digits)
  };
  fourthPrize: {
    amount: string;
    numbers: string[]; // 10 numbers (4 digits)
  };
  fifthPrize: {
    amount: string;
    numbers: string[]; // 100 numbers (4 digits)
  };
  publishedAt: string;
  source: 'manual' | 'sambad_api' | 'imported';
  pdfUrl?: string;
  status: 'PUBLISHED' | 'DRAFT' | 'UPCOMING';
}

export interface CheckTicketResult {
  searchedTicket: string;
  isWinner: boolean;
  prizeCategory?: string;
  prizeAmount?: string;
  matchedDraw?: LotteryResult;
  matchedNumber?: string;
}

export interface SambadApiConfig {
  apiKey: string;
  baseUrl: string;
  autoSync: boolean;
  lastSync?: string;
}
