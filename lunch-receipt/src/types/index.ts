export interface Receipt {
  id: string;
  restaurantName: string;
  amount: number;
  date: string;
  category: ReceiptCategory;
  paidBy: string;
  attendees: number;
  notes?: string;
  createdAt: string;
}

export type ReceiptCategory =
  | '한식'
  | '중식'
  | '일식'
  | '양식'
  | '분식'
  | '기타';

export const CATEGORIES: ReceiptCategory[] = [
  '한식', '중식', '일식', '양식', '분식', '기타',
];

export interface MonthlySummary {
  year: number;
  month: number;
  totalAmount: number;
  receiptCount: number;
  averageAmount: number;
  categoryBreakdown: Partial<Record<ReceiptCategory, number>>;
}
