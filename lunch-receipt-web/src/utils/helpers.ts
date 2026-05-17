import { Receipt, MonthlySummary, ReceiptCategory } from '../types';

export const formatCurrency = (amount: number): string =>
  amount.toLocaleString('ko-KR') + '원';

export const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};

export const toYearMonth = (dateStr: string): string => dateStr.substring(0, 7);

export const getMonthlySummary = (
  receipts: Receipt[],
  year: number,
  month: number,
): MonthlySummary => {
  const prefix = `${year}-${String(month).padStart(2, '0')}`;
  const filtered = receipts.filter(r => r.date.startsWith(prefix));
  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0);
  const categoryBreakdown = filtered.reduce((acc, r) => {
    acc[r.category] = (acc[r.category] ?? 0) + r.amount;
    return acc;
  }, {} as Partial<Record<ReceiptCategory, number>>);
  return {
    year,
    month,
    totalAmount,
    receiptCount: filtered.length,
    averageAmount: filtered.length > 0 ? Math.round(totalAmount / filtered.length) : 0,
    categoryBreakdown,
  };
};
