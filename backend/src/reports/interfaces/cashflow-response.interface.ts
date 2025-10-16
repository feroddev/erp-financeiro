export interface CashflowPeriod {
  from: string;
  to: string;
}

export interface CashflowTotals {
  received: number;
  paid: number;
  balance: number;
}

export interface CashflowTimelineItem {
  date: string;
  in: number;
  out: number;
}

export interface CashflowResponse {
  period: CashflowPeriod;
  totals: CashflowTotals;
  timeline: CashflowTimelineItem[];
}
