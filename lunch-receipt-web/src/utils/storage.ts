import { Receipt } from '../types';

const KEY = 'lunch_receipts';

export const getReceipts = (): Receipt[] => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? (JSON.parse(data) as Receipt[]) : [];
  } catch {
    return [];
  }
};

export const saveReceipt = (receipt: Receipt): void => {
  const all = getReceipts();
  localStorage.setItem(KEY, JSON.stringify([...all, receipt]));
};

export const updateReceipt = (updated: Receipt): void => {
  const all = getReceipts().map(r => (r.id === updated.id ? updated : r));
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const deleteReceipt = (id: string): void => {
  const all = getReceipts().filter(r => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
};

export const getReceiptById = (id: string): Receipt | undefined =>
  getReceipts().find(r => r.id === id);
