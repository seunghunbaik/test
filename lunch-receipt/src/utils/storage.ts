import AsyncStorage from '@react-native-async-storage/async-storage';
import { Receipt } from '../types';

const RECEIPTS_KEY = '@lunch_receipts';

export const getReceipts = async (): Promise<Receipt[]> => {
  const data = await AsyncStorage.getItem(RECEIPTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReceipt = async (receipt: Receipt): Promise<void> => {
  const existing = await getReceipts();
  await AsyncStorage.setItem(RECEIPTS_KEY, JSON.stringify([...existing, receipt]));
};

export const updateReceipt = async (updated: Receipt): Promise<void> => {
  const existing = await getReceipts();
  const receipts = existing.map(r => (r.id === updated.id ? updated : r));
  await AsyncStorage.setItem(RECEIPTS_KEY, JSON.stringify(receipts));
};

export const deleteReceipt = async (id: string): Promise<void> => {
  const existing = await getReceipts();
  await AsyncStorage.setItem(
    RECEIPTS_KEY,
    JSON.stringify(existing.filter(r => r.id !== id)),
  );
};
