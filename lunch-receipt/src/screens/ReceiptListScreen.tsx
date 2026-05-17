import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getReceipts, deleteReceipt } from '../utils/storage';
import { formatCurrency, formatDate } from '../utils/helpers';
import { Receipt } from '../types';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const ReceiptListScreen = () => {
  const navigation = useNavigation<NavProp>();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadData = useCallback(async () => {
    const data = await getReceipts();
    setReceipts(data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  useFocusEffect(useCallback(() => { loadData(); }, [loadData]));

  const months = Array.from(new Set(receipts.map(r => r.date.substring(0, 7))))
    .sort()
    .reverse();

  const filtered = receipts.filter(r => r.date.startsWith(selectedMonth));
  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('삭제 확인', `"${name}" 영수증을 삭제할까요?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          await deleteReceipt(id);
          await loadData();
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Receipt }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('AddReceipt', { receiptId: item.id })}
      onLongPress={() => handleDelete(item.id, item.restaurantName)}
      activeOpacity={0.7}
    >
      <View style={styles.itemTop}>
        <Text style={styles.restaurantName}>{item.restaurantName}</Text>
        <Text style={styles.amount}>{formatCurrency(item.amount)}</Text>
      </View>
      <View style={styles.itemMeta}>
        <Text style={styles.metaText}>{formatDate(item.date)}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.categoryTag}>{item.category}</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.metaText}>{item.paidBy} 결제</Text>
        <Text style={styles.separator}>|</Text>
        <Text style={styles.metaText}>{item.attendees}명</Text>
      </View>
      {item.notes ? <Text style={styles.notes} numberOfLines={1}>💬 {item.notes}</Text> : null}
      <Text style={styles.hint}>길게 누르면 삭제 · 탭하면 수정</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.monthBar}>
        <FlatList
          data={months}
          horizontal
          keyExtractor={m => m}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 10, gap: 8 }}
          renderItem={({ item: m }) => (
            <TouchableOpacity
              style={[styles.monthChip, selectedMonth === m && styles.monthChipActive]}
              onPress={() => setSelectedMonth(m)}
            >
              <Text style={[styles.monthChipText, selectedMonth === m && styles.monthChipTextActive]}>
                {m}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.noMonthText}>영수증이 없습니다</Text>
          }
        />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          {filtered.length}건 · 합계{' '}
          <Text style={styles.summaryAmount}>{formatCurrency(totalAmount)}</Text>
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={r => r.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>이 달의 영수증이 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  monthBar: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' },
  monthChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  monthChipActive: { backgroundColor: '#2563EB' },
  monthChipText: { fontSize: 13, color: '#374151' },
  monthChipTextActive: { color: '#fff', fontWeight: '600' },
  noMonthText: { color: '#9CA3AF', fontSize: 13, paddingVertical: 10 },
  summary: { paddingHorizontal: 16, paddingVertical: 8 },
  summaryText: { fontSize: 13, color: '#6B7280' },
  summaryAmount: { fontWeight: 'bold', color: '#2563EB' },
  listContent: { padding: 12 },
  item: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  restaurantName: { fontSize: 15, fontWeight: '600', color: '#111827' },
  amount: { fontSize: 15, fontWeight: 'bold', color: '#2563EB' },
  itemMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  metaText: { fontSize: 12, color: '#6B7280' },
  separator: { fontSize: 10, color: '#D1D5DB' },
  categoryTag: { fontSize: 12, color: '#2563EB', fontWeight: '500' },
  notes: { marginTop: 6, fontSize: 12, color: '#9CA3AF' },
  hint: { marginTop: 6, fontSize: 10, color: '#D1D5DB' },
  emptyBox: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#9CA3AF', fontSize: 14 },
});

export default ReceiptListScreen;
